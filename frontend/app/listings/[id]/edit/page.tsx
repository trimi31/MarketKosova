'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Category, Listing } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { isAuthenticated, loading: authLoading, user } = useAuth();
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
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        fetchCategories();
        fetchListing();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchListing = async () => {
        try {
            const res = await api.get<Listing>(`/api/listings/${id}`);
            const listing = res.data;

            if (user && listing.userId !== user.userId) {
                router.push('/');
                return;
            }

            setFormData({
                title: listing.title,
                description: listing.description || '',
                price: listing.price.toString(),
                location: listing.location || '',
                categoryId: listing.categoryId.toString(),
            });
            setCurrentImage(listing.image);
        } catch (err) {
            console.error('Failed to fetch listing', err);
        } finally {
            setPageLoading(false);
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

            await api.put(`/api/listings/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.push(`/listings/${id}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to update listing');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || pageLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-12 bg-slate-700 rounded"></div>
                    <div className="h-32 bg-slate-700 rounded"></div>
                    <div className="h-12 bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Edit Listing</h1>
                <p className="text-gray-400 mt-2">Update the details of your listing</p>
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
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 input-dark rounded-xl resize-none"
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 input-dark rounded-xl"
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                        {currentImage && !imagePreview && (
                            <div className="mb-3">
                                <p className="text-gray-400 text-sm mb-2">Current image:</p>
                                <img
                                    src={`${API_URL}/uploads/${currentImage}`}
                                    alt="Current"
                                    className="max-h-32 rounded-lg"
                                />
                            </div>
                        )}
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
                                    <p className="text-gray-400 text-sm">Click to upload a new image</p>
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

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary py-3.5 rounded-xl text-lg disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
