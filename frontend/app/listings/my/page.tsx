'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Listing } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import ListingCard from '@/components/ListingCard';

export default function MyListingsPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyListings();
        }
    }, [isAuthenticated]);

    const fetchMyListings = async () => {
        try {
            const res = await api.get('/api/listings/my');
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Listings</h1>
                    <p className="text-gray-400 mt-1">Manage your published items</p>
                </div>
                <Link
                    href="/listings/create"
                    className="btn-primary px-6 py-3 rounded-xl text-center font-medium inline-flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Listing
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-slate-700"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-20">
                    <svg className="w-20 h-20 mx-auto text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-6">Start selling by creating your first listing</p>
                    <Link
                        href="/listings/create"
                        className="btn-primary px-8 py-3 rounded-xl inline-block font-medium"
                    >
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}
