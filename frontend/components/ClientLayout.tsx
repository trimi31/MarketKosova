'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </AuthProvider>
    );
}
