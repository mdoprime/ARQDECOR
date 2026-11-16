import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { isIP } from 'node:net'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const documentHtml = await readFile(resolve(dist, 'index.html'), 'utf8')
const siteUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined
if (siteUrl && (!['http:', 'https:'].includes(siteUrl.protocol) || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password)) {
  throw new Error('SITE_URL deve conter somente a origem do site, como https://www.exemplo.com.')
}
const siteOrigin = siteUrl?.origin
const canonical = siteOrigin
  ? `<link rel="canonical" href="${siteOrigin}/">`
  : '<meta name="robots" content="noindex">'
const homeHtml = documentHtml.replace('</head>', `    ${canonical}\n  </head>`)
const notFoundHtml = documentHtml
  .replace(/<title>.*?<\/title>/, '<title>Página não encontrada – ARQ Decor</title>')
  .replace('</head>', '    <meta name="robots" content="noindex">\n  </head>')

const { SMTP_URL, CONTACT_FROM, CONTACT_TO } = process.env
const mailer = SMTP_URL && CONTACT_FROM && CONTACT_TO
  ? nodemailer.createTransport({
    url: SMTP_URL,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    disableFileAccess: true,
    disableUrlAccess: true,
  })
  : null

const rateWindow = 10 * 60 * 1000
const attempts = new Map<string, { count: number; expires: number }>()
setInterval(() => {
  const now = Date.now()
  for (const [ip, attempt] of attempts) if (attempt.expires <= now) attempts.delete(ip)
}, rateWindow).unref()

function text(res: ServerResponse, status: number, body: string, contentType: string, head = false) {
  res.writeHead(status, { 'Content-Type': contentType, 'Content-Length': Buffer.byteLength(body) })
  res.end(head ? undefined : body)
}

function json(res: ServerResponse, status: number, message?: string) {
  res.setHeader('Cache-Control', 'no-store')
  text(res, status, JSON.stringify(message ? { ok: false, message } : { ok: true }), 'application/json; charset=utf-8')
}

function senderAddress(req: IncomingMessage) {
  const forwarded = req.headers['x-real-ip']
  if (process.env.TRUST_PROXY === 'true' && typeof forwarded === 'string' && isIP(forwarded)) return forwarded
  return req.socket.remoteAddress ?? 'unknown'
}

function takeAttempt(req: IncomingMessage, res: ServerResponse) {
  const ip = senderAddress(req)
  const now = Date.now()
  const attempt = attempts.get(ip)
  if (!attempt || attempt.expires <= now) {
    if (attempts.size >= 10000) {
      json(res, 503, 'O formulário está ocupado. Tente novamente em alguns minutos.')
      return false
    }
    attempts.set(ip, { count: 1, expires: now + rateWindow })
    return true
  }
  if (attempt.count < 5) {
    attempt.count += 1
    return true
  }
  res.setHeader('Retry-After', Math.ceil((attempt.expires - now) / 1000))
  json(res, 429, 'Muitas tentativas de envio. Aguarde alguns minutos e tente novamente.')
  return false
}

const maxBody = 16 * 1024
async function readContact(req: IncomingMessage) {
  let bytes = 0
  const chunks: Buffer[] = []
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    bytes += chunk.length
    if (bytes > maxBody) { req.resume(); return { tooLarge: true } as const }
    chunks.push(chunk)
  }
  try {
    return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown } as const
  } catch {
    return { value: null } as const
  }
}

