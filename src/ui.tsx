import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { links, media, social, whatsapp } from './content'

type IconName = 'menu' | 'close' | 'left' | 'right' | 'instagram' | 'facebook' | 'whatsapp' | 'phone'

export function Icon({ name }: { name: IconName }) {
  return <span aria-hidden="true" className={`icon icon--${name}`} style={{ '--icon': `url("${media(`icons/${name}.svg`)}")` } as CSSProperties} />
}

function Logo() {
  return <a aria-label="ARQ Decor — início" href={import.meta.env.BASE_URL}>
    <img src={media('2025/07/logo-branco.png')} alt="ARQ Decor Móveis Sob Medida" width="300" height="70" />
  </a>
}

export function Header({ isHome }: { isHome: boolean }) {
  const [scrolled, setScrolled] = useState(window.scrollY > 60)
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState('inicio')
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 60)
      if (!isHome) return
      const section = links.filter(([id]) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 90).at(-1)
      setActive(section?.[0] ?? 'inicio')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isHome])

  const items = links.map(([id, label]) => <li key={id}>
    <a aria-current={isHome && active === id ? 'location' : undefined} href={`${isHome ? '' : import.meta.env.BASE_URL}#${id}`} onClick={() => setExpanded(false)}>{label}</a>
  </li>)

  return <>
    <a className="skip-link" href="#content">Ir para o conteúdo</a>
    <header className={`site-header${scrolled || !isHome ? ' site-header--scrolled' : ''}`} onKeyDown={event => {
      if (event.key === 'Escape' && expanded) {
        setExpanded(false)
        toggle.current?.focus()
      }
    }}>
      <div className="header-inner">
        <div className="header-logo"><Logo /></div>
        <nav className="desktop-nav" aria-label="Menu"><ul>{items}</ul></nav>
        <div className="header-cta"><a className="pill" href="#">Falar com especialista</a></div>
        <button className="menu-toggle" ref={toggle} type="button" aria-label={expanded ? 'Fechar menu' : 'Abrir menu'} aria-controls="mobile-menu" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
          <Icon name={expanded ? 'close' : 'menu'} />
        </button>
      </div>
      <nav className="mobile-nav" id="mobile-menu" aria-label="Menu móvel" inert={!expanded}>
        <div><ul>{items}</ul></div>
      </nav>
    </header>
  </>
}

export function SocialLinks() {
  return <ul className="social">
    {social.map(link => <li key={link.name}><a aria-label={link.name} href={link.url}><Icon name={link.icon} /></a></li>)}
  </ul>
}

export function Footer() {
  return <footer className="site-footer">
    <div className="wrap footer-grid">
      <div className="footer-logo"><Logo /></div>
      <div>
        <h2>Contatos</h2>
        <ul className="footer-phones">
          <li><a href={whatsapp}><Icon name="whatsapp" /><span>(19) 99202-1053</span></a></li>
          <li><Icon name="phone" /><span>(19) 3455-1662</span></li>
        </ul>
      </div>
      <div>
        <h2>Acesse nossas redes</h2>
        <SocialLinks />
      </div>
    </div>
  </footer>
}

export function Reveal({ children, direction = 'up', delay = 0, className = '' }: {
  children: ReactNode
  direction?: 'up' | 'left'
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(!('IntersectionObserver' in window))
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return <div className={`reveal reveal--${direction} ${visible ? 'is-visible' : ''} ${className}`} style={{ animationDelay: `${delay}ms` }} ref={ref}>{children}</div>
}
