/**
 * Catálogo de Productos de Alta Moda (AURA Studio)
 * Cada producto cuenta con múltiples vistas/ángulos, variaciones de color/talla/material,
 * stock dinámico por combinación, ficha técnica detallada y preguntas frecuentes.
 */

export const PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'AUR-WL-2026-01',
    slug: 'abrigo-lana-merino-sartorial',
    name: 'Abrigo Sartorial en Pura Lana Merino',
    subtitle: 'Confección artesanal de corte estructurado y forro en satén de seda',
    category: 'abrigos',
    price: 189.00,
    originalPrice: 245.00,
    rating: 4.9,
    reviewCount: 42,
    badge: 'Bestseller',
    badgeType: 'sale',
    isNew: false,
    description: 'Una pieza imprescindible que equilibra la elegancia arquitectónica con el máximo confort térmico. Confeccionado en Florencia con lana merino 100% de origen ético, solapas de muesca pulidas y botones grabados en cuerno natural.',
    materials: ['Lana Merino 100%', 'Cachemira Silk Blend', 'Lana Virgen Doble'],
    selectedMaterial: 'Lana Merino 100%',
    colors: [
      {
        id: 'camel',
        name: 'Camel Cálido',
        hex: '#C19A6B',
        images: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop'
        ]
      },
      {
        id: 'noir',
        name: 'Noir Profundo',
        hex: '#18181b',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop'
        ]
      },
      {
        id: 'sage',
        name: 'Verde Salvia',
        hex: '#8A9A86',
        images: [
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=900&auto=format&fit=crop'
        ]
      }
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 2 }, // Low stock trigger
      { size: 'M', stock: 8 },
      { size: 'L', stock: 1 }, // Low stock trigger
      { size: 'XL', stock: 0 } // Out of stock trigger
    ],
    specifications: [
      { label: 'Composición Exterior', value: '100% Lana Merino Australiana extrafina' },
      { label: 'Forro Interior', value: '100% Satén de Cupro transpirable y antiestático' },
      { label: 'Cierre', value: 'Botones frontales de doble abotonadura en cuerno sostenible' },
      { label: 'Bolsillos', value: '2 bolsillos laterales con solapa y 1 bolsillo interior de ojal' },
      { label: 'Cuidados', value: 'Lavado en seco profesional exclusivamente. No usar blanqueador. Planchar a baja temperatura con paño protector.' },
      { label: 'Origen de Fabricación', value: 'Taller Sartorial AURA, Florencia, Italia' }
    ],
    faqs: [
      {
        q: '¿Cómo elijo mi talla exacta si estoy entre dos medidas?',
        a: 'Este abrigo presenta un corte estructurado clásico "Regular-Tailored". Si planeas llevar suéteres gruesos de lana debajo, te recomendamos elegir una talla superior.'
      },
      {
        q: '¿Cuál es el tiempo de entrega y la política de cambios?',
        a: 'Envíos estándar de 48-72h y express en 24h. Dispones de 30 días para cambios de talla o devoluciones totalmente gratuitas.'
      },
      {
        q: '¿Es apto para temperaturas bajo cero?',
        a: 'Sí, la densidad de 520 g/m² de la lana merino proporciona un excelente aislamiento térmico hasta -5°C manteniendo un peso ligero.'
      }
    ]
  },
  {
    id: 'prod-002',
    sku: 'AUR-DR-2026-02',
    slug: 'vestido-midi-seda-plisado',
    name: 'Vestido Midi Plisado en Seda Natural',
    subtitle: 'Silueta fluida con escote drapeado y cintura ceñida con cinturón al tono',
    category: 'vestidos',
    price: 135.00,
    originalPrice: 160.00,
    rating: 4.8,
    reviewCount: 29,
    badge: 'Nuevo',
    badgeType: 'new',
    isNew: true,
    description: 'Elegancia en movimiento. Confeccionado en seda morera con acabado satinado mate y plisado permanente realizado al vapor. Ideal para galas, eventos o noches sofisticadas.',
    materials: ['Seda Morera 100%', 'Crepé de Seda'],
    selectedMaterial: 'Seda Morera 100%',
    colors: [
      {
        id: 'champagne',
        name: 'Champagne Satin',
        hex: '#F7E7CE',
        images: [
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop'
        ]
      },
      {
        id: 'emerald',
        name: 'Esmeralda Nocturno',
        hex: '#0D5C43',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop'
        ]
      }
    ],
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 5 },
      { size: 'M', stock: 3 },
      { size: 'L', stock: 0 }
    ],
    specifications: [
      { label: 'Composición', value: '100% Seda Natural Morera Grado 6A' },
      { label: 'Largo', value: 'Midi (120 cm desde el hombro)' },
      { label: 'Cuidados', value: 'Lavar a mano en agua fría con detergente para sedas o limpieza en seco.' }
    ],
    faqs: [
      { q: '¿El vestido incluye cinturón?', a: 'Sí, incluye cinturón de la misma tela con hebilla forrada en seda.' }
    ]
  },
  {
    id: 'prod-003',
    sku: 'AUR-SH-2026-03',
    slug: 'camisa-lino-organico-oversize',
    name: 'Camisa Oversize en Lino Orgánico Francés',
    subtitle: 'Textura rústica refinada con cuello cubano y botones de nácar',
    category: 'camisas',
    price: 79.00,
    originalPrice: 95.00,
    rating: 4.7,
    reviewCount: 36,
    badge: 'Popular',
    badgeType: 'sale',
    isNew: false,
    description: 'La frescura del lino de Normandía en un corte contemporáneo holgado. Pre-lavada para asegurar máxima suavidad desde el primer uso sin encogimiento posterior.',
    materials: ['Lino Orgánico 100%', 'Lino-Algodón Pima'],
    selectedMaterial: 'Lino Orgánico 100%',
    colors: [
      {
        id: 'ivory',
        name: 'Marfil Natural',
        hex: '#FFFFF0',
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop'
        ]
      },
      {
        id: 'sky',
        name: 'Celeste Riviera',
        hex: '#A0C4E2',
        images: [
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop'
        ]
      }
    ],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 4 }
    ],
    specifications: [
      { label: 'Composición', value: '100% Lino Orgánico Certificado GOTS' },
      { label: 'Gramaje', value: '160 g/m² (Tejido transpirable de verano)' }
    ],
    faqs: [
      { q: '¿Se arruga fácilmente?', a: 'El lino noble adquiere una caída y arruga natural distintiva. Recomendamos vaporizar suavemente.' }
    ]
  },
  {
    id: 'prod-004',
    sku: 'AUR-TR-2026-04',
    slug: 'pantalon-palazzo-pinzas-tencel',
    name: 'Pantalón Palazzo con Pinzas en Tencel™',
    subtitle: 'Tiro alto con caída fluida y tejido ecológico ultra suave',
    category: 'pantalones',
    price: 98.00,
    originalPrice: 120.00,
    rating: 4.9,
    reviewCount: 18,
    badge: 'Eco-Choice',
    badgeType: 'new',
    isNew: true,
    description: 'Confeccionado en fibras de Tencel™ Lyocell obtenidas de bosques sostenibles. Su caída pesada pero fresca estiliza la silueta con pinzas frontales y bolsillos franceses.',
    materials: ['Tencel™ Lyocell 100%'],
    selectedMaterial: 'Tencel™ Lyocell 100%',
    colors: [
      {
        id: 'terracotta',
        name: 'Terracota Cálida',
        hex: '#C86D51',
        images: [
          'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop'
        ]
      },
      {
        id: 'navy',
        name: 'Azul Marino',
        hex: '#1B263B',
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop'
        ]
      }
    ],
    sizes: [
      { size: 'XS', stock: 1 }, // Low stock
      { size: 'S', stock: 4 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 2 }
    ],
    specifications: [
      { label: 'Composición', value: '100% Tencel™ Lyocell Lenzing' },
      { label: 'Corte', value: 'Palazzo Pierna Ancha - Tiro Alto' }
    ],
    faqs: [
      { q: '¿Tiene elástico en la cintura?', a: 'Presenta pretina fija sartorial con presillas para cinturón y cierre invisible lateral.' }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Todo el Catálogo' },
  { id: 'abrigos', name: 'Abrigos & Blazers' },
  { id: 'vestidos', name: 'Vestidos & Monos' },
  { id: 'camisas', name: 'Camisas & Tops' },
  { id: 'pantalones', name: 'Pantalones & Faldas' }
];

export const SIZE_CHART = {
  women: [
    { size: 'XS', chest: '80 - 84 cm', waist: '60 - 64 cm', hip: '86 - 90 cm', eu: '34' },
    { size: 'S',  chest: '85 - 89 cm', waist: '65 - 69 cm', hip: '91 - 95 cm', eu: '36' },
    { size: 'M',  chest: '90 - 94 cm', waist: '70 - 74 cm', hip: '96 - 100 cm', eu: '38-40' },
    { size: 'L',  chest: '95 - 100 cm', waist: '75 - 80 cm', hip: '101 - 106 cm', eu: '42' },
    { size: 'XL', chest: '101 - 106 cm', waist: '81 - 86 cm', hip: '107 - 112 cm', eu: '44' }
  ]
};
