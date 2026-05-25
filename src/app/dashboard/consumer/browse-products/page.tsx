'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Grid3X3,
  Carrot,
  Wheat,
  Apple,
  Sprout,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';

const categories = [
  { name: 'All Products', icon: Grid3X3, active: true },
  { name: 'Vegetables', icon: Carrot, active: false },
  { name: 'Grains', icon: Wheat, active: false },
  { name: 'Fruits', icon: Apple, active: false },
  { name: 'Organic Seeds', icon: Sprout, active: false },
];

const products = [
  {
    id: 1,
    name: 'Organic Russet Potatoes',
    category: 'VEGETABLES',
    desc: 'Directly harvested from the valley, known for the...',
    price: '$1.45',
    unit: '/ kg',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber2a3?w=400&h=300&fit=crop',
    badge: null,
  },
  {
    id: 2,
    name: 'Golden Hard Wheat',
    category: 'GRAINS',
    desc: 'High-protein grain perfect for artisanal...',
    price: '$3.20',
    unit: '/ kg',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    badge: null,
  },
  {
    id: 3,
    name: 'Premium Gala Apples',
    category: 'FRUITS',
    desc: 'Crisp, sweet, and locally grown. Perfect for retail...',
    price: '$2.10',
    unit: '/ kg',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    badge: 'Top Seller',
  },
  {
    id: 4,
    name: 'Black Heirloom Carrots',
    category: 'VEGETABLES',
    desc: 'Rich in antioxidants with an earthy, sweet flavor...',
    price: '$4.50',
    unit: '/ kg',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    badge: null,
  },
  {
    id: 5,
    name: 'Vine-Ripened Tomatoes',
    category: 'VEGETABLES',
    desc: 'Greenhouse grown for maximum flavor and...',
    price: '$2.85',
    unit: '/ kg',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop',
    badge: null,
  },
  {
    id: 6,
    name: 'Long-Grain Basmati Rice',
    category: 'GRAINS',
    desc: 'Aromatic rice with extra-long grains. Aged for 12...',
    price: '$5.50',
    unit: '/ kg',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    badge: null,
  },
  {
    id: 7,
    name: 'Sweet Golden Pineapples',
    category: 'FRUITS',
    desc: 'Sustainably sourced from tropical farms,...',
    price: '$3.75',
    unit: '/ unit',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
    badge: null,
  },
  {
    id: 8,
    name: 'Farm-Fresh Broccoli',
    category: 'VEGETABLES',
    desc: 'Crisp, densely packed florets. Cold-chain...',
    price: '$2.50',
    unit: '/ unit',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
    badge: null,
  },
];

export default function BrowseProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [currentPage] = useState(1);

  return (
    <div className="p-8 max-w-[1200px]">

      {/* ── Page Header ───────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Browse Products</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-lg leading-relaxed">
            Sourced directly from verified sustainable farms. Explore our seasonal selection of organic produce and high-yield grains.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-gray-500">Sort:</span>
          <select className="border border-[#e4e6df] rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#1e4d1e] cursor-pointer">
            <option>Latest Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── Category Filter Bar ───────────────────────── */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#1e4d1e] text-white shadow-sm'
                  : 'bg-white border border-[#e4e6df] text-gray-600 hover:border-[#1e4d1e] hover:text-[#1e4d1e]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ── Products Grid (4 columns, 2 rows) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Rating badge */}
              <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 px-2 py-1 rounded-md shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {product.rating}
              </span>
              {/* Special badge */}
              {product.badge && (
                <span className="absolute top-3 right-3 bg-[#1e4d1e] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-4">
              <span className="text-[9px] font-extrabold text-[#1e4d1e] tracking-wider uppercase">
                {product.category}
              </span>
              <h3 className="text-[15px] font-extrabold text-gray-900 mt-1 leading-snug">{product.name}</h3>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{product.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-lg font-extrabold text-gray-900">{product.price}</span>
                  <span className="text-xs text-gray-400 ml-1">{product.unit}</span>
                </div>
                <Link
                  href={`/dashboard/consumer/browse-products/${product.id}`}
                  className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button className="w-9 h-9 rounded-lg border border-[#e4e6df] flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
              currentPage === page
                ? 'bg-[#1e4d1e] text-white'
                : 'border border-[#e4e6df] text-gray-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <span className="text-gray-400 text-sm px-1">…</span>
        <button className="w-9 h-9 rounded-lg border border-[#e4e6df] text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
          12
        </button>
        <button className="w-9 h-9 rounded-lg border border-[#e4e6df] flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Floating Cart FAB ─────────────────────────── */}
      <Link
        href="/dashboard/consumer/orders"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50"
      >
        <ShoppingCart className="w-6 h-6" />
      </Link>
    </div>
  );
}
