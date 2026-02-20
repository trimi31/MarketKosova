'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Category } from '@/lib/types';

export default function CreateListingPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        categoryId: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('location', formData.location);
            data.append('categoryId', formData.categoryId);
            if (imageFile) {
                data.append('imageFile', imageFile);
            }

            await api.post('/api/listings', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.push('/listings/my');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Create Listing</h1>
                <p className="text-gray-400 mt-2">Fill in the details to list your item for sale</p>
            </div>

            <div className="bg-slate-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-xl">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 input-dark rounded-xl"
                            placeholder="What are you selling?"
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 input-dark rounded-xl resize-none"
                            placeholder="Describe your item in detail..."
                            rows={5}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Price (€) *</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 input-dark rounded-xl"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 input-dark rounded-xl"
                                placeholder="e.g., Prishtina"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-3 input-dark rounded-xl appearance-none"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Image (optional)</label>
                        <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer">
                                    <svg className="w-12 h-12 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm">Click to upload an image</p>
                                    <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 5MB</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-xl text-lg disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Publishing...
                            </div>
                        ) : (
                            'Publish Listing'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
