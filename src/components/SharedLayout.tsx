"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SharedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';
    
    const navItems = [
        { href: '/', icon: '🏠', label: 'Dashboard' },
        { href: '/calendar', icon: '📅', label: 'Kalender' },
        { href: '/shopping', icon: '🛒', label: 'Einkaufen' },
        { href: '/recipes', icon: '📖', label: 'Rezepte' },
        { href: '/mealplan', icon: '🍽️', label: 'Essen' },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
            {/* Left Navigation Rail */}
            <aside className="w-20 flex-shrink-0 bg-stone-800 border-r border-stone-700">
                <nav className="h-full flex flex-col items-center py-6 gap-4">
                    {/* Logo */}
                    <div className="mb-4">
                        <Link href="/" className="text-3xl hover:scale-110 transition-transform">
                            🦄
                        </Link>
                    </div>

                    {/* Back Button */}
                    {!isHome && (
                        <Link
                            href="/"
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-stone-700 text-white hover:bg-stone-600 transition-all"
                            title="Zurück"
                        >
                            ←
                        </Link>
                    )}

                    {!isHome && <div className="h-2" />}

                    {/* Nav Items */}
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                        : 'text-stone-400 hover:bg-stone-700 hover:text-white'}
                                `}
                                title={item.label}
                            >
                                {item.icon}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
