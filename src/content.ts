export const links = [
  ['inicio', 'Início'],
  ['quemsomos', 'Quem Somos'],
  ['ambientes', 'Ambientes'],
  ['contato', 'Contato'],
] as const

export function media(path: string) {
  return `${import.meta.env.BASE_URL}media/${path}`
}

export const slides = [
  { image: 'banner.jpg', title: 'Feito para o seu espaço', description: 'Soluções sob medida, com qualidade e sofisticação.' },
  { image: 'banner2.jpg', title: 'Detalhes que impressionam', description: 'Precisão, cuidado e acabamento impecável.' },
  { image: 'banner4.jpg', title: 'Você no centro de tudo', description: 'Projetos pensados com você e para você.' },
]

export const collections = [
  { title: 'Residencial', image: 'resdencial', offset: 0 },
  { title: 'Sala Comercial', image: 'sala-comercial', offset: 300 },
  { title: 'Corporativo', image: 'corporativo', offset: 600 },
]

export const about = [
  'A ARQ Decor Móveis Sob Medida iniciou suas atividades em 2016, na cidade de Santa Bárbara d’Oeste – SP, com o compromisso de oferecer soluções personalizadas e de alto padrão em marcenaria.',
  'Desde então, consolidou-se no mercado pela excelência no atendimento e pela qualidade dos produtos entregues.',
  'Nossa fábrica, localizada no mesmo endereço, é equipada com maquinários de alta precisão e tecnologia de ponta, o que garante eficiência nos processos e um acabamento impecável em cada projeto.',
  'Trabalhamos com foco em funcionalidade, estética e durabilidade, sempre priorizando as necessidades e expectativas dos nossos clientes.',
]

export const galleries = [
  { name: 'Residencial', prefix: 'cozinha', ratio: '4 / 3' },
  { name: 'Comercial', prefix: 'comercial', ratio: '3 / 2' },
  { name: 'Corporativo', prefix: 'corp', ratio: '3 / 2' },
].map(({ name, prefix, ratio }) => ({
  name,
  ratio,
  images: [1, 2, 3].map(number => ({
    title: `${prefix}${number}`,
    description: `Ambiente ${name.toLowerCase()} ${number}`,
    url: media(`2025/08/${prefix}${number}.png`),
  })),
}))

export const whatsapp = 'https://wa.me/5519992021053'
export const social = [
  { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/arqdecormoveissobmedida' },
  { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/arqdecormoveissobmedida' },
] as const
