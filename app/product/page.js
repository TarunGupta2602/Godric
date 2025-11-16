import React from "react"
import Link from "next/link"
import { supabaseAdmin } from "../../lib/supabase-admin"

export default async function ProductSearchPage({ searchParams }) {
  const q = (searchParams?.search || "").trim()

  if (!q) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Search products</h1>
        <p className="text-gray-600">Enter a search query in the navbar to look for products.</p>
      </main>
    )
  }

  // Search by name, slug or description (case insensitive)
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, name, slug, price, images")
    .or(`name.ilike.%${q}%,slug.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(100)

  const list = Array.isArray(products) ? products : []

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Results for “{q}”</h1>

      {list.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <li key={p.id} className="border rounded overflow-hidden">
              <Link href={`/product/${p.slug}`} className="block">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {p.images?.[0] ? (
                    // If image URL is present
                    <img src={p.images[0]} alt={p.name} className="object-contain h-full w-full" />
                  ) : (
                    <div className="text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold">{p.name}</h2>
                  <div className="mt-2 text-lg font-bold">${p.price}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
