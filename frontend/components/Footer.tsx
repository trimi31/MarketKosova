import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">M</span>
                            </div>
                            <span className="text-white font-bold text-lg">
                                Market<span className="text-purple-400">Kosova</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The premier online marketplace for Kosovo. Buy and sell anything from electronics to real estate.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Browse</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">All Listings</Link></li>
                            <li><Link href="/?category=1" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Electronics</Link></li>
                            <li><Link href="/?category=2" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Vehicles</Link></li>
                            <li><Link href="/?category=3" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Real Estate</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h3>
                        <ul className="space-y-2">
                            <li><Link href="/login" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Login</Link></li>
                            <li><Link href="/register" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Register</Link></li>
                            <li><Link href="/listings/create" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Sell an Item</Link></li>
                            <li><Link href="/listings/my" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">My Listings</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-2">
                            <li><span className="text-gray-400 text-sm">Help Center</span></li>
                            <li><span className="text-gray-400 text-sm">Safety Tips</span></li>
                            <li><span className="text-gray-400 text-sm">Terms of Service</span></li>
                            <li><span className="text-gray-400 text-sm">Privacy Policy</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} MarketKosova. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">Made with ♥ in Kosovo</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
