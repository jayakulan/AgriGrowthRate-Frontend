'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Leaf, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  location?: string;
  isOrganic?: boolean;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const imageUrl = product.images?.[0] || `https://source.unsplash.com/400x300/?${encodeURIComponent(product.category)},farm`;

  return (
    <Link href={`/marketplace/${product._id}`} className="block group">
      <div className="glass-card overflow-hidden hover:border-green-700/40 hover:shadow-lg hover:shadow-green-900/20 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-[#0d1a0d]">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=300&fit=crop';
            }}
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isOrganic && (
              <span className="flex items-center gap-1 text-xs bg-green-900/80 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                <Leaf className="w-3 h-3" /> Organic
              </span>
            )}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs bg-orange-900/80 text-orange-400 border border-orange-700/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-xs bg-red-900/80 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Out of Stock
              </span>
            )}
          </div>
          <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-base leading-tight mb-1 group-hover:text-green-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>

          {/* Meta */}
          <div className="flex items-center justify-between mb-3">
            {product.rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-400">{product.rating.toFixed(1)}</span>
                {product.reviews && (
                  <span className="text-xs text-gray-600">({product.reviews})</span>
                )}
              </div>
            )}
            {product.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" /> {product.location}
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-green-400">₹{product.price}</span>
              <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 btn-primary text-xs py-2 px-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              id={`add-to-cart-${product._id}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
