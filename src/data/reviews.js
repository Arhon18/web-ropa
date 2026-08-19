/**
 * Datos de Reseñas Verificadas y Prueba Social
 */

export const REVIEWS = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    author: 'Valentina Rossi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-07-28',
    title: 'Excepcional calidad de confección y caída impecable',
    comment: 'Compré el abrigo de lana merino en color Camel y superó todas mis expectativas. El forro en satén es una delicia al tacto y el peso de la lana abriga muchísimo sin sentirse pesado. Recibí incontables cumplidos en mi viaje a Milán.',
    verified: true,
    sizePurchased: 'S',
    colorPurchased: 'Camel Cálido',
    helpfulCount: 24,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop'
    ]
  },
  {
    id: 'rev-02',
    productId: 'prod-001',
    author: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-08-05',
    title: 'Un clásico atemporal que vale cada céntimo',
    comment: 'La estructura de los hombros y los acabados a mano son dignos de las mejores casas de alta costura. El envío llegó en 24h con un packaging ecológico impecable.',
    verified: true,
    sizePurchased: 'M',
    colorPurchased: 'Noir Profundo',
    helpfulCount: 17,
    photos: []
  },
  {
    id: 'rev-03',
    productId: 'prod-001',
    author: 'Elena G.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 4,
    date: '2026-08-11',
    title: 'Precioso, recomiendo revisar la guía de tallas',
    comment: 'El color es exactamente como en las fotos. Es ligeramente amplio en el pecho, por lo que si prefieres un fit más entallado, pide una talla menos. La lana no pica en absoluto.',
    verified: true,
    sizePurchased: 'L',
    colorPurchased: 'Camel Cálido',
    helpfulCount: 8,
    photos: []
  },
  {
    id: 'rev-04',
    productId: 'prod-002',
    author: 'Camila Silva',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-08-14',
    title: 'El vestido perfecto para eventos de noche',
    comment: 'La seda morera tiene un brillo sutil deslumbrante. El drapeado en el escote queda muy favorecedor.',
    verified: true,
    sizePurchased: 'S',
    colorPurchased: 'Champagne Satin',
    helpfulCount: 12,
    photos: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=400&auto=format&fit=crop'
    ]
  }
];

export const RECENT_PURCHASES = [
  { name: 'Sofía M.', location: 'Madrid, España', product: 'Abrigo Sartorial en Pura Lana Merino', timeAgo: 'hace 4 min', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
  { name: 'Lucía B.', location: 'Barcelona, España', product: 'Vestido Midi Plisado en Seda Natural', timeAgo: 'hace 9 min', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=200&auto=format&fit=crop' },
  { name: 'Mateo R.', location: 'Buenos Aires, Argentina', product: 'Camisa Oversize en Lino Orgánico', timeAgo: 'hace 18 min', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop' },
  { name: 'Alejandra P.', location: 'Ciudad de México', product: 'Pantalón Palazzo con Pinzas en Tencel™', timeAgo: 'hace 27 min', img: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=200&auto=format&fit=crop' }
];
