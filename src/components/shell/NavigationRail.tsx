"use client";
import React from 'react';

export default function NavigationRail() {
    return (
        <nav className="h-full flex flex-col items-center py-6 gap-8">
            {/* Mock Nav Items for now */}
            <NavItem icon="🏠" active />
            <NavItem icon="📅" />
            <NavItem icon="📝" />
            <NavItem icon="⚙️" />
        </nav>
    );
}

function NavItem({ icon, active = false }: { icon: string, active?: boolean }) {
    return (
        <button
            className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all
                ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
        >
            {icon}
        </button>
    );
}
