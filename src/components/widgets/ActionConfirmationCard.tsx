import React from 'react';
import { ActionResult } from '@/lib/contracts/agents';
import { useFamilyHub } from '../../lib/contexts/FamilyHubContext';

interface ActionConfirmationCardProps {
    text: string;
    actionResult?: ActionResult;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ActionConfirmationCard: React.FC<ActionConfirmationCardProps> = ({ text, onConfirm, onCancel }) => {
    const { context } = useFamilyHub();
    const { uiMode } = context;

    const getCardStyle = () => {
        switch (uiMode) {
            case 'nerdy':
                return 'bg-black border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)] font-mono text-green-500';
            case 'manga':
                return 'bg-amber-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-bold text-black';
            default: // calm
                return 'bg-amber-50 border border-amber-200 shadow-xl font-serif text-amber-900';
        }
    };

    const getPrimaryButtonStyle = () => {
        switch (uiMode) {
            case 'nerdy':
                return 'bg-green-900/30 text-green-400 border border-green-500 hover:bg-green-900/50';
            case 'manga':
                return 'bg-black text-white border-2 border-black hover:bg-stone-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]';
            default: // calm
                return 'bg-amber-600 text-white hover:bg-amber-700 shadow-md';
        }
    };

    const getCancelButtonStyle = () => {
        switch (uiMode) {
            case 'nerdy':
                return 'bg-transparent text-green-700 border border-transparent hover:text-green-500 hover:border-green-900';
            case 'manga':
                return 'bg-transparent text-black border-2 border-transparent hover:border-black';
            default: // calm
                return 'bg-amber-100 text-amber-900 hover:bg-amber-200';
        }
    };

    return (
        <div className={`rounded-2xl p-6 animate-scale-in mx-auto w-full max-w-md transition-all duration-300 ${getCardStyle()}`}>
            <div className="flex gap-4 items-start">
                <div className="text-3xl">
                    {uiMode === 'nerdy' ? '⚠️' : uiMode === 'manga' ? '💢' : '⚠️'}
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${uiMode === 'nerdy' ? 'uppercase tracking-widest' : ''}`}>
                        {uiMode === 'nerdy' ? 'Action Required' : 'Confirmation Needed'}
                    </h3>
                    <p className={`mb-6 leading-relaxed ${uiMode === 'nerdy' ? 'text-green-400/80' : ''}`}>
                        {text}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className={`px-5 py-2 rounded-lg font-medium transition-all ${getCancelButtonStyle()}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2 rounded-lg font-medium transition-all ${getPrimaryButtonStyle()}`}
                        >
                            {uiMode === 'nerdy' ? '[CONFIRM]' : 'Confirm Action'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
