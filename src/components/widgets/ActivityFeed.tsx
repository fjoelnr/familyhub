"use client";
import React from 'react';
import { mockActivities } from '@/lib/data/mockActivities';

export default function ActivityFeed() {
    return (
        <div className="flex flex-col h-full bg-[var(--surface-dark)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-highlight)]/10">
                <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                    Recent Activity
                </h2>
            </div>

            <div className="flex-1 overflow-hidden p-0">
                <ul className="divide-y divide-[var(--border)]">
                    {mockActivities.map((activity) => (
                        <li key={activity.id} className={`
                            p-4 hover:bg-[var(--surface-highlight)]/5 transition-colors animate-in fade-in duration-500
                            ${activity.contextTag ? 'bg-orange-500/5 border-l-2 border-orange-500/50 pl-[14px]' : ''}
                        `}>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                                    {activity.text}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <span className="font-mono">{activity.timestamp}</span>
                                    {activity.user && (
                                        <>
                                            <span>•</span>
                                            <span className="bg-[var(--surface-highlight)] px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                                                {activity.user}
                                            </span>
                                        </>
                                    )}
                                    {/* Iteration 2: Relationship Tag */}
                                    {activity.contextTag && (
                                        <>
                                            <span>•</span>
                                            <span className="text-orange-400 font-medium">{activity.contextTag}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
