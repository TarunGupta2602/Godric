"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { label: "Unique Designs", value: "500+" },
    { label: "Happy Customers", value: "2K+" },
    { label: "Quality Partners", value: "15+" },
    { label: "Countries Served", value: "25+" }
  ];

  const values = [
    {
      icon: "✨",
      title: "Quality Craftsmanship",
      description: "Every piece is carefully crafted with premium materials and attention to detail that you can feel."
    },
    {
      icon: "🌍",
      title: "Sustainable Fashion",
      description: "We're committed to eco-friendly practices and ethical manufacturing to protect our planet."
    },
    {
      icon: "💎",
      title: "Unique Designs",
      description: "Stand out with our exclusive collections that blend contemporary style with timeless elegance."
    },
    {
      icon: "🚚",
      title: "Fast Shipping",
      description: "Get your fashion fix delivered quickly with our reliable and tracked shipping worldwide."
    }
  ];

  const collections = [
    {
      name: "Summer Vibes",
      description: "Breezy, comfortable pieces perfect for warm weather adventures",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
    },
    {
      name: "Urban Essentials",
      description: "Sleek streetwear that transitions from day to night effortlessly",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
    },
    {
      name: "Classic Elegance",
      description: "Timeless pieces that never go out of style",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "The Beginning",
      description: "Godric was born from a passion to create clothing that makes people feel confident and stylish. We launched with our first collection of essential pieces."
    },
    {
      year: "Today",
      title: "Growing Together",
      description: "We're building a community of fashion enthusiasts who value quality, sustainability, and unique style. Every day we're working to bring you amazing pieces."
    },
    {
      year: "Future",
      title: "Our Vision",
      description: "Expanding our collections, partnering with ethical manufacturers worldwide, and becoming your go-to destination for fashion that matters."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="text-purple-300 font-semibold tracking-wider uppercase text-sm">Welcome to Godric</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Fashion That Tells<br/>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Your Story</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              We're a new clothing brand dedicated to bringing you unique, high-quality fashion that makes you feel amazing. Every piece is designed with care, crafted with passion.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
                  alt="Godric Fashion Store"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-lg font-semibold">Where Style Meets Passion</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Our Story</span>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 mt-3">Building Something Beautiful</h2>
              <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
                <p>
                  Godric started in 2024 with a simple dream: to create clothing that's not just worn, 
                  but loved. We're not just another clothing brand – we're a team of passionate designers 
                  and fashion enthusiasts who believe everyone deserves to look and feel their best.
                </p>
                <p>
                  As a new brand, we're nimble, creative, and obsessed with quality. Every piece in our 
                  collection is carefully selected and designed to bring joy to your wardrobe. We work 
                  with ethical manufacturers who share our values of sustainability and fair practices.
                </p>
                <p>
                  We're just getting started, and we're excited to have you on this journey with us. 
                  Together, we're building a fashion community that values authenticity, quality, and style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">What We Stand For</span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 mt-3">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These principles guide every decision we make, from design to delivery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Explore Our Collections</span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 mt-3">Curated Just For You</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From casual everyday wear to statement pieces, discover styles that speak to you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <div 
                key={index} 
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-gray-200 mb-4">{collection.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold group-hover:gap-2 transition-all">
                    Explore Collection 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Our Journey</span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 mt-3">The Godric Story</h2>
          </div>
          
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Join the Godric Family</h2>
          <p className="text-2xl text-purple-100 mb-10 leading-relaxed">
            Be part of our story. Discover unique pieces that express your individuality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-white text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Shop Collection
            </Link>
            <Link 
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}