'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Listing, Category } from '@/lib/types';
import ListingCard from '@/components/ListingCard';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchListings = async (categoryId?: number, search?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;
      const res = await api.get('/api/listings', { params });
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    if (categoryId) {
      fetchListings(categoryId);
    } else {
      fetchListings();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(null);
    if (searchQuery.trim()) {
      fetchListings(undefined, searchQuery.trim());
    } else {
      fetchListings();
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhODU1ZjciIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Buy & Sell in{' '}
              <span className="text-gradient">Kosovo</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
              Discover thousands of listings. From electronics to real estate — find what you need or sell what you don&apos;t.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-gray-700/50 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-lg"
                />
              </div>
              <button
                type="submit"
                className="btn-primary px-8 py-4 rounded-2xl text-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === null
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-gray-700/50'
              }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-gray-700/50'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No listings found</h3>
            <p className="text-gray-500">Be the first to create a listing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