async function contact(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, 'Método indisponível.')
  }
  if (req.headers.origin && (siteOrigin ? req.headers.origin !== siteOrigin
    : !['http://', 'https://'].some(protocol => req.headers.origin === protocol + req.headers.host))) {
    req.resume()
    return json(res, 403, 'Origem de envio inválida.')
  }
  if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    req.resume()
    return json(res, 415, 'Formato de envio inválido.')
  }
  if (Number(req.headers['content-length']) > maxBody) {
    req.resume()
    return json(res, 413, 'A mensagem excede o limite permitido.')
  }
  const body = await readContact(req)
  if (body.tooLarge) return json(res, 413, 'A mensagem excede o limite permitido.')
  if (!body.value || typeof body.value !== 'object') return json(res, 400, 'Envio inválido.')
  const { name, phone, message, website } = body.value as Record<string, unknown>
  if (typeof website === 'string' && website.trim()) return json(res, 200)
  if (typeof phone !== 'string' || phone.length > 30 || !/^[0-9\s()+.\-]+$/.test(phone)
    || ![10, 11, 12, 13].includes(phone.replace(/\D/g, '').length)) return json(res, 400, 'Informe um telefone com DDD válido.')
  if (typeof name !== 'string' || name.length > 120 || typeof message !== 'string' || message.length > 3000) {
    return json(res, 400, 'Revise o nome e a mensagem.')
  }
  if (!mailer) return json(res, 503, 'O envio está temporariamente indisponível. Fale pelo WhatsApp no rodapé.')
  if (!takeAttempt(req, res)) return
  try {
    await mailer.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      subject: 'Novo contato pelo site — ARQ Decor',
      text: `Nome: ${name.trim() || 'Não informado'}\nWhatsApp: ${phone.trim()}\n\n${message.trim() || 'Nenhuma mensagem informada.'}`,
    })
  } catch {
    console.error('O transporte SMTP não aceitou uma mensagem do formulário.')
    return json(res, 502, 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp no rodapé.')
  }
  return json(res, 200)
}

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
}

async function route(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', 'http://localhost')
  const head = req.method === 'HEAD'
  const path = url.pathname
  if (path === '/api/contact') {
    await contact(req, res)
    return
  }
  if (!head && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, HEAD')
    return text(res, 405, 'Método indisponível.', 'text/plain; charset=utf-8')
  }
  if (path === '/home/' || path === '/home' || path === '/index.html') {
    res.writeHead(301, { Location: '/' + url.search }).end()
    return
  }
  if (path === '/') return text(res, 200, homeHtml, 'text/html; charset=utf-8', head)
  if (path === '/robots.txt') return text(res, 200, siteOrigin ? `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n', 'text/plain; charset=utf-8', head)
  if (path === '/sitemap.xml' && siteOrigin) {
    return text(res, 200, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteOrigin}/</loc></url></urlset>\n`, 'application/xml; charset=utf-8', head)
  }
  if (path.startsWith('/media/') || path.startsWith('/assets/')) {
    const file = resolve(dist, '.' + decodeURIComponent(path))
    const contentType = contentTypes[extname(file)]
    if (file.startsWith(dist.endsWith(sep) ? dist : dist + sep) && contentType) {
      const info = await stat(file).catch(() => null)
      if (info?.isFile()) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': info.size,
          'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=86400',
          'X-Content-Type-Options': 'nosniff',
        })
        if (head) res.end()
        else createReadStream(file).on('error', () => res.destroy()).pipe(res)
        return
      }
    }
    return text(res, 404, 'Arquivo não encontrado.', 'text/plain; charset=utf-8', head)
  }
  return text(res, 404, notFoundHtml, 'text/html; charset=utf-8', head)
}

const server = createServer({ requestTimeout: 20000, headersTimeout: 10000 }, (req, res) => {
  void route(req, res).catch(error => {
    if (res.destroyed) return
    if (res.headersSent) { res.destroy(); return }
    if (error instanceof URIError) text(res, 400, 'URL inválida.', 'text/plain; charset=utf-8')
    else text(res, 500, 'Erro interno.', 'text/plain; charset=utf-8')
  })
})
const port = Number(process.env.PORT || '4173')
const host = process.env.HOST || '127.0.0.1'
server.listen(port, host, () => console.log(`ARQ Decor disponível em http://${host}:${port}`))
