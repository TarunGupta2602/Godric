// app/admin/page.js
'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import ManageBlogs from './manageblog';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('product'); // 'product', 'category', or 'blog'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // { id, type: 'product' or 'category', data }
  const [showModal, setShowModal] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    async function fetchData() {
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts(prodData || []);

      const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      setCategories(catData || []);
    }
    fetchData();
  }, []);

  // Refresh lists after add/edit/delete
  const refreshData = async () => {
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(prodData || []);

    const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    setCategories(catData || []);
  };

  // Delete function
  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    const { error } = await supabase
      .from(type === 'product' ? 'products' : 'categories')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
      refreshData();
    }
  };

  // Edit function
  const handleEdit = (item, type) => {
    setEditingItem({ id: item.id, type, data: item });
    setShowModal(true);
  };

  // Save edit
  const handleSaveEdit = async (updatedData, type) => {
    const table = type === 'product' ? 'products' : 'categories';
    const { error } = await supabase
      .from(table)
      .update(updatedData)
      .eq('id', editingItem.id);

    if (error) {
      alert('Error updating: ' + error.message);
    } else {
      alert('Updated successfully!');
      setShowModal(false);
      setEditingItem(null);
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab('product')}
          className={`px-6 py-3 font-semibold rounded-l-lg ${activeTab === 'product' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab('category')}
          className={`px-6 py-3 font-semibold ${activeTab === 'category' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
        >
          Add Category
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-6 py-3 font-semibold rounded-r-lg ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
        >
          Manage Blog
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        {activeTab === 'product' ? (
          <ProductForm categories={categories} onSuccess={refreshData} />
        ) : activeTab === 'category' ? (
          <CategoryForm onSuccess={refreshData} />
        ) : (
          <ManageBlogs />
        )}
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Products List */}
        {activeTab !== 'blog' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Products List</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((p) => (
                <li key={p.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{p.name}</h3>
                      <p className="text-sm text-gray-600">Price: ${p.price} | Stock: {p.stock}</p>
                      <p className="text-sm text-gray-500">Sizes: {p.sizes?.join(', ') || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Colors: {p.colors?.join(', ') || 'N/A'}</p>
                      <p className="text-xs text-gray-400">Added: {new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(p, 'product')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, 'product')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        )}

        {/* Categories List */}
        {activeTab !== 'blog' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Categories List</h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories added yet.</p>
          ) : (
            <ul className="space-y-4">
              {categories.map((c) => (
                <li key={c.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    {c.images?.[0] && <img src={c.images[0]} alt={c.name} className="w-16 h-16 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{c.name}</h3>
                      <p className="text-sm text-gray-600">Slug: {c.slug}</p>
                      <p className="text-xs text-gray-400">Added: {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(c, 'category')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, 'category')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingItem && (
        <EditModal
          item={editingItem}
          categories={categories}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// Product Form Component
function ProductForm({ categories, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    sizes: '',
    colors: '',
    stock: '',
    category_id: '',
    is_featured: false,
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFiles = (e) => {
    setFiles([...e.target.files]);
    setUploadedUrls([]);
  };

  const uploadImages = async () => {
    if (files.length === 0) return [];
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`; // No subfolder for simplicity

      const { error } = await supabase.storage.from('product-images').upload(filePath, file);
      if (error) {
        alert(`Upload failed: ${file.name} – ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      urls.push(publicUrl);
    }
    setUploading(false);
    setUploadedUrls(urls);
    return urls;
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) {
      alert('Please fill Name, Price and Category');
      return;
    }

    const imageUrls = uploadedUrls.length > 0 ? uploadedUrls : await uploadImages();
    if (files.length > 0 && imageUrls.length === 0) return;

    const productData = {
      name: form.name,
      slug: generateSlug(form.name),
      description: form.description || null,
      price: parseFloat(form.price),
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
      colors: form.colors ? form.colors.split(',').map(c => c.trim()) : [],
      stock: parseInt(form.stock) || 0,
      images: imageUrls,
      category_id: form.category_id,
      is_featured: form.is_featured,
    };

    const { error } = await supabase.from('products').insert([productData]);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Product added!');
      setForm({ name: '', description: '', price: '', sizes: '', colors: '', stock: '', category_id: '', is_featured: false });
      setFiles([]);
      setUploadedUrls([]);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price *</label>
        <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category *</label>
        <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <option value="">Select</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
        <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Colors (comma separated)</label>
        <input type="text" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Images (multiple)</label>
        <input type="file" multiple accept="image/*" onChange={handleFiles} className="mt-1 block w-full" />
        {uploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
        {uploadedUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {uploadedUrls.map((url, i) => <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover rounded shadow" />)}
          </div>
        )}
      </div>

      <div className="col-span-2 flex items-center">
        <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        <label className="ml-2 block text-sm text-gray-900">Featured</label>
      </div>

      <button type="submit" disabled={uploading} className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {uploading ? 'Uploading...' : 'Add Product'}
      </button>
    </form>
  );
}

// Category Form Component
function CategoryForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFiles = (e) => {
    setFiles([...e.target.files]);
    setUploadedUrls([]);
  };

  const uploadImages = async () => {
    if (files.length === 0) return [];
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage.from('category-images').upload(filePath, file);
      if (error) {
        alert(`Upload failed: ${file.name} – ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('category-images').getPublicUrl(filePath);
      urls.push(publicUrl);
    }
    setUploading(false);
    setUploadedUrls(urls);
    return urls;
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert('Please fill Name');
      return;
    }

    const imageUrls = uploadedUrls.length > 0 ? uploadedUrls : await uploadImages();
    if (files.length > 0 && imageUrls.length === 0) return;

    const categoryData = {
      name: form.name,
      slug: generateSlug(form.name),
      images: imageUrls,
    };

    const { error } = await supabase.from('categories').insert([categoryData]);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Category added!');
      setForm({ name: '' });
      setFiles([]);
      setUploadedUrls([]);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images (multiple)</label>
        <input type="file" multiple accept="image/*" onChange={handleFiles} className="mt-1 block w-full" />
        {uploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
        {uploadedUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {uploadedUrls.map((url, i) => <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover rounded shadow" />)}
          </div>
        )}
      </div>

      <button type="submit" disabled={uploading} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {uploading ? 'Uploading...' : 'Add Category'}
      </button>
    </form>
  );
}

// Edit Modal Component
function EditModal({ item, categories, onSave, onClose }) {
  const [form, setForm] = useState(item.data);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const isProduct = item.type === 'product';

  const handleFiles = (e) => {
    setFiles([...e.target.files]);
    setUploadedUrls([]);
  };

  const uploadImages = async () => {
    if (files.length === 0) return form.images || [];
    setUploading(true);
    const urls = [...(form.images || [])]; // Keep existing
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = isProduct ? `${fileName}` : `${fileName}`; // product-images or category-images

      const bucket = isProduct ? 'product-images' : 'category-images';
      const { error } = await supabase.storage.from(bucket).upload(filePath, file);
      if (error) {
        alert(`Upload failed: ${file.name} – ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      urls.push(publicUrl);
    }
    setUploading(false);
    setUploadedUrls(urls);
    return urls;
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedImages = uploadedUrls.length > 0 ? uploadedUrls : await uploadImages();
    if (files.length > 0 && updatedImages.length === 0) return;

    const updatedData = {
      ...form,
      slug: generateSlug(form.name),
      images: updatedImages,
    };

    if (isProduct) {
      // FIX: Handle sizes/colors as string (from input) or array (from DB)
      let sizes = form.sizes;
      if (typeof sizes === 'string') {
        sizes = sizes ? sizes.split(',').map(s => s.trim()) : [];
      }
      updatedData.sizes = sizes;

      let colors = form.colors;
      if (typeof colors === 'string') {
        colors = colors ? colors.split(',').map(c => c.trim()) : [];
      }
      updatedData.colors = colors;

      updatedData.stock = parseInt(form.stock) || 0;
      updatedData.price = parseFloat(form.price);
      updatedData.description = form.description || null; // Ensure null if empty
    }

    onSave(updatedData, item.type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit {isProduct ? 'Product' : 'Category'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          {isProduct && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows="3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price *</label>
                <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
                <input type="text" value={Array.isArray(form.sizes) ? form.sizes.join(', ') : form.sizes || ''} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Colors (comma separated)</label>
                <input type="text" value={Array.isArray(form.colors) ? form.colors.join(', ') : form.colors || ''} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div className="flex items-center">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Featured</label>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Add More Images (optional)</label>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="mt-1 block w-full" />
            {uploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
            {form.images && form.images.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">Current images: {form.images.length}</div>
            )}
          </div>

          <div className="flex space-x-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}