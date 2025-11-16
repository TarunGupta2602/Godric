import { supabase } from "@/lib/supabase";

export default async function SearchPage(props) {
  // Unwrap searchParams correctly
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">

      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Results for: <span className="text-gray-600">{q}</span>
      </h1>

      {products?.length === 0 && (
        <p className="text-gray-500 text-center pt-10">No matching products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <a
            key={product.id}
            href={`/product/${product.slug}`}
            className="border rounded-lg p-4 hover:shadow-lg transition shadow-sm bg-white"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-40 sm:h-48 md:h-52 object-cover rounded"
            />

            <h2 className="font-semibold mt-3 text-sm md:text-base">
              {product.name}
            </h2>

            <p className="text-gray-700 mt-1">${product.price}</p>
          </a>
        ))}
      </div>

    </div>
  );
}
