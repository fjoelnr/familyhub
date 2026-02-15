"use client";

import { useEffect, useState } from "react";
import type { ShoppingItem, ShoppingCategory } from "@/lib/contracts/food/shopping";

export default function ShoppingList() {
    const [categories, setCategories] = useState<ShoppingCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetch("/api/shopping")
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden der Einkaufsliste");
                return res.json();
            })
            .then((data: ShoppingCategory[]) => {
                setCategories(data);
                // Initialize checked items from server data
                const initialChecked = new Set<string>();
                data.forEach((cat) => {
                    cat.items.forEach((item) => {
                        if (item.checked) initialChecked.add(item.id);
                    });
                });
                setCheckedItems(initialChecked);
                setLoading(false);
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    }, []);

    const toggleItem = (itemId: string) => {
        setCheckedItems((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
        });
    };

    const toggleCategory = (category: string) => {
        setCollapsedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    };

    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const checkedCount = checkedItems.size;
    const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

    const categoryIcon = (category: string): string => {
        const icons: Record<string, string> = {
            "Gemüse": "🥬",
            "Fleisch": "🥩",
            "Milchprodukte": "🧈",
            "Nudeln & Reis": "🍝",
            "Konserven": "🥫",
            "Obst": "🍎",
            "Backzutaten": "🧁",
            "Öle & Gewürze": "🧂",
            "Kräuter": "🌿",
        };
        return icons[category] ?? "📦";
    };

    if (error) {
        return (
            <div className="p-6 bg-red-900/30 border border-red-500/30 rounded-2xl text-red-300">
                <span className="text-lg font-semibold">⚠️ Fehler</span>
                <p className="mt-1 text-sm">{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-800/40 rounded-xl w-48" />
                <div className="h-3 bg-gray-800/40 rounded-full w-full" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-800/40 rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    🛒 Einkaufsliste
                </h2>
                <span className="text-sm text-gray-400">
                    {checkedCount}/{totalItems} erledigt
                </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${progressPercent}%`,
                            background:
                                progressPercent === 100
                                    ? "linear-gradient(to right, #10b981, #14b8a6)"
                                    : "linear-gradient(to right, #f59e0b, #f97316)",
                        }}
                    />
                </div>
                {progressPercent === 100 && (
                    <p className="text-center text-emerald-400 text-sm font-medium animate-scale-in">
                        ✅ Alles eingekauft!
                    </p>
                )}
            </div>

            {/* Category Groups */}
            <div className="space-y-3">
                {categories.map((cat) => {
                    const isCollapsed = collapsedCategories.has(cat.category);
                    const catCheckedCount = cat.items.filter((item) => checkedItems.has(item.id)).length;
                    const allChecked = catCheckedCount === cat.items.length;

                    return (
                        <div
                            key={cat.category}
                            className={`bg-gray-800/60 backdrop-blur-sm border rounded-2xl shadow-lg shadow-black/20 overflow-hidden transition-all duration-300
                ${allChecked ? "border-emerald-500/20" : "border-gray-700/30"}`}
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(cat.category)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{categoryIcon(cat.category)}</span>
                                    <span className={`font-semibold ${allChecked ? "text-gray-500" : "text-gray-200"}`}>
                                        {cat.category}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
                                        {catCheckedCount}/{cat.items.length}
                                    </span>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Items */}
                            {!isCollapsed && (
                                <div className="px-4 pb-3 space-y-1">
                                    {cat.items.map((item) => {
                                        const isChecked = checkedItems.has(item.id);
                                        return (
                                            <label
                                                key={item.id}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                          ${isChecked
                                                        ? "bg-emerald-500/8"
                                                        : "hover:bg-gray-700/40"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleItem(item.id)}
                                                    className="w-4.5 h-4.5 rounded border-gray-600 bg-gray-800
                                     text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0
                                     cursor-pointer accent-emerald-500"
                                                />
                                                <span
                                                    className={`flex-1 text-sm transition-all duration-200 ${isChecked ? "line-through text-gray-500" : "text-gray-300"
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>
                                                <span
                                                    className={`text-xs transition-all duration-200 ${isChecked ? "text-gray-600" : "text-gray-500"
                                                        }`}
                                                >
                                                    {item.amount} {item.unit}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
