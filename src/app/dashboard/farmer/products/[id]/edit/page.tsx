'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { productService } from '@/services/productService';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ProductForm {
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  isOrganic: boolean;
  isAvailable: boolean;
  description: string;
  images: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [form, setForm] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data once
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(id);
        setForm({
          name: res.data.name ?? '',
          category: res.data.category ?? '',
          price: res.data.price ?? 0,
          unit: res.data.unit ?? '',
          stock: res.data.stock ?? 0,
          isOrganic: res.data.isOrganic ?? false,
          isAvailable: res.data.isAvailable ?? false,
          description: res.data.description ?? '',
          images: res.data.images ?? [],
        });
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to load product');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) =>
      prev && {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      await productService.update(id, form as any);
      toast.success('Product updated successfully');
      router.push('/dashboard/farmer/products');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-[#1e4d1e]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans p-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/farmer/products" className="mr-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1e4d1e]">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl">
        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="border border-[#e4e6df] rounded-lg p-2"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border border-[#e4e6df] rounded-lg p-2"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border border-[#e4e6df] rounded-lg p-2"
            required
          />
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="Unit (e.g., kg)"
            className="border border-[#e4e6df] rounded-lg p-2"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock quantity"
            className="border border-[#e4e6df] rounded-lg p-2"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isOrganic"
              checked={form.isOrganic}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-600">Organic</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-600">Listed (Available)</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="border border-[#e4e6df] rounded-lg p-2 md:col-span-2"
          />
        </div>

        {/* Image URLs – comma‑separated for simplicity */}
        <div className="mt-4">
          <input
            name="images"
            value={form.images.join(', ')}
            onChange={(e) =>
              setForm((prev) =>
                prev && { ...prev, images: e.target.value.split(',').map((s) => s.trim()) }
              )
            }
            placeholder="Image URLs (comma separated)"
            className="border border-[#e4e6df] rounded-lg p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="mt-6 flex items-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-2.5 rounded-lg font-semibold"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </form>
    </div>
  );
}
