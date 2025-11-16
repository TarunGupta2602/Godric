"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ManageBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (for editing & creating)
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Load posts
  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (!error) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Fill form for editing
  const startEditing = (post) => {
    setIsEditing(true);
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setAuthor(post.author);
    setImageUrl(post.image_url || "");
    setIsPublished(post.is_published);
  };

  // Clear form after save
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setAuthor("");
    setImageUrl("");
    setIsPublished(true);
    setMessage("");
  };

  // Upload image to bucket
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.log(error);
      setMessage("❌ Error uploading image");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    setImageUrl(urlData.publicUrl);
    setMessage("✅ Image uploaded!");
    setUploading(false);
  };

  // Save changes (update)
  const handleSave = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        author,
        image_url: imageUrl,
        is_published: isPublished,
      })
      .eq("id", editId);

    if (error) {
      setMessage("❌ Error updating post");
    } else {
      setMessage("✅ Post updated successfully");
      resetForm();
      loadPosts();
    }
  };

  // Delete post
  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (!error) {
      setMessage("🗑️ Post deleted");
      loadPosts();
    }
  };

  // Create new blog post
  const handleAddBlog = async (e) => {
    e.preventDefault();

    if (!title || !slug || !content) {
      setMessage("❌ Please fill in Title, Slug, and Content");
      return;
    }

    const { error } = await supabase.from("blog_posts").insert([
      {
        title,
        slug,
        excerpt,
        content,
        author,
        image_url: imageUrl,
        is_published: isPublished,
      },
    ]);

    if (error) {
      setMessage("❌ Error creating post: " + error.message);
    } else {
      setMessage("✅ Blog post created successfully");
      resetForm();
      loadPosts();
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6">Manage Blog Posts</h1>

      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          ➕ Add New Blog Post
        </button>
      )}

      {/* List of posts */}
      {/* List of posts */}
<div className="mb-10">
  {loading ? (
    <p>Loading...</p>
  ) : (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border rounded-lg flex items-center gap-4 bg-white shadow"
        >
          {/* Blog image */}
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-32 h-20 object-cover rounded-md"
            />
          ) : (
            <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
              No Image
            </div>
          )}

          {/* Blog text */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              {post.is_published ? "Published" : "Draft"} •{" "}
              {new Date(post.published_at).toLocaleDateString()}
            </p>
            {post.excerpt && (
              <p className="text-gray-700 mt-1 text-sm">{post.excerpt}</p>
            )}
          </div>

          {/* Edit/Delete buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => startEditing(post)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Edit
            </button>

            <button
              onClick={() => deletePost(post.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Edit/Add Form */}
      {isEditing && (
        <div className="bg-gray-100 p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6">
            {editId ? "Edit Post" : "Create New Blog Post"}
          </h2>

          <form onSubmit={editId ? handleSave : handleAddBlog} className="space-y-6">
            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />

            <textarea
              className="w-full border px-4 py-2 rounded"
              placeholder="Excerpt"
              rows="2"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />

            <textarea
              className="w-full border px-4 py-2 rounded"
              placeholder="Content (HTML or Markdown)"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            {/* Image uploader */}
            <div>
              <label className="block font-semibold mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="w-full border px-4 py-2 rounded"
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="mt-3 w-40 rounded shadow"
                />
              )}
            </div>

            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={() => setIsPublished(!isPublished)}
              />
              <label>Published</label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                {editId ? "Save Changes" : "Create Blog Post"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>

            {message && (
              <p className="text-center mt-3 font-semibold">{message}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
