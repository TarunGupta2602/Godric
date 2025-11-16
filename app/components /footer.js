"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Footer() {
  const [categories, setCategories] = useState([]);

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

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Godric
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted marketplace for quality products and exceptional service.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 tracking-wide">Categories</h3>
            <ul className="space-y-2.5">
              {categories.length === 0 ? (
                <li className="text-gray-500 text-sm">No categories</li>
              ) : (
                categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-gray-400 text-sm hover:text-blue-400 transition-colors inline-block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-gray-400 text-sm hover:text-blue-400 transition-colors inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 text-sm hover:text-blue-400 transition-colors inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 text-sm hover:text-blue-400 transition-colors inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 text-sm hover:text-blue-400 transition-colors inline-block">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 tracking-wide">Newsletter</h3>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-900 text-gray-200 text-sm border border-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
              <button
                onClick={() => console.log('Subscribe clicked')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Godric. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}