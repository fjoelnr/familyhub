import React, { useState } from 'react';
import { useFamilyHub } from '../../lib/contexts/FamilyHubContext';

export const InputDeck: React.FC = () => {
    const { context, setInteracting, addAgentResponse } = useFamilyHub();
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setInteracting(true);
        // Mocking an echo response for now
        setTimeout(() => {
            addAgentResponse({
                type: 'chat',
                text: `I heard: "${input}"`
            });
        }, 500);
        setInput('');
    };

    return (
        <div className="relative z-50 w-full p-8 flex justify-center pb-12">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={context.uiMode === 'nerdy' ? '> ENTER COMMAND' : 'Ask anything...'}
                    className={`
                        w-full px-6 py-4 text-lg rounded-full shadow-lg outline-none transition-all
                        ${context.uiMode === 'nerdy'
                            ? 'bg-black text-green-500 border border-green-500 placeholder-green-800'
                            : context.uiMode === 'manga'
                                ? 'bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder-stone-400 rounded-xl'
                                : 'bg-white/90 backdrop-blur text-stone-800 placeholder-stone-400 border border-white/50'
                        }
                    `}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-2 bottom-2 aspect-square rounded-full bg-current opacity-10 hover:opacity-20 transition-opacity"
                >
                    {/* Send Icon Placeholder */}
                </button>
            </form>
        </div>
    );
};
