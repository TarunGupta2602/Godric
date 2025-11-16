import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  // Fetch the blog post by slug
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !post) {
    notFound();
  }

  // Increment views count
  await supabase
    .from("blog_posts")
    .update({ views: (post.views || 0) + 1 })
    .eq("id", post.id)
    .then(() => {
      // Silent update, no need to handle response
    });

  // Fetch related posts (same category or random)
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="bg-white">
      {/* Hero Section with Image */}
      {post.image_url && (
        <div className="w-full h-96 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Blog
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-gray-600 mb-8 border-b pb-8">
          {post.author && (
            <>
              <span className="font-semibold">{post.author}</span>
              <span>•</span>
            </>
          )}
          <span>{new Date(post.published_at).toLocaleDateString("en-US", { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span>•</span>
          <span className="text-gray-500">{post.views || 0} views</span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 italic text-lg text-gray-700">
            {post.excerpt}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-gray-800 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Share Section */}
        <div className="border-t pt-8 mb-12">
          <h3 className="text-lg font-semibold mb-4">Share this post:</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-lg border overflow-hidden shadow bg-white hover:shadow-lg transition"
                >
                  {relatedPost.image_url && (
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-blue-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(relatedPost.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
