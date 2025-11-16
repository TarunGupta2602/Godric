'use client';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, ShoppingBag, Truck, Shield, RefreshCw, Star } from 'lucide-react';

export default function ProductPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const mainImageRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data: prod, error: prodError } = await supabase
          .from('products')
          .select('*, category:category_id(name, slug)')
          .eq('slug', slug)
          .single();

        if (prodError || !prod) {
          setError('Product not found');
          return;
        }

        setProduct(prod);

        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', prod.category_id)
          .neq('id', prod.id)
          .limit(4)
          .order('created_at', { ascending: false });

        setRelated(rel || []);
      } catch (err) {
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      slug: product.slug,
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
    };
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { cart = []; }
    // Find by id, size, color
    const existing = cart.find(item => 
      item.id === product.id && 
      item.size === selectedSize && 
      item.color === selectedColor
    );
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };

  const scrollToThumbnail = (index) => {
    if (thumbnailContainerRef.current) {
      const thumbnails = thumbnailContainerRef.current.children;
      if (thumbnails[index]) {
        thumbnails[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    scrollToThumbnail(index);
  };

  const nextImage = () => {
    if (product.images?.length > 0) {
      const newIndex = (currentImageIndex + 1) % product.images.length;
      handleImageChange(newIndex);
    }
  };

  const prevImage = () => {
    if (product.images?.length > 0) {
      const newIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
      handleImageChange(newIndex);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl text-red-500">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const hasMultipleImages = product.images?.length > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200 py-3 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition font-medium">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            href={`/category/${product.category?.slug}`} 
            className="text-gray-600 hover:text-blue-600 transition font-medium"
          >
            {product.category?.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Gallery Section */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="aspect-square relative">
                  <Image
                    ref={mainImageRef}
                    src={product.images?.[currentImageIndex] || '/placeholder.jpg'}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={true}
                  />
                  
                  {/* Featured Badge */}
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Star size={14} fill="white" />
                      Featured
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Only {product.stock} left
                    </div>
                  )}

                  {/* Navigation Arrows - Desktop */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition opacity-0 group-hover:opacity-100 text-gray-700 font-bold"
                        aria-label="Previous Image"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition opacity-0 group-hover:opacity-100 text-gray-700 font-bold"
                        aria-label="Next Image"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>

                {/* Action Icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
                    aria-label="Add to Wishlist"
                  >
                    <Heart 
                      size={20} 
                      className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                    />
                  </button>
                  <button
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
                    aria-label="Share Product"
                  >
                    <Share2 size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="relative">
                  <div 
                    ref={thumbnailContainerRef}
                    className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  >
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition snap-center ${
                          currentImageIndex === index 
                            ? 'border-blue-600 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-blue-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                      {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">
                    Select Size
                  </label>
                  {!selectedSize && (
                    <span className="text-xs text-red-500 font-medium">Required</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] px-4 py-2.5 rounded-lg border-2 font-semibold transition ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                          : 'border-gray-300 hover:border-blue-400 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">
                    Select Color
                    {selectedColor && (
                      <span className="ml-2 text-gray-600 font-normal">
                        ({selectedColor})
                      </span>
                    )}
                  </label>
                  {!selectedColor && (
                    <span className="text-xs text-red-500 font-medium">Required</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition flex items-center justify-center shadow-sm ${
                        selectedColor === color 
                          ? 'border-blue-600 ring-2 ring-blue-200 scale-110' 
                          : 'border-gray-300 hover:border-blue-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {color.toLowerCase() === 'white' && (
                        <div className="w-10 h-10 border border-gray-300 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 text-center font-semibold text-lg min-w-[60px] border-x-2 border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      ✓ {product.stock} in stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  )}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-4 px-6 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:shadow-none"
              >
                <ShoppingBag size={22} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                disabled={product.stock === 0}
                className="py-4 px-6 text-lg font-bold text-blue-600 bg-blue-50 border-2 border-blue-600 rounded-xl hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Free Delivery</p>
                  <p className="text-sm font-semibold text-gray-900">On orders above ₹499</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RefreshCw size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Easy Returns</p>
                  <p className="text-sm font-semibold text-gray-900">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Secure Payment</p>
                  <p className="text-sm font-semibold text-gray-900">100% Protected</p>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 py-4 px-6 font-semibold transition ${
                    activeTab === 'description'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-4 px-6 font-semibold transition ${
                    activeTab === 'details'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Details
                </button>
              </div>
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    {product.description ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No description available.</p>
                    )}
                  </div>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Category</span>
                      <span className="text-gray-900 font-semibold">{product.category?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Stock</span>
                      <span className="text-gray-900 font-semibold">{product.stock} units</span>
                    </div>
                    {product.sizes?.length > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Available Sizes</span>
                        <span className="text-gray-900 font-semibold">{product.sizes.join(', ')}</span>
                      </div>
                    )}
                    {product.colors?.length > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 font-medium">Available Colors</span>
                        <span className="text-gray-900 font-semibold">{product.colors.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Similar Products
              </h2>
              <Link
                href={`/category/${product.category?.slug}`}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm lg:text-base flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group"
                >
                  <div className="aspect-square relative bg-gray-100 overflow-hidden">
                    <Image
                      src={rel.images?.[0] || '/placeholder.jpg'}
                      alt={rel.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                      unoptimized={true}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                      {rel.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-lg">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}