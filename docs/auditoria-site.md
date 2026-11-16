# Mapa do site ARQ Decor

Referência auditada em 16/11/2026. O domínio informado exibe a marca **ARQ Decor — Móveis sob medida**. A auditoria cobre o HTML, o CSS, o JavaScript e as rotas públicas, com testes no Chrome em desktop, tablet e celular emulado.

[Site de referência](https://mistyrose-oryx-471466.hostingersite.com/) · [Inventário de mídia e estilos medidos](auditoria-site.json) · [Capturas de desktop](referencia-desktop.jpg) · [Capturas de celular](referencia-celular.jpg)

## Rotas e estrutura

O sitemap e a REST API retornam uma única página publicada, `home` (ID `39`), com URL canônica `/`. A coleção pública de posts está vazia. `/home/` responde com `301` para `/`. Uma URL inexistente e as rotas `/privacy-policy/` e `/politica-de-privacidade/` responderam `404`. A página 404 usa o cabeçalho e o rodapé compartilhados e um aviso de página ausente. As categorias da galeria e as imagens ampliadas são estados da home.

[Sitemap de páginas](https://mistyrose-oryx-471466.hostingersite.com/wp-sitemap-posts-page-1.xml) · [Páginas publicadas na REST API](https://mistyrose-oryx-471466.hostingersite.com/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,link,title,template)

| Ordem | Bloco | Estrutura e navegação |
| --- | --- | --- |
| 1 | Cabeçalho | Logo branco que aponta para `/`, menu com `#inicio`, `#quemsomos`, `#ambientes`, `#contato` e botão de desktop “Falar com especialista”, cujo destino atual é `#`. O link de acessibilidade aponta para `#content`, um ID ausente na home atual. |
| 2 | Início `#inicio` | Carrossel de tela inteira. Três imagens de fundo com título e descrição em branco, centralizados. Setas laterais e três indicadores na base. |
| 3 | Coleções | Cards Residencial, Sala Comercial e Corporativo, com foto vertical e tarja escura. Os três apontam para `#ambientes`. |
| 4 | Quem Somos `#quemsomos` | Título e quatro parágrafos sobre a empresa, a fábrica e o trabalho sob medida. Conteúdo à esquerda sobre a imagem de fundo de toda a seção. O bloco direito está vazio. |
| 5 | Ambientes `#ambientes` | Título alinhado à esquerda, abas Residencial (inicial), Comercial e Corporativo. Cada painel contém três imagens com ampliação em modal. |
| 6 | Contato `#contato` | Foto quadrada à esquerda e, à direita, título, ícones de Instagram e Facebook e formulário. No celular, a foto vem antes do conteúdo. |
| 7 | Rodapé | Fundo `#292929`, logo, bloco Contatos e bloco Acesse nossas redes. O WhatsApp abre `https://wa.me/5519992021053`. O número fixo `(19) 3455-1662` é texto. As redes são `arqdecormoveissobmedida` no Instagram e Facebook. No celular, os três blocos ficam empilhados. |

## Comportamento e animações

- **Cabeçalho.** Fixo no topo e transparente na posição inicial. O limiar configurado é 60 px de rolagem. Depois do limiar, o fundo passa a `#000000C2` e o filtro usa `blur(20px) saturate(1.8)`. O menu de desktop tem sublinhado com fade. Em tablet e celular, o hambúrguer abre um menu branco na largura da página e fecha ao selecionar uma seção. Testado com `#ambientes`, incluindo a atualização do hash.
- **Carrossel.** Swiper com um slide por vez, loop, troca automática em 5.000 ms e transição horizontal de 500 ms. Os textos usam `fadeInUp`, independentemente da transição do slide. Setas, indicadores e deslocamento por gesto estão habilitados. No navegador, passar o mouse sobre o carrossel interrompeu o autoplay e mover o cursor para fora o retomou. O clique na seta avançou o slide e deixou o autoplay desligado durante a janela de teste de mais de cinco segundos.
- **Coleções.** Entrada `fadeInUp` de 1,25 s ao entrar na área visível, com atrasos de 0, 300 e 600 ms, respectivamente. As tarjas são posicionadas de forma absoluta. O primeiro card, por exemplo, usa `top: 352px` e `left: 31px` em relação ao card. A mesma posição pode deixar a tarja abaixo da imagem em tablets estreitos.
- **Quem Somos.** Fundo com `cover` e posição central, com `background-attachment: fixed` a partir de 1025 px. Em tablet e celular o fundo rola junto com a página. A imagem é carregada perto da área visível.
- **Ambientes.** O estado selecionado muda o painel da galeria. No celular, o painel aparece logo abaixo do respectivo botão. Imagens com carregamento sob demanda e sobreposição preta a 50% em hover/foco, com transição configurada em 800 ms. O modal tem navegação dentro da categoria, contador, legenda com o nome da imagem, zoom, tela cheia, compartilhamento e botão de fechar. A passagem de `cozinha1.png` para `cozinha2.png` e o fechamento por `Esc` foram testados em desktop e celular emulado.
- **Contato.** A foto entra com `fadeInLeft` de 1,25 s quando a seção entra na área visível.

## Tipografia, medidas e responsividade

A família é **Plus Jakarta Sans**, disponibilizada em WOFF2 pelo próprio domínio com `font-display: swap`. O Chrome carregou os pesos 300, 400, 500 e 700 normais, além de 400 e 700 em itálico, no subconjunto Latin. O CSS da fonte também declara outros pesos e subconjuntos. Os URLs da folha e dos arquivos observados estão no inventário.

| Elemento | Medida |
| --- | --- |
| Corpo das seções | `16px / 26px`, peso 400 |
| Títulos das seções | `30px / 35px`, peso 700 |
| Títulos do rodapé | `22px / 35px`, peso 700 |
| Título do carrossel | `56px / 35px` desktop, `45px / 40,5px` tablet, `37px / 33,3px` celular, peso 700, espaçamento entre letras `-1,7px` |
| Descrição do carrossel | `23px / 35px` desktop, `22px / 35px` tablet, `17px / 18,7px` celular, peso 300. Espaçamento entre letras `3px` em desktop e `0px` nas outras larguras. |
| Navegação de desktop | `16px / 26px`, peso 400 |
| Botões principais | `14px / 35px`, peso 500, raio `50px` |
| Campos do formulário | `44px` de altura nos campos de uma linha, preenchimento `8px 16px`, raio `3px`. O botão Enviar tem `40px` de altura e ocupa a largura disponível. |

O conteúdo em caixas tem largura máxima de `1140px` em desktop. A altura do carrossel é `100vh`. As coleções usam três colunas em desktop e tablet e uma em celular. A seção Quem Somos tem `120px` de preenchimento vertical e o bloco de texto tem margem esquerda de `300px` acima de 767 px. Ambientes, Contato e rodapé usam `80px` de preenchimento vertical na seção ou na caixa interna. Em Ambientes, há `10px` entre as imagens e `10px` entre os botões das abas. O recorte da galeria residencial é `4:3`; Comercial e Corporativo usam `3:2`.

| Largura da janela | Menu | Abas | Colunas medidas na galeria |
| --- | --- | --- | --- |
| ≥ 1025 px | Horizontal, com CTA | Horizontais | 3 |
| 1024 px | Hambúrguer | Horizontais | 3 |
| 768 a 1023 px | Hambúrguer | Horizontais | 2 |
| 767 px | Hambúrguer | Empilhadas | 2 |
| ≤ 766 px | Hambúrguer | Empilhadas | 1 |

O fundo da página é `#1D1D1D`, também usado como cor primária e de destaque. A paleta inclui `#666666` secundária, `#7A7A7A` para texto, `#DED5C8` areia, `#9A8B77` taupe, `#FFFFFF` branco e `#F0F0F0` cinza claro. A galeria usa `#202020` no fundo, texto ativo `#DED5C8` e inativo `#666666`. O rodapé usa `#292929`.

## Imagens e ícones

As imagens abaixo são relativas a `/wp-content/uploads/`. O inventário JSON traz os 32 URLs de imagem referenciados no HTML e nas folhas de estilo da página, incluindo variantes responsivas.

| Uso | Arquivo original |
| --- | --- |
| Logo no cabeçalho e rodapé | `2025/07/logo-branco.png`, 300 × 70 |
| Favicon e ícone touch | `2025/07/favicon.png` e `2025/07/favicon-150x150.png` |
| Carrossel, na ordem | `2025/07/banner.jpg`, `banner2.jpg`, `banner4.jpg`, todos com `cover` centralizado |
| Cards, na ordem | `2025/07/resdencial.jpg`, `sala-comercial.jpg`, `corporativo.jpg`. As quatro larguras no `srcset` são 240, 768, 819 e 1080 px. `resdencial` é a grafia do arquivo. |
| Fundo Quem Somos | `2025/07/Untitled-2-min.png` |
| Galeria Residencial | `2025/08/cozinha1.png` a `cozinha3.png` |
| Galeria Comercial | `2025/08/comercial1.png` a `comercial3.png` |
| Galeria Corporativo | `2025/08/corp1.png` a `corp3.png` |
| Foto Contato | `2025/08/contato.jpg`, 1024 × 1024, com variantes quadradas de 150, 300 e 768 px |

As nove imagens da galeria têm 1380 × 920 px e são usadas tanto na grade quanto no modal. Os ícones de menu, navegação, telefone e redes são SVGs inline no HTML público.

## Configuração e migração

- A origem é Hostinger com WordPress 6.8.10, PHP 8.2.35, tema Hello Elementor 3.4.4, Elementor 4.4.0, PRO Elements 3.30.0 e Sticky Header Effects 2.2.3. Swiper 8.4.5, E-Gallery 1.2.0 e SmartMenus 1.2.1 implementam partes das interações atuais. As folhas por ID são `post-6.css` (kit global), `post-20.css` (cabeçalho), `post-39.css` (home) e `post-97.css` (rodapé).
- O documento usa `pt-BR`, título “ARQ Decor – Móveis sob medida” e canonical na raiz. O `robots.txt` atual bloqueia o Googlebot e permite os demais agentes. A regra de indexação e a URL canônica do destino devem refletir o domínio definitivo.
- **Formulário.** `Nome` é texto opcional, `DDD + whatsapp` é telefone obrigatório e `Mensagem` é uma área de quatro linhas opcional. O campo do telefone aparece internamente como `form_fields[email]`. O widget usa `POST` para `/wp-admin/admin-ajax.php` com a ação `elementor_pro_forms_send_form` e IDs `post_id=39` e `form_id=85002d6`. No Chrome, o campo vazio falhou na validação nativa, mas `abc` passou apesar do atributo `pattern`. A entrega, o destinatário, as ações após o envio e a validação do servidor exigem acesso à configuração do WordPress ou um teste autorizado de envio. Nenhuma mensagem foi enviada na auditoria.
- **Implementação React + Vite.** A estrutura pública cabe em uma página com âncoras nativas. Usar componentes para cabeçalho, carrossel, coleções, Quem Somos, abas/galeria, contato e rodapé. Servir imagens, fontes e ícones junto com o build. Testar o deploy com `/home/` redirecionando para `/` e URLs inválidas respondendo `404`.
- **Troca de servidor.** O formulário é a integração pública que precisa de um backend ou serviço de envio no destino. A confirmação do destinatário, dos estados de sucesso/erro e do recebimento deve acontecer antes da troca. O botão “Falar com especialista” pode manter `href="#"` para reproduzir o original ou receber um destino definido para o novo site.

[robots.txt atual](https://mistyrose-oryx-471466.hostingersite.com/robots.txt) · [CSS da home](https://mistyrose-oryx-471466.hostingersite.com/wp-content/uploads/elementor/css/post-39.css)
