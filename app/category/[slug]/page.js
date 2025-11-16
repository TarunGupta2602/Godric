// app/category/[slug]/page.js
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

export const dynamicParams = true;
export const revalidate = 60;

async function getCategoryData(slug) {
  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!category) {
    return { category: null, products: [] };
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  return { category, products };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const { category, products } = await getCategoryData(slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">?</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find what you're looking for.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {category.name}
          </h1>
          <p className="text-xl opacity-95">
            Discover our {products.length} handpicked {category.name.toLowerCase()} essentials
          </p>
          <Link
            href="/"
            className="inline-flex items-center mt-8 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition"
          >
            ← All Categories
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-3xl text-gray-400">📦</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Products Yet</h2>
              <p className="text-gray-600 mb-8">Be the first to shop this category!</p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
              >
                Add Products (Admin)
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button (Stub for pagination) */}
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition">
                  Load More
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// Product Card Component (Reusable)
function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-500 text-lg font-medium">No Image</span>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🔥 Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock} left
          </span>
        </div>
        {product.sizes?.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">Sizes: {product.sizes.join(', ')}</p>
        )}
      </div>
    </Link>
  );
}