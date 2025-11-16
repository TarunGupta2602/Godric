"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCart(Array.isArray(parsed) ? parsed : []);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
    setLoading(false);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {cart.length === 0 ? "No items yet" : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Mobile/Tablet: Cards, Desktop: Table */}
            <div className="lg:col-span-2 space-y-4">
              {/* Desktop Card View */}
              <div className="hidden md:block space-y-4">
                {cart.map((item, idx) => (
                  <div key={item.id + (item.variant || "") + idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-6">
                      {/* Product Image & Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm flex-shrink-0" 
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                          {item.variant && (
                            <p className="text-sm text-gray-500">{item.variant}</p>
                          )}
                          <p className="text-xl font-bold text-blue-600 mt-2">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-gray-700"
                          onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty || 1}
                          onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-10 text-center border-2 border-gray-200 rounded-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-gray-700"
                          onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right flex-shrink-0 w-32">
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="font-bold text-gray-900 text-2xl">
                          ₹{(item.price * (item.qty || 1)).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors p-3 rounded-lg flex-shrink-0"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {cart.map((item, idx) => (
                  <div key={item.id + (item.variant || "") + idx} className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex gap-4 mb-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h3>
                        {item.variant && (
                          <p className="text-sm text-gray-500 mb-2">{item.variant}</p>
                        )}
                        <p className="text-lg font-bold text-blue-600">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <button
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-gray-700"
                          onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty || 1}
                          onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border-2 border-gray-200 rounded-lg font-semibold text-gray-900 py-1 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-gray-700"
                          onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="font-bold text-gray-900 text-lg">
                          ₹{(item.price * (item.qty || 1)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      className="w-full mt-4 text-red-500 hover:text-red-700 transition-colors py-2 text-sm font-medium flex items-center justify-center gap-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Item
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Taxes and additional fees calculated at checkout
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link 
                    href="/" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}