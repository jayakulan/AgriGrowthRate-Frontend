'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  Loader2,
  Phone,
  User,
  BadgeCheck,
  CheckCircle,
} from 'lucide-react';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams() as { id: string };
  const [quantity, setQuantity] = useState(10);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = async () => {
    if (!product?.farmer?._id) return;
    try {
      const res = await api.post(`/auth/favorite-farmer/${product.farmer._id}`);
      if (res.data.success) {
        setIsFavorite(!isFavorite);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update favorite status');
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await productService.getById(id);
        if (res && res.success) {
          setProduct(res.data);
          
          // Fetch some related products of the same category
          if (res.data.category) {
            const relRes = await productService.getAll({ category: res.data.category, limit: '4' });
            if (relRes && relRes.success) {
              // Exclude current product
              const filtered = (relRes.data || []).filter((p: any) => p._id !== id);
              setRelatedProducts(filtered.slice(0, 4));
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load product details:', err);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
        <p className="text-sm text-gray-500 mt-2">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white border border-[#e4e6df] rounded-2xl m-8">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/dashboard/consumer/browse-products" className="text-sm font-bold text-[#1e4d1e] underline mt-4 inline-block">
          Back to Browse Products
        </Link>
      </div>
    );
  }

  // Get image URLs, with fallbacks
  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img: string) => img.startsWith('http') || img.startsWith('data:') ? img : `http://localhost:5001${img}`)
    : ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop'];

  return (
    <div className="p-8 max-w-[1200px] mx-auto font-sans">
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* ── Left Column: Images ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-[#f4f5f0] rounded-2xl overflow-hidden border border-[#e4e6df] shadow-sm">
            <img 
              src={productImages[activeImage] || productImages[0]} 
              alt={`${product.name} main`} 
              className="w-full h-full object-cover"
            />
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img: string, idx: number) => (
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
          )}
        </div>

        {/* ── Right Column: Details Card ───────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#e4e6df] rounded-3xl p-8 shadow-sm">
            
            <h1 className="text-4xl font-extrabold text-[#1e4d1e] leading-tight mb-3 mt-4">
              {product.name}
            </h1>
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="text-sm font-bold text-gray-500">/ {product.unit || 'kg'}</span>
              </div>
              {product.stock > 0 && (
                <div className="mt-4 inline-flex items-center gap-3">
                  <span className="text-[12px] font-bold text-gray-800 uppercase tracking-wider">Stock Available:</span>
                  <span className="font-black text-[#1e4d1e] text-[22px] leading-none">{product.stock} {product.unit || 'Kg'}</span>
                </div>
              )}
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f4f5f0] rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-900 mb-0.5">Farmer Address</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {product.farmer?.address || product.location || 'Address not available'}
                  </p>
                </div>
              </div>
              
              {product.isOrganic && (
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
              )}
            </div>


            <div className="flex items-center gap-6 mb-8">
              <span className="text-xs font-extrabold text-gray-900">Quantity</span>
              <div className="flex items-center bg-[#f4f5f0] border border-[#e4e6df] rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(10, quantity - 1))}
                  disabled={quantity <= 10}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#e4e6df] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setQuantity(val);
                    }
                  }}
                  onBlur={() => {
                    if (quantity < 10) setQuantity(10);
                    if (product.stock && quantity > product.stock) setQuantity(product.stock);
                  }}
                  className="w-16 h-10 text-center text-sm font-bold text-gray-900 bg-white border-x border-[#e4e6df] focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(prev => (product.stock ? Math.min(product.stock, prev + 1) : prev + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#e4e6df] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">

              <button 
                onClick={() => {
                  if (quantity < 10) {
                    toast.error('Minimum purchase quantity is 10');
                    setQuantity(10);
                    return;
                  }
                  setShowConfirmModal(true);
                }}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
            </div>
          </div>

          {/* Farmer Details Card */}
          {product.farmer && (
            <div className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm">
              {/* Card header */}
              <div className="bg-[#1e4d1e] px-5 py-3 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[#a8e6a3]" />
                <span className="text-xs font-extrabold text-white uppercase tracking-widest">Verified Farmer</span>
              </div>

              {/* Card body */}
              <div className="p-5">
                {/* Avatar + Name row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={
                        product.farmer.avatar 
                          ? (product.farmer.avatar.startsWith('http') || product.farmer.avatar.startsWith('data:') 
                              ? product.farmer.avatar 
                              : `http://localhost:5001${product.farmer.avatar}`)
                          : 'https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=80&h=80&fit=crop'
                      } 
                      alt={product.farmer.name} 
                      className="w-14 h-14 rounded-full border-2 border-[#c6efc6] object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-base font-extrabold text-gray-900 leading-tight">{product.farmer.name}</p>
                      <span className="inline-block text-[10px] font-bold text-[#1e4d1e] bg-[#e2fbe9] px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider">Trusted Seller</span>
                    </div>
                  </div>
                  <button onClick={toggleFavorite} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-[#f4f5f0] mb-4" />

                {/* Contact details */}
                <div className="space-y-3">
                  {product.farmer.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#e2fbe9] rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-[#1e4d1e]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-semibold text-gray-800">{product.farmer.phone}</p>
                      </div>
                    </div>
                  )}

                  {(product.farmer.location || product.location) && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#e2fbe9] rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#1e4d1e]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                        <p className="text-sm font-semibold text-gray-800">{product.farmer.location || product.location}</p>
                      </div>
                    </div>
                  )}

                  {!product.farmer.phone && !(product.farmer.location || product.location) && (
                    <p className="text-xs text-gray-400 text-center py-2">No contact details available</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Confirmation Modal ───────────────────────────────── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-[#e4e6df]">
            
            {/* Modal Header */}
            <div className="bg-[#1e4d1e] p-6 text-white text-center">
              <h3 className="text-xl font-black mb-1">
                {orderResult ? '🎉 Order Confirmed!' : 'Confirm Your Order'}
              </h3>
              <p className="text-xs text-white/80">
                {orderResult ? 'Your transaction has been processed' : 'Double-check your order information before checkout'}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              
              {!orderResult ? (
                <>
                  {/* Product and Quantity Summary */}
                  <div className="bg-[#f4f5f0] p-4 rounded-2xl flex gap-3 border border-[#e4e6df]">
                    <img 
                      src={productImages[0]} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-[#e4e6df]"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Quantity: <span className="font-extrabold text-gray-900">{quantity}</span></p>
                      <p className="text-xs text-[#1e4d1e] font-extrabold mt-0.5">Price: ${product.price.toFixed(2)} / {product.unit || 'kg'}</p>
                    </div>
                  </div>

                  {/* Order total amount calculation */}
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-bold text-gray-500">Order Total</span>
                    <span className="text-2xl font-black text-[#1e4d1e]">${(product.price * quantity).toFixed(2)}</span>
                  </div>

                  <div className="border-t border-[#e4e6df] pt-4 text-center">
                    <p className="text-xs font-semibold text-gray-500">
                      The confirmation code will be sent to your registered phone number via SMS.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-[#e2fbe9] text-[#1e4d1e] rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Confirmation Number</p>
                    <p className="text-3xl font-black text-[#1e4d1e] bg-[#e2fbe9]/50 border border-[#c6efc6] rounded-2xl py-3 px-4 inline-block tracking-wider">
                      {orderResult.orderConfirmationNumber}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed max-w-xs mx-auto">
                    We've stored all order details in the Order database and dispatched your SMS receipt.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Action Buttons */}
            <div className="bg-[#f4f5f0] px-6 py-4 flex gap-3 border-t border-[#e4e6df]">
              {!orderResult ? (
                <>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isPlacingOrder}
                    className="flex-1 bg-white border border-[#e4e6df] text-gray-700 px-4 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        setIsPlacingOrder(true);
                        
                        const response = await orderService.create({
                          items: [{
                            product: product._id,
                            quantity: quantity
                          }],
                          paymentMethod: 'cash'
                        });

                        if (response && response.success) {
                          toast.success('Order placed successfully!');
                          setOrderResult(response.data);
                          
                          // Deduct local quantity/stock reflection
                          setProduct((prev: any) => ({
                            ...prev,
                            stock: Math.max(0, prev.stock - quantity)
                          }));
                        } else {
                          toast.error(response.message || 'Failed to place order.');
                        }
                      } catch (err: any) {
                        console.error('Checkout error:', err);
                        toast.error(err.response?.data?.message || 'Failed to place order.');
                      } finally {
                        setIsPlacingOrder(false);
                      }
                    }}
                    disabled={isPlacingOrder}
                    className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] disabled:bg-gray-400 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Confirm Order'
                    )}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setShowConfirmModal(false);
                    setOrderResult(null);
                  }}
                  className="w-full bg-[#1e4d1e] hover:bg-[#163d16] text-white py-3 rounded-xl text-xs font-bold transition-colors text-center"
                >
                  Continue Shopping
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Related Products ───────────────────────────────── */}
      {relatedProducts.length > 0 && (
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
            {relatedProducts.map((prod) => {
              const prodImg = prod.images && prod.images[0] 
                ? (prod.images[0].startsWith('http') || prod.images[0].startsWith('data:') ? prod.images[0] : `http://localhost:5001${prod.images[0]}`) 
                : 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop';

              return (
                <Link key={prod._id} href={`/dashboard/consumer/browse-products/${prod._id}`} className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm group block">
                  <div className="relative aspect-square">
                    <img src={prodImg} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col justify-between h-28">
                    <h3 className="text-xs font-extrabold text-gray-900 leading-snug line-clamp-2">{prod.name}</h3>
                    <div className="flex items-end justify-between mt-auto">
                      <span className="text-sm font-extrabold text-[#1e4d1e]">${prod.price.toFixed(2)}</span>
                      <button className="w-8 h-8 bg-[#e2fbe9] hover:bg-[#c6efc6] text-[#1e4d1e] rounded-lg flex items-center justify-center transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
