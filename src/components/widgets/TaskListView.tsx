"use client";
import React, { useState } from 'react';
import { mockTaskLists } from '@/lib/data/mockTasks';

export default function TaskListView() {
    // Local state for immediate feedback (checkbox toggle)
    const [lists, setLists] = useState(mockTaskLists);

    // Persistence key
    const STORAGE_KEY = 'familyhub.taskState.v1';

    // Load from localStorage on mount
    React.useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Simple validation: check if it's an array
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setLists(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to load task state", e);
        }
    }, []);

    // Save to localStorage on change
    React.useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
        } catch (e) {
            console.error("Failed to save task state", e);
        }
    }, [lists]);

    const toggleItem = (listId: string, itemId: string) => {
        setLists(prev => prev.map(list => {
            if (list.id !== listId) return list;
            return {
                ...list,
                items: list.items.map(item => {
                    if (item.id !== itemId) return item;
                    return { ...item, checked: !item.checked };
                })
            };
        }));
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {lists.map((list) => (
                <div key={list.id} className="flex-1 bg-[var(--surface-dark)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm flex flex-col">
                    {/* Header */}
                    <div className={`${list.color} p-3 text-white flex justify-between items-center bg-opacity-90`}>
                        <h3 className="font-semibold tracking-wide text-sm uppercase flex items-center gap-2">
                            {list.title}
                        </h3>
                        <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded-full">
                            {list.items.filter(i => !i.checked).length} open
                        </span>
                    </div>

                    {/* List Items */}
                    <div className="flex-1 overflow-auto p-2 space-y-1">
                        {list.items.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => toggleItem(list.id, item.id)}
                                className="group flex items-center gap-3 p-2 hover:bg-[var(--surface-highlight)]/30 rounded-lg cursor-pointer transition-all duration-200 select-none"
                            >
                                {/* Checkbox with animation */}
                                <div className={`
                                    w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300
                                    ${item.checked
                                        ? 'bg-green-500 border-green-500 scale-90'
                                        : 'border-slate-500 group-hover:border-slate-300 bg-slate-800/50'}
                                `}>
                                    {item.checked && (
                                        <svg className="w-3.5 h-3.5 text-white animate-in zoom-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>

                                {/* Text with transition */}
                                <div className="flex flex-col">
                                    <span className={`
                                        transition-all duration-300 font-medium
                                        ${item.checked
                                            ? 'text-[var(--text-secondary)] line-through decoration-slate-600 opacity-60'
                                            : 'text-[var(--text-primary)]'}
                                    `}>
                                        {item.text}
                                    </span>
                                    {/* Iteration 2: Relationship Hint */}
                                    {item.contextTag && !item.checked && (
                                        <span className="text-[10px] text-orange-400/80 font-medium tracking-wide flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-orange-400/80" />
                                            Related to activity
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
