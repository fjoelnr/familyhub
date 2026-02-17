"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationRail() {
    const pathname = usePathname();
    
    const navItems = [
        { href: '/', icon: '🏠', label: 'Dashboard' },
        { href: '/calendar', icon: '📅', label: 'Kalender' },
        { href: '/shopping', icon: '🛒', label: 'Einkaufen' },
        { href: '/recipes', icon: '📖', label: 'Rezepte' },
        { href: '/mealplan', icon: '🍽️', label: 'Essen' },
    ];

    return (
        <nav className="h-full flex flex-col items-center py-6 gap-4">
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
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                        `}
                        title={item.label}
                    >
                        {item.icon}
                    </Link>
                );
            })}
        </nav>
    );
}
