
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vanilla Bean Cake',
    price: 35.00,
    description: 'Our signature light and airy sponge cake layered with premium Madagascan vanilla beans and whipped cream.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6-aJ7YgzsGwYtu7sBsBBYcX2y5nX7u1OVMzuwCrjeO6S0FaMHKj7lNVlWhq09uBM3byJkCjRCH9mv-qai-fCQyQ_n1OrdEkRsIe09-a2bjeJ0ksT4zoEvJsf0HPYSD09XnjNbmLUkgFb4D5so7QgV4EW_10-fuaEvPrqoUfVFdIlN6IbPUy-49C9Y59vcdRsYubMdvd0dK8o7RgUDWq69MAsM-sfHgdWWO3XRoNvPQL0ZNu8dSUSLKRb-dBYxFvQG_GzQxutkeuDP',
    category: 'Cakes',
    status: 'In Stock',
    rating: 4.9,
    reviews: 120,
    sizes: [{ name: '6-inch', feeds: '4-6' }, { name: '8-inch', feeds: '8-10' }],
    variants: ['Classic', 'Extra Berries', 'Gluten-Free']
  },
  {
    id: '2',
    name: 'Strawberry Cream Cake',
    price: 35.00,
    description: 'Our signature light and airy sponge cake layered with fresh hand-picked organic strawberries and Madagascan vanilla whipped cream. A delicate treat for any celebration.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKpN8Foetw1IPipCLCI7HONtx-_kYHKlr-6TPpPErTMXkRV5_xy9IMUwn25Guje33EZ3zTCZG75_VAw43-9im4EI_n0b4KXUmdZoZc_jn4XKCe-B8jCXiceuONecxV0mjsnUfr3rnlHLc54QsqmiKWJ9bIFoB4fWL4lYfT4ieVzvksKOEhNCSLb4tcBSdl7zOEibfB2YmxYqjnC64lAxEfNQNE3Ol5J4rlaDKzETphl6E6eTBGYL9Qyen4ezVBoieQ5Mf-2DZC0QBT',
    category: 'Cakes',
    status: 'In Stock',
    rating: 4.9,
    reviews: 120,
    sizes: [{ name: '6-inch', feeds: '4-6' }, { name: '8-inch', feeds: '8-10' }],
    variants: ['Classic', 'Extra Berries', 'Gluten-Free']
  },
  {
    id: '3',
    name: 'Triple Fudge Cake',
    price: 42.00,
    description: 'A chocolate lover\'s dream. Rich cocoa sponge with layers of dark chocolate ganache and fudge frosting.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnZb6vIgsRhIKd6ucfPBtCqitcHLy-tSCV1HvrZFwG0dWtuniSot4Rv0QKikTQ62DpJU-aasXuXG-yz9TurnH7TtqkGvtdmx2ACNyHPdY1GyxcGFy1ovuIaCxR1-IBS6mYV8AijnXbe92-tbNz9lCcDTJCXAb796EHkmWy9AMfBWpZwK3AK2CB5bKpHEm8RBHgcDx5sMI6RPzXLHHK-LQi9Pu4GivslHtErCzgsnn0UN6IUn1junf41637JTqWRL4Pcx1mYdXOJS51',
    category: 'Cakes',
    status: 'Pre-order',
    rating: 4.8,
    reviews: 85
  },
  {
    id: '4',
    name: 'Artisan Sourdough',
    price: 8.50,
    description: 'Naturally leavened with our 50-year-old starter. Crispy crust with a soft, airy interior.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKRUwk8kZZT-51kOFOyQx3xi3saz6K_Vgq6O3RysQJac2ZkWpT5npmDx6PYUhSmtdUhl1y2iaVYRtG8QgACKq6Oo3IqbV3dGVOgMGcx2CTwPewOXhHjWGAyAO9h1PPMtTG07ecvYa4c2v4HgX5rzX00P0IyZ0SqfWzqHrHB9mDpS2z9ZRaWMZmA-ABcgT-WXGTSvBvIqUiSc_H3FM_yDk3xP9IK61y18JdEnxRXNNF4bdWVF-RMZCVWKrBnujKb5sEz_wE7AuVHPZb',
    category: 'Bread',
    status: 'In Stock',
    rating: 5.0,
    reviews: 210
  },
  {
    id: '5',
    name: 'Sourdough Loaf',
    price: 8.00,
    description: 'Fresh daily baked sourdough bread loaf on a wooden board.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5qrC9-J_S8ARg7F6O56abYorPVoG3q28CCjFZW2YyZdlq93geGWvJLH_7j3wsRrrGwLL6noazWQAx7eryKGf7-rQ_kUiL-bvwqXY2VHuY_wN3mistnDhLbvL3L8ZcT_j6yebGXBdLj-DmmwVZXGpxeGXd6gNsrPoT1biQhOe5BywOIDZWFg8VhBKNVW-tSX5Ob_s0TvjeIkIp62Oays6NZIUFZOolbtmp0b77I4_lL_CBoxG0nH2o5oDqzZPbNntC6EB0jqCCoE5C',
    category: 'Bread',
    status: 'In Stock',
    rating: 4.9,
    reviews: 140
  },
  {
    id: '6',
    name: 'Chocolate Chip Cookies',
    price: 6.00,
    description: 'Gooey, large chocolate chip cookies stacked up. Sold as a pair.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrZaDL3-NaVsfNTy22LzeTlkt6JMBuvykOwsqMslFxYZ0otwFyXbXqTYUB-Xz3P24bj8c2QnMX1m2Yde0UdfwsTJB7jH1ffrvnDodsJ_LH2hZ3NRyFilK4jIhOoqc8Ubs8KNqXx_HE6GpulShYa2IzXeaanZ-Q1mzmEKNZTJOwLKGImXc999QkBDLip166Me5bNDIDElVKjLoi60aP1hY_Hrhj_5d5huBUUII1w6kPEdXqqMbnx_oUKncs2DP4YK9aUMGZOhcNDFol',
    category: 'Cookies',
    status: 'In Stock',
    rating: 4.7,
    reviews: 320
  }
];

export const CATEGORIES = ['Cakes', 'Cookies', 'Bread', 'Pastries'];

// The store's WhatsApp contact number (updated to +60124994717)
export const WHATSAPP_NUMBER = '60124994717';
