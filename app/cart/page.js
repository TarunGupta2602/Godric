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
    return <div className="min-h-[60vh] flex items-center justify-center text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Product</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={item.id + (item.variant || "") + idx} className="border-b last:border-b-0">
                    <td className="py-3 flex items-center gap-4">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                      )}
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        {item.variant && <div className="text-xs text-gray-500">{item.variant}</div>}
                      </div>
                    </td>
                    <td className="py-3">₹{item.price.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                        >-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty || 1}
                          onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border rounded"
                        />
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td className="py-3 font-semibold">₹{(item.price * (item.qty || 1)).toLocaleString()}</td>
                    <td className="py-3">
                      <button
                        className="text-red-500 hover:underline text-sm"
                        onClick={() => removeFromCart(item.id)}
                      >Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg shadow p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t my-4"></div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg">Checkout</button>
            <p className="text-xs text-gray-400 mt-3 text-center">Taxes calculated at checkout.</p>
          </div>
        </div>
      )}
    </div>
  );
}
