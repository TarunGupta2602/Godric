// app/page.js
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const { data: categories = [] } = await supabase
    .from('categories')
    .select('id, name, slug, images')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in">
            Welcome to <span className="text-yellow-400">Godric</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Discover the latest trends in fashion for Men, Women & Kids
          </p>
          <Link
            href="/#categories"
            className="inline-block px-10 py-4 bg-white text-indigo-900 font-semibold text-lg rounded-full hover:bg-yellow-400 transition transform hover:scale-105 shadow-2xl"
          >
            Shop Now
          </Link>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" className="w-full h-32 md:h-48">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section id="categories" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">Find your perfect style</p>
          </div>

          {categories.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No categories yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category) => {
                const imageUrl = category.images?.[0] || '/placeholder.jpg'; // fallback image

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide">
                        {category.name}
                      </h3>
                      <p className="text-sm uppercase tracking-wider opacity-90">
                        Explore Collection →
                      </p>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 border-4 border-transparent rounded-2xl group-hover:border-yellow-400 transition-all duration-500 pointer-events-none"></div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

     
    </div>
  );
}