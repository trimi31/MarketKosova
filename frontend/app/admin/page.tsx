'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { UserInfo, Listing } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
    const router = useRouter();
    const { isAdmin, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'listings'>('users');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            router.push('/');
        }
    }, [authLoading, isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchListings();
        }
    }, [isAdmin]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchListings = async () => {
        try {
            const res = await api.get('/api/listings');
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        }
    };

    const handleDeleteListing = async (id: number) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            await api.delete(`/api/admin/listings/${id}`);
            setListings(listings.filter((l) => l.id !== id));
        } catch (err) {
            console.error('Failed to delete listing', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
    };

    if (authLoading) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 mt-1">Manage users and listings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-900/50 to-slate-800 border border-purple-500/20 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{users.length}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-900/50 to-slate-800 border border-pink-500/20 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm font-medium">Total Listings</p>
                    <p className="text-4xl font-bold text-white mt-2">{listings.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1 mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-slate-700'
                        }`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'listings'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-slate-700'
                        }`}
                >
                    Listings
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-800 rounded-xl"></div>
                    ))}
                </div>
            ) : activeTab === 'users' ? (
                /* Users Table */
                <div className="bg-slate-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">ID</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Username</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Email</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Role</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-300 text-sm">{u.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-white font-medium text-sm">{u.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${u.role === 'ADMIN'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                    : 'bg-green-500/10 text-green-400 border border-green-500/30'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(u.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Listings Table */
                <div className="bg-slate-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">ID</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Title</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Price</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Seller</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Category</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {listings.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-300 text-sm">{l.id}</td>
                                        <td className="px-6 py-4 text-white font-medium text-sm max-w-[200px] truncate">
                                            {l.title}
                                        </td>
                                        <td className="px-6 py-4 text-purple-400 font-semibold text-sm">
                                            {formatPrice(l.price)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{l.username}</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{l.categoryName}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDeleteListing(l.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
