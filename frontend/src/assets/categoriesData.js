export const CATEGORIES_DATA = [
  {
    id: 1,
    name: 'Pharmacy & Health',
    slug: 'pharmacy-health',
    description: 'Prescription medicines, pain relief, vitamins, and first aid supplies.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    itemCount: '24+ products'
  },
  {
    id: 2,
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    description: 'Fresh milk, artisanal cheeses, organic eggs, and yogurts.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    itemCount: '35+ products'
  },
  {
    id: 3,
    name: 'Groceries & Grains',
    slug: 'groceries-grains',
    description: 'Daily staples, basmati rice, lentils, flours, and pure cooking oils.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    itemCount: '60+ products'
  },
  {
    id: 4,
    name: 'Beverages & Drinks',
    slug: 'beverages-drinks',
    description: 'Fresh juices, sparkling water, whole bean coffees, and teas.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    itemCount: '42+ products'
  },
  {
    id: 5,
    name: 'Personal Care & Hygiene',
    slug: 'personal-care',
    description: 'Soaps, haircare, antibacterial washes, and daily essentials.',
    image: 'https://images.unsplash.com/photo-1608248597359-5633b497a7a2?w=600&auto=format&fit=crop&q=80',
    itemCount: '28+ products'
  },
  {
    id: 6,
    name: 'Snacks & Bakery',
    slug: 'snacks-bakery',
    description: 'Fresh artisan bread, cookies, crackers, and single-origin dark chocolate.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    itemCount: '30+ products'
  },
  {
    id: 7,
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    description: 'Crisp organic produce, seasonal fruits, and fresh herbs.',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    itemCount: '45+ products'
  },
  {
    id: 8,
    name: 'Household Essentials',
    slug: 'household-essentials',
    description: 'Surface cleaners, eco detergents, and kitchen utility supplies.',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    itemCount: '20+ products'
  }
];

export function getCategoryImage(categoryName) {
  if (!categoryName) return CATEGORIES_DATA[0].image;
  const match = CATEGORIES_DATA.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  return match ? match.image : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80';
}
