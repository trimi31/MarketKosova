'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-shadow">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">
                            Market<span className="text-purple-400">Kosova</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
                            Browse
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link href="/listings/create" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
                                    Sell Item
                                </Link>
                                <Link href="/listings/my" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
                                    My Listings
                                </Link>
                                <Link href="/messages" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Messages
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <Link href="/admin" className="text-amber-400 hover:text-amber-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-500/10 transition-all">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium">{user?.username}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-gray-300 hover:text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/20">
                    <div className="px-4 py-3 space-y-1">
                        <Link href="/" className="block text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                            Browse
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link href="/listings/create" className="block text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                                    Sell Item
                                </Link>
                                <Link href="/listings/my" className="block text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                                    My Listings
                                </Link>
                                <Link href="/messages" className="block text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                                    Messages
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <Link href="/admin" className="block text-amber-400 px-4 py-2 rounded-lg text-sm hover:bg-amber-500/10" onClick={() => setMobileMenuOpen(false)}>
                                Admin
                            </Link>
                        )}
                        <div className="border-t border-gray-700 pt-2 mt-2">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                                    className="block w-full text-left text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/10"
                                >
                                    Logout ({user?.username})
                                </button>
                            ) : (
                                <div className="space-y-1">
                                    <Link href="/login" className="block text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link href="/register" className="block text-purple-400 px-4 py-2 rounded-lg text-sm hover:bg-purple-500/10" onClick={() => setMobileMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
