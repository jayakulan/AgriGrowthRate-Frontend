'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Star,
  MapPin,
  Leaf,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582515073490-39981397c445?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=200&h=200&fit=crop',
  ];

  const relatedProducts = [
    { id: 1, name: 'Ruby Radish Bunch', price: '$4.50', image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=400&fit=crop' },
    { id: 2, name: 'Heritage Tomato Mix', price: '$8.20', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop' },
    { id: 3, name: 'Lacinato Dinosaur Kale', price: '$3.95', image: 'https://images.unsplash.com/photo-1524584282361-b541bb924e2c?w=400&h=400&fit=crop' },
    { id: 4, name: 'Organic Purple Kohlrabi', price: '$5.50', image: 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="p-8 max-w-[1200px] mx-auto font-sans">
      
      {/* ── Breadcrumbs ────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8">
        <Link href="/dashboard/consumer/browse-products" className="hover:text-gray-900 transition-colors">
          Browse Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="hover:text-gray-900 transition-colors cursor-pointer">Organic Vegetables</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900">Heirloom Heritage Carrots</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* ── Left Column: Images ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-[#f4f5f0] rounded-2xl overflow-hidden border border-[#e4e6df] shadow-sm">
            <img 
              src={images[activeImage]} 
              alt="Heirloom Heritage Carrots main" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-[#1e4d1e] shadow-md' : 'border-[#e4e6df] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right Column: Details Card ───────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#e4e6df] rounded-3xl p-8 shadow-sm">
            
            <div className="flex items-start justify-between mb-4">
              <span className="bg-[#c6efc6] text-[#1e4d1e] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                In Season
              </span>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <h1 className="text-4xl font-extrabold text-[#1e4d1e] leading-tight mb-3">
              Heirloom Heritage Carrots
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current opacity-50" />
              </div>
              <span className="text-xs font-bold text-gray-500">
                4.8 • 124 reviews
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">$12.50</span>
                <span className="text-sm font-bold text-gray-500">/ bunch</span>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-1">(approx. 500g)</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f4f5f0] rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-900 mb-0.5">Origin</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Emerald Valley Sustainable Farm,<br />Oregon
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#e2fbe9] rounded-xl flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-900 mb-0.5">Farming Method</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Regenerative Organic, No Synthetic Pesticides
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-gray-600 leading-relaxed mb-8">
              Taste the rainbow with our hand-picked heritage carrots. These aren't your typical grocery store varieties; they offer a complex profile ranging from earthy sweetness to subtle spicy undertones. Perfect for raw salads or slow-roasting to caramelize their natural sugars.
            </p>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-xs font-extrabold text-gray-900">Quantity</span>
              <div className="flex items-center bg-[#f4f5f0] border border-[#e4e6df] rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#e4e6df] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-10 flex items-center justify-center text-sm font-bold text-gray-900 bg-white border-x border-[#e4e6df]">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#e4e6df] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-[#f4f5f0] border-2 border-[#e4e6df] hover:border-gray-400 hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-6 py-4 rounded-xl text-sm font-bold transition-colors shadow-sm">
                Buy Now
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-[#e2fbe9] border border-[#c6efc6] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#d4f8de] transition-colors group">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=80&h=80&fit=crop" 
                alt="Seller" 
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div>
                <p className="text-sm font-extrabold text-[#1e4d1e]">Emerald Valley Farms</p>
                <p className="text-[10px] font-bold text-[#1e4d1e]/70 uppercase tracking-widest mt-0.5">Verified Trusted Seller</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#1e4d1e] group-hover:translate-x-1 transition-transform">
              View Profile
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Related Products ───────────────────────────────── */}
      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#1e4d1e] mb-1">Related Premium Produce</h2>
            <p className="text-xs text-gray-500 font-medium">Recommended based on your current selection</p>
          </div>
          <Link href="/dashboard/consumer/browse-products" className="text-xs font-extrabold text-gray-900 hover:text-[#1e4d1e] transition-colors">
            Browse All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((prod) => (
            <div key={prod.id} className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative aspect-square">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex flex-col justify-between h-28">
                <h3 className="text-xs font-extrabold text-gray-900 leading-snug line-clamp-2">{prod.name}</h3>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-sm font-extrabold text-[#1e4d1e]">{prod.price}</span>
                  <button className="w-8 h-8 bg-[#e2fbe9] hover:bg-[#c6efc6] text-[#1e4d1e] rounded-lg flex items-center justify-center transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
