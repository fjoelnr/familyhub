import React from 'react';
import { useFamilyHub } from '../../lib/contexts/FamilyHubContext';

export const AmbientCanvas: React.FC = () => {
    const { context } = useFamilyHub();
    const { uiMode } = context;

    const getBackgroundClass = () => {
        switch (uiMode) {
            case 'calm':
                return 'bg-gradient-to-br from-stone-50 to-stone-200';
            case 'nerdy':
                return 'bg-slate-900 border-2 border-green-500/20';
            case 'manga':
                return 'bg-pink-50 bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f9a8d4\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")]';
            default:
                return 'bg-white';
        }
    };

    return (
        <div
            className={`fixed inset-0 z-0 transition-colors duration-1000 ${getBackgroundClass()}`}
            aria-hidden="true"
        >
            {uiMode === 'nerdy' && (
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #00ff00 25%, #00ff00 26%, transparent 27%, transparent 74%, #00ff00 75%, #00ff00 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #00ff00 25%, #00ff00 26%, transparent 27%, transparent 74%, #00ff00 75%, #00ff00 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
            )}
        </div>
    );
};
