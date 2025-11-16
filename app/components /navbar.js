"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catDropdown, setCatDropdown] = useState(false);
  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name,slug")
          .order("name");
        if (!error && data) setCategories(data);
      } catch {}
    }
    fetchCategories();
  }, []);

  // Count total quantity of all items in cart
  const readCartCount = () => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return 0;
      return parsed.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    setCartCount(readCartCount());
    
    const onStorage = (e) => {
      if (e.key === "cart" || e.key === null) {
        setCartCount(readCartCount());
      }
    };
    
    const onCustomEvent = () => {
      setCartCount(readCartCount());
    };
    
    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCustomEvent);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCustomEvent);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
        style={{ height: 80 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Godric
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Categories Dropdown */}
              <div className="relative group">
                <button
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                  onMouseEnter={() => setCatDropdown(true)}
                  onMouseLeave={() => setCatDropdown(false)}
                  onClick={() => setCatDropdown((v) => !v)}
                  type="button"
                >
                  Categories
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {catDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseEnter={() => setCatDropdown(true)}
                    onMouseLeave={() => setCatDropdown(false)}
                  >
                    {categories.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">No categories</div>
                    )}
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setCatDropdown(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={onSubmit}
              className="hidden lg:flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-full px-5 py-2.5 w-96 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-medium hover:shadow-lg transition-all hover:scale-105"
              >
                Search
              </button>
            </form>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative group flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-5 right-1 text-xl font-extrabold text-red-700 bg-transparent px-1 animate-bounce z-50 select-none pointer-events-none" style={{textShadow: '0 2px 8px #fff, 0 0 2px #fff, 0 0 8px #fff'}}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger for mobile */}
            <button
              className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-all"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col gap-2 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Godric
                </span>
              </Link>
              {/* Categories Dropdown */}
              <div className="mb-2">
                <div className="font-medium text-gray-700 mb-1">Categories</div>
                <div className="flex flex-col gap-1">
                  {categories.length === 0 && (
                    <div className="px-2 py-1 text-gray-400">No categories</div>
                  )}
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/about" className="py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link href="/blog" className="py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <form onSubmit={(e) => { onSubmit(e); setMobileMenuOpen(false); }} className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-full px-4 py-2 mt-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:shadow-lg transition-all hover:scale-105"
                >
                  Search
                </button>
              </form>
              <Link href="/cart" className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full mt-4" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* Add padding to main content so navbar doesn't overlap */}
      <style jsx global>{`
        body { padding-top: 80px; }
        @media (max-width: 1023px) { body { padding-top: 80px; } }
      `}</style>
    </>
  );
}