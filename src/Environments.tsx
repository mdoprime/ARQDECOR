import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { A11y, Zoom } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { galleries } from './content'
import { Icon } from './ui'

type GalleryImage = (typeof galleries)[number]['images'][number]

function Lightbox({ images, start, onOpenEnd }: { images: GalleryImage[]; start: number; onOpenEnd: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const swiper = useRef<SwiperInstance | null>(null)
  const [index, setIndex] = useState(start)
  const [zoomed, setZoomed] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [share, setShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const modal = dialog.current
    const oldOverflow = document.body.style.overflow
    modal?.showModal()
    document.body.style.overflow = 'hidden'
    function trackFullscreen() { setFullscreen(document.fullscreenElement === modal) }
    document.addEventListener('fullscreenchange', trackFullscreen)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener('fullscreenchange', trackFullscreen)
      if (document.fullscreenElement === modal) void document.exitFullscreen().catch(() => {})
      modal?.close()
    }
  }, [])

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await dialog.current?.requestFullscreen()
  }

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); swiper.current?.slidePrev() }
    if (event.key === 'ArrowRight') { event.preventDefault(); swiper.current?.slideNext() }
  }

  const current = images[index]
  const imageUrl = new URL(current.url, location.href).href
  return <dialog ref={dialog} className="lightbox" aria-label="Galeria ampliada" onClose={onOpenEnd} onKeyDown={handleKeys}>
    <span className="lightbox-counter" aria-live="polite">{index + 1} / {images.length}</span>
    <div className="lightbox-actions">
      {document.fullscreenEnabled && <button type="button" aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} onClick={() => void toggleFullscreen().catch(() => {})}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5" /></svg>
      </button>}
      <button type="button" aria-label={zoomed ? 'Reduzir zoom' : 'Ampliar'} onClick={() => swiper.current?.zoom.toggle()}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="10" r="6" /><path d="m14.5 14.5 5 5M7 10h6" />{!zoomed && <path d="M10 7v6" />}</svg>
      </button>
      <button type="button" aria-label="Compartilhar" aria-expanded={share} onClick={() => { setShare(!share); setCopied(false) }}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M14 5v4C8 9 5 13 4 19c3-4 6-6 10-6v4l6-6z" /></svg>
      </button>
      <button type="button" aria-label="Fechar (Esc)" autoFocus onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      {share && <div className="lightbox-share">
        <button type="button" onClick={async () => {
          try { await navigator.clipboard.writeText(imageUrl); setCopied(true) }
          catch { setCopied(false) }
        }}>{copied ? 'Link copiado' : 'Copiar link'}</button>
        <a href={current.url} download>Baixar imagem</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`} target="_blank" rel="noreferrer">Compartilhar no Facebook</a>
      </div>}
    </div>
    <Swiper className="lightbox-swiper" modules={[A11y, Zoom]} zoom initialSlide={start} loop speed={400}
      onSwiper={instance => { swiper.current = instance }}
      onSlideChange={instance => { setIndex(instance.realIndex); setShare(false); setZoomed(false) }}
      onZoomChange={(_instance, scale) => setZoomed(scale > 1)}
      onClick={(_instance, event) => {
        if (!(event.target instanceof HTMLImageElement)) dialog.current?.close()
      }}>
      {images.map(image => <SwiperSlide key={image.title}>
        <div className="swiper-zoom-container"><img src={image.url} width="1380" height="920" alt={image.description} /></div>
      </SwiperSlide>)}
    </Swiper>
    <button className="lightbox-arrow lightbox-arrow--prev" type="button" aria-label="Foto anterior" onClick={() => swiper.current?.slidePrev()}><Icon name="left" /></button>
    <button className="lightbox-arrow lightbox-arrow--next" type="button" aria-label="Próxima foto" onClick={() => swiper.current?.slideNext()}><Icon name="right" /></button>
    <span className="lightbox-caption">{current.title}</span>
  </dialog>
}

const phoneQuery = '(max-width: 767px)'

export function Environments() {
  const [selected, setSelected] = useState<number | null>(0)
  const [opened, setOpened] = useState<number | null>(null)
  const [mobile, setMobile] = useState(() => window.matchMedia(phoneQuery).matches)
  const thumbnail = useRef<HTMLAnchorElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    const query = window.matchMedia(phoneQuery)
    const update = () => {
      setMobile(query.matches)
      if (!query.matches) setSelected(value => value ?? 0)
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  function handleTabKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const count = galleries.length
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1
      : (index + (event.key === 'ArrowLeft' ? count - 1 : 1)) % count
    setSelected(next)
    tabs.current[next]?.focus()
  }

  function button(index: number) {
    const expanded = selected === index
    const common = {
      className: 'gallery-tab',
      'aria-controls': `gallery-panel-${index}`,
      id: `gallery-tab-${index}`,
      type: 'button' as const,
      ref: (el: HTMLButtonElement | null) => { tabs.current[index] = el },
      onClick: () => setSelected(mobile && expanded ? null : index),
    }
    return mobile
      ? <button {...common} aria-expanded={expanded}>{galleries[index].name}</button>
      : <button {...common} role="tab" aria-selected={expanded} tabIndex={expanded ? 0 : -1} onKeyDown={event => handleTabKeys(event, index)}>{galleries[index].name}</button>
  }

  function panel(index: number) {
    const gallery = galleries[index]
    return <div className="gallery-panel" id={`gallery-panel-${index}`} role={mobile ? 'region' : 'tabpanel'} aria-labelledby={`gallery-tab-${index}`} hidden={index !== selected}>
      {index === selected && <div className="gallery-grid" style={{ '--ratio': gallery.ratio } as CSSProperties}>
        {gallery.images.map((image, number) => <a href={image.url} key={image.title} aria-label={`Ampliar ${image.description.toLowerCase()}`} onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          event.preventDefault()
          thumbnail.current = event.currentTarget
          setOpened(number)
        }}><img src={image.url} width="1380" height="920" alt={image.description} loading="lazy" /></a>)}
      </div>}
    </div>
  }

  return <section className="environments" id="ambientes">
    <div className="wrap environments-inner">
      <h2>Ambientes</h2>
      {mobile ? <div className="gallery-accordion">
        {galleries.map(({ name }, index) => <div key={name}>{button(index)}{panel(index)}</div>)}
      </div> : <>
        <div className="gallery-tabs" role="tablist" aria-label="Tipos de ambiente">{galleries.map(({ name }, index) => <div key={name} role="presentation">{button(index)}</div>)}</div>
        {galleries.map(({ name }, index) => <div key={name}>{panel(index)}</div>)}
      </>}
    </div>
    {selected !== null && opened !== null && <Lightbox images={galleries[selected].images} start={opened} onOpenEnd={() => {
      setOpened(null)
      thumbnail.current?.focus()
    }} />}
  </section>
}
