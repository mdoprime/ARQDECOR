import { useState } from 'react'
import type { FormEvent } from 'react'
import { media } from './content'
import { Reveal, SocialLinks } from './ui'

export function Contact() {
  const [phase, setPhase] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (phase === 'sending') return
    const form = event.currentTarget
    const fields = new FormData(form)
    setPhase('sending')
    setMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields)),
        signal: AbortSignal.timeout(25000),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) {
        setPhase('error')
        setMessage(result.message || 'Não foi possível enviar. Tente novamente.')
        return
      }
      form.reset()
      setPhase('success')
      setMessage('Mensagem enviada com sucesso.')
    } catch {
      setPhase('error')
      setMessage('Não foi possível enviar. Tente novamente ou fale pelo WhatsApp no rodapé.')
    }
  }

  return <section id="contato" className="wrap contact">
    <Reveal direction="left">
      <img className="contact-image" src={media('2025/08/contato.jpg')} alt="Atendimento da ARQ Decor" width="1024" height="1024" loading="lazy"
        srcSet={['contato-150x150.jpg 150w', 'contato-300x300.jpg 300w', 'contato-768x768.jpg 768w', 'contato.jpg 1024w'].map(variant => media(`2025/08/${variant}`)).join(', ')}
        sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1180px) calc((100vw - 100px) / 2), 540px" />
    </Reveal>
    <div className="contact-copy">
      <h2>Contato</h2>
      <p>Acesse nossas redes sociais</p>
      <SocialLinks />
      <p>Ou envie uma mensagem</p>
      <form className="contact-form" onSubmit={send} aria-busy={phase === 'sending'}>
        <label className="sr-only" htmlFor="contact-name">Nome</label>
        <input id="contact-name" name="name" placeholder="Nome" autoComplete="name" maxLength={120} />
        <label className="sr-only" htmlFor="contact-phone">DDD + whatsapp</label>
        <input id="contact-phone" name="phone" type="tel" placeholder="DDD + whatsapp" autoComplete="tel"
          required pattern={String.raw`[0-9\s\(\)\+\-\.]{8,30}`} maxLength={30} />
        <label className="sr-only" htmlFor="contact-message">Mensagem</label>
        <textarea id="contact-message" name="message" placeholder="Mensagem" rows={4} maxLength={3000} />
        <div hidden><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <button className="pill" type="submit" disabled={phase === 'sending'}>{phase === 'sending' ? 'Enviando…' : 'Enviar'}</button>
        {message && <p className="contact-status" role={phase === 'error' ? 'alert' : 'status'}>{message}</p>}
      </form>
    </div>
  </section>
}
