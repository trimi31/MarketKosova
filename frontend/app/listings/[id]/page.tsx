'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Listing } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchListing();
    }, [id]);

    const fetchListing = async () => {
        try {
            const res = await api.get(`/api/listings/${id}`);
            setListing(res.data);
        } catch (err) {
            console.error('Failed to fetch listing', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        setDeleting(true);
        try {
            await api.delete(`/api/listings/${id}`);
            router.push('/listings/my');
        } catch (err) {
            console.error('Failed to delete listing', err);
            alert('Failed to delete listing');
        } finally {
            setDeleting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-96 bg-slate-700 rounded-2xl"></div>
                    <div className="h-6 bg-slate-700 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-400">Listing not found</h2>
                <Link href="/" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
                    ← Back to listings
                </Link>
            </div>
        );
    }

    const isOwner = isAuthenticated && user?.userId === listing.userId;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-300">{listing.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Image */}
                <div className="lg:col-span-3">
                    <div className="bg-slate-800/50 border border-gray-700/50 rounded-2xl overflow-hidden aspect-[4/3]">
                        {listing.image ? (
                            <img
                                src={`${API_URL}/uploads/${listing.image}`}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-700 to-slate-800">
                                <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <span className="inline-block bg-purple-600/20 text-purple-400 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/30 mb-3">
                            {listing.categoryName}
                        </span>
                        <h1 className="text-3xl font-bold text-white">{listing.title}</h1>
                        <p className="text-3xl font-bold text-gradient mt-3">{formatPrice(listing.price)}</p>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-slate-800/50 border border-gray-700/50 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {listing.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-medium">{listing.username}</p>
                                <p className="text-gray-400 text-sm">Seller</p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{listing.location || 'Kosovo'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Listed on {formatDate(listing.createdAt)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {(isOwner || isAdmin) && (
                        <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                            {isOwner && (
                                <Link
                                    href={`/listings/${listing.id}/edit`}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-center font-medium transition-colors"
                                >
                                    Edit Listing
                                </Link>
                            )}
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {listing.description && (
                <div className="mt-10 bg-slate-800/50 border border-gray-700/50 rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
            )}
        </div>
    );
}
