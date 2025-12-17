import React from 'react';
import { useFamilyHub } from '../../lib/contexts/FamilyHubContext';

export const StatusRail: React.FC = () => {
    const { context, setUiMode } = useFamilyHub();

    return (
        <div className={`
            z-50 flex flex-row justify-between items-center p-6 w-full h-20 
            transition-colors duration-500
            ${context.uiMode === 'nerdy'
                ? 'bg-black/80 text-green-400 font-mono border-b border-green-500'
                : context.uiMode === 'manga'
                    ? 'bg-white/90 text-black font-bold border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-transparent text-stone-800 font-serif'}
        `}>
            {/* Left: Clock & Weather Mock */}
            <div className="flex gap-6 items-center">
                <div className="text-3xl font-bold">{context.time.slice(0, 5)}</div>
                <div className="flex gap-2 items-center text-lg opacity-70">
                    <span>⛅</span>
                    <span>14°C</span>
                </div>
            </div>

            {/* Right: Context Badges & Debug Controls */}
            <div className="flex gap-4 items-center">
                <span className="px-3 py-1 text-xs uppercase opacity-50 tracking-widest border border-current rounded-full">
                    {context.dayType}
                </span>

                {/* Debug Mode Switcher */}
                <select
                    value={context.uiMode}
                    onChange={(e) => setUiMode(e.target.value as any)}
                    className="bg-transparent border border-current rounded px-2 py-1 text-sm cursor-pointer hover:opacity-100 opacity-50 outline-none"
                >
                    <option value="calm">Calm</option>
                    <option value="nerdy">Nerdy</option>
                    <option value="manga">Manga</option>
                </select>
            </div>
        </div>
    );
};
