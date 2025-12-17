import React from 'react';
import { ActionResult } from '../../lib/agents/calendarAgent'; // Assuming types exist or using generic
import { useFamilyHub } from '../../lib/contexts/FamilyHubContext';

interface ActionConfirmationCardProps {
    text: string;
    actionResult?: any; // strict typing can be added later
    onConfirm: () => void;
    onCancel: () => void;
}

export const ActionConfirmationCard: React.FC<ActionConfirmationCardProps> = ({ text, onConfirm, onCancel }) => {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xl animate-scale-in mx-auto w-full max-w-md">
            <div className="flex gap-4 items-start">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-900 mb-2">Confirmation Needed</h3>
                    <p className="text-amber-800 mb-6 font-serif leading-relaxed">
                        {text}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2 rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-5 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 shadow-md transition-colors"
                        >
                            Confirm Action
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
