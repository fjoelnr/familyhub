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
    const disabled = !active;
    return (
        <button
            className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all
                ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 cursor-pointer'
                    : 'text-slate-600 bg-slate-800/20 cursor-not-allowed opacity-50'}
            `}
            disabled={disabled}
            title={disabled ? "Noch nicht verfügbar" : ""}
        >
            {icon}
        </button>
    );
}
