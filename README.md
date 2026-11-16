# ARQ Decor

Site de móveis sob medida recriado em React, Vite e TypeScript, com imagens, ícones e fontes servidos pelo próprio projeto. O [mapa da referência](docs/auditoria-site.md) registra as seções, interações e medidas do original.

## Executar e publicar

Use Node.js 22.12 ou superior e npm.

```sh
npm ci
npm run dev
```

Para executar a versão de produção com o servidor de contato:

```sh
npm ci
npm run build
npm start
```

O build do frontend fica em `dist/`. O servidor TypeScript compilado em `.server/` entrega o site e o endpoint `POST /api/contact`, redireciona `/home/` para `/` e retorna `404` para páginas ausentes. Escuta em `127.0.0.1:4173` por padrão. Em produção, mantenha o processo ativo e configure o proxy HTTPS do domínio para encaminhar a ele. Se optar por hospedar apenas `dist/`, configure o encaminhamento de `/api/contact`, o redirecionamento de `/home/` e a resposta 404 no próprio host.

## Domínio e formulário

Use [.env.example](.env.example) como modelo para criar `.env` na raiz do projeto. No servidor de produção, defina `SITE_URL` com a origem HTTPS final para publicar a URL canônica, o sitemap e a regra de indexação. Configure `SMTP_URL`, `CONTACT_FROM` e `CONTACT_TO` com os dados da conta de envio e o destinatário. Preserve as credenciais nas variáveis do servidor. Depois de configurar, envie uma mensagem de teste pelo domínio final e confira a caixa de destino.

Durante o desenvolvimento, `npm run dev` encaminha o formulário ao servidor local. Para testar o envio, deixe `npm start` rodando em outro terminal após o primeiro build. Com `SITE_URL` vazio, o desenvolvimento aceita a origem local encaminhada pelo Vite.
