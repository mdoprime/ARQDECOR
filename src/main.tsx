import { createRoot } from 'react-dom/client'
import { useLayoutEffect } from 'react'
import 'swiper/css'
import 'swiper/css/zoom'
import './style.css'
import { about, collections, media } from './content'
import { Contact } from './Contact'
import { Environments } from './Environments'
import { Hero } from './Hero'
import { Footer, Header, Reveal } from './ui'

function Collections() {
  return <section className="wrap collections" aria-label="Coleções">
    {collections.map(({title, image, offset}) => <Reveal key={image} delay={offset} className="collection">
      <a href="#ambientes">
        <img src={media(`2025/07/${image}-819x1024.jpg`)}
          srcSet={[[240, '-240x300'], [768, '-768x960'], [819, '-819x1024'], [1080, '']].map(([width, suffix]) => `${media(`2025/07/${image}${suffix}.jpg`)} ${width}w`).join(', ')}
          sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1180px) calc((100vw - 140px) / 3), 347px"
          width="800" height="1000" loading="lazy" alt="" />
        <span className="collection-label"><strong>{title}</strong> Coleção</span>
      </a>
    </Reveal>)}
  </section>
}

function About() {
  return <section className="about" id="quemsomos">
    <div className="about-copy"><h2>Quem Somos</h2>{about.map(text => <p key={text}>{text}</p>)}</div>
  </section>
}

const basePath = import.meta.env.BASE_URL
if (window.location.pathname === `${basePath}home/` || window.location.pathname === `${basePath}home`) {
  window.location.replace(`${basePath}${window.location.search}${window.location.hash}`)
}
const isHome = window.location.pathname === basePath || window.location.pathname === `${basePath}index.html`
if (!isHome) document.title = 'Página não encontrada – ARQ Decor'

function App() {
  useLayoutEffect(() => {
    const anchor = document.getElementById(location.hash.slice(1))
    if (anchor) anchor.scrollIntoView({ behavior: 'instant' })
  }, [])

  return <>
    <Header isHome={isHome} />
    <main id="content">
      {isHome ? <><Hero /><Collections /><About /><Environments /><Contact /></>
        : <section className="wrap not-found">
          <h1>A página não pode ser encontrada.</h1><p>Parece que nada foi encontrado neste local.</p>
        </section>}
    </main>
    <Footer />
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
