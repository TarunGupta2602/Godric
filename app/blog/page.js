import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function BlogPage() {
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) return <p className="text-center mt-10">Error loading posts</p>;

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-5xl font-extrabold tracking-tight mb-12 text-center">
        Blog & Insights
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {posts?.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border overflow-hidden shadow bg-white hover:shadow-xl transition"
          >
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
              />
            )}

            <div className="p-6">
              <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="mt-3 text-gray-600">{post.excerpt}</p>
              )}

              <p className="mt-4 text-sm text-gray-500">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
