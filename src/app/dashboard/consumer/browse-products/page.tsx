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
  MapPin,
} from 'lucide-react';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';

const categories = [
  { name: 'All Products', icon: Grid3X3, key: 'all' },
  { name: 'Vegetables', icon: Carrot, key: 'vegetables' },
  { name: 'Grains', icon: Wheat, key: 'grains' },
  { name: 'Fruits', icon: Apple, key: 'fruits' },
];

export default function BrowseProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState('Latest Arrivals');
  const limit = 12;
  // Removed fetchPendingOrders to display all products
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

      {/* ── Header & Filters ──────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        {/* Category Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive
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

        {/* Sort */}
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

          </select>
        </div>
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
                className="bg-white border border-[#e4e6df] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden shrink-0 p-3 pb-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={productImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-bold text-[#0f172a] leading-snug line-clamp-1">{product.name}</h3>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[14px] font-bold text-[#0f172a]">Rs {product.price.toFixed(2)}</span>
                      <span className="text-[12px] font-bold text-[#0f172a]">/{product.unit || 'kg'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available Stock</span>
                      <span className="font-black text-[#1e4d1e] text-[20px] leading-none">{product.stock} <span className="text-[13px] font-bold">{product.unit || 'kg'}</span></span>
                    </div>
                  </div>

                  <p className="text-[12px] text-gray-600 mb-4 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1e4d1e] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{product.farmer?.address || product.location || 'Address not available'}</span>
                  </p>

                  <Link
                    href={`/dashboard/consumer/browse-products/${product._id}`}
                    className="mt-auto w-full bg-[#17451e] hover:bg-[#113316] text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy
                  </Link>
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
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === page
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

