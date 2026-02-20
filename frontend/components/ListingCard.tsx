import Link from 'next/link';
import { Listing } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ListingCardProps {
    listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 30) return `${Math.floor(diffDays / 30)}mo ago`;
        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        return 'Just now';
    };

    return (
        <Link href={`/listings/${listing.id}`} className="group">
            <div className="bg-slate-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
                    {listing.image ? (
                        <img
                            src={`${API_URL}/uploads/${listing.image}`}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className="bg-purple-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                            {listing.categoryName}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-white font-semibold text-lg truncate group-hover:text-purple-400 transition-colors">
                        {listing.title}
                    </h3>
                    <p className="text-purple-400 font-bold text-xl mt-1">
                        {formatPrice(listing.price)}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate max-w-[120px]">{listing.location || 'Kosovo'}</span>
                        </div>
                        <span>{timeAgo(listing.createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
