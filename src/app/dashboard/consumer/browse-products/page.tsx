'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { productService } from '@/services/productService';

const categories = [
  { name: 'All Products', icon: Grid3X3, key: 'all' },
  { name: 'Vegetables', icon: Carrot, key: 'vegetables' },
  { name: 'Grains', icon: Wheat, key: 'grains' },
  { name: 'Fruits', icon: Apple, key: 'fruits' },
  { name: 'Dairy', icon: Sprout, key: 'dairy' }, // Changed Organic Seeds to Dairy or keep similar to db categories
  { name: 'Herbs', icon: Sprout, key: 'herbs' },
];

export default function BrowseProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState('Latest Arrivals');
  const limit = 12;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: String(currentPage),
          limit: String(limit),
        };
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        const res = await productService.getAll(params);
        if (res && res.success) {
          let loadedProducts = res.data || [];
          
          // Sort products frontend-side to respect sorting filter
          if (sortBy === 'Price: Low to High') {
            loadedProducts = [...loadedProducts].sort((a: any, b: any) => a.price - b.price);
          } else if (sortBy === 'Price: High to Low') {
            loadedProducts = [...loadedProducts].sort((a: any, b: any) => b.price - a.price);
          } else if (sortBy === 'Top Rated') {
            loadedProducts = [...loadedProducts].sort((a: any, b: any) => b.rating - a.rating);
          }

          setProducts(loadedProducts);
          setTotalProducts(res.total || loadedProducts.length);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeCategory, currentPage, sortBy]);

  const totalPages = Math.ceil(totalProducts / limit) || 1;

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
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#e4e6df] rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#1e4d1e] cursor-pointer"
          >
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
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setCurrentPage(1);
              }}
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

      {/* ── Products Grid ─────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#e4e6df] rounded-2xl">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {products.map((product) => {
            const productImg = product.images && product.images[0] 
              ? (product.images[0].startsWith('http') || product.images[0].startsWith('data:') ? product.images[0] : `http://localhost:5001${product.images[0]}`) 
              : 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop';
            
            return (
              <div
                key={product._id}
                className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img
                    src={productImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Rating badge */}
                  <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 px-2 py-1 rounded-md shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {product.rating || 0}
                  </span>
                  {/* Organic badge */}
                  {product.isOrganic && (
                    <span className="absolute top-3 right-3 bg-[#1e4d1e] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Organic
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-[#1e4d1e] tracking-wider uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-[15px] font-extrabold text-gray-900 mt-1 leading-snug line-clamp-1">{product.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-1">/ {product.unit || 'kg'}</span>
                    </div>
                    <Link
                      href={`/dashboard/consumer/browse-products/${product._id}`}
                      className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="w-9 h-9 rounded-lg border border-[#e4e6df] flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-[#1e4d1e] text-white'
                    : 'border border-[#e4e6df] text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="w-9 h-9 rounded-lg border border-[#e4e6df] flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

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

