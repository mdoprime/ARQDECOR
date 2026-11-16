import { useRef, useState } from 'react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { media, slides } from './content'
import { Icon } from './ui'

export function Hero() {
  const swiper = useRef<SwiperInstance | null>(null)
  const [current, setCurrent] = useState(0)
  const [textSlide, setTextSlide] = useState(0)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function navigate(action: (carousel: SwiperInstance) => void) {
    if (!swiper.current) return
    swiper.current.autoplay.stop()
    action(swiper.current)
  }

  return <section className="hero" id="inicio" aria-label="Início"
    onMouseEnter={() => swiper.current?.autoplay.stop()}
    onMouseLeave={() => { if (!reducedMotion) swiper.current?.autoplay.start() }}>
    <h1 className="sr-only">ARQ Decor — Móveis sob medida</h1>
    <Swiper className="hero-swiper" modules={[A11y, Autoplay, Keyboard]}
      loop runCallbacksOnInit={false} speed={reducedMotion ? 0 : 500} keyboard={{ enabled: true }}
      autoplay={reducedMotion ? false : { delay: 5000, disableOnInteraction: true }}
      onSwiper={instance => { swiper.current = instance }}
      onSlideChange={instance => setCurrent(instance.realIndex)}
      onSlideChangeTransitionStart={() => setTextSlide(-1)}
      onSlideChangeTransitionEnd={instance => setTextSlide(instance.realIndex)}
      a11y={{ containerRoleDescriptionMessage: 'Carrossel', slideRole: 'group', slideLabelMessage: '{{index}} de {{slidesLength}}' }}>
      {slides.map((slide, index) => <SwiperSlide key={slide.image}>
        <img className="hero-image" src={media(`2025/07/${slide.image}`)} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} />
        <div className={`hero-copy${textSlide === index || reducedMotion ? ' is-visible' : ''}`}>
          <p className="slide-title">{slide.title}</p>
          <p className="slide-description">{slide.description}</p>
        </div>
      </SwiperSlide>)}
    </Swiper>
    <button className="hero-arrow hero-arrow--prev" type="button" aria-label="Slide anterior" onClick={() => navigate(s => s.slidePrev())}><Icon name="left" /></button>
    <button className="hero-arrow hero-arrow--next" type="button" aria-label="Próximo slide" onClick={() => navigate(s => s.slideNext())}><Icon name="right" /></button>
    <div className="hero-pagination" aria-label="Escolher slide">
      {slides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Mostrar slide ${index + 1}`} aria-current={current === index ? 'true' : undefined}
        onClick={() => navigate(s => s.slideToLoop(index))} />)}
    </div>
  </section>
}
