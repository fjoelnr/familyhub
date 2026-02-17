'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: '🏠 Dashboard', icon: '🏠' },
    { href: '/shopping', label: '🛒 Einkaufen', icon: '🛒' },
    { href: '/recipes', label: '📖 Rezepte', icon: '📖' },
    { href: '/mealplan', label: '📅 Essen', icon: '📅' },
  ];

  return (
    <nav className="bg-white/60 backdrop-blur-sm border-b border-white/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦄</span>
          <span className="font-bold text-stone-700 text-xl">Family Hub</span>
        </div>
        
        <div className="flex gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive 
                  ? 'px-4 py-2 rounded-xl bg-stone-700 text-white transition-colors' 
                  : 'px-4 py-2 rounded-xl text-stone-600 hover:bg-white/50 transition-colors'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
