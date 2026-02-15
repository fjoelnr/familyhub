"use client";

import { useEffect, useState, useMemo } from "react";
import type { Recipe } from "@/lib/contracts/food/recipe";

const CATEGORIES = [
    "Alle",
    "Hauptgericht",
    "Beilage",
    "Dessert",
    "Suppe",
    "Frühstück",
];

interface RecipeListProps {
    onSelectRecipe?: (recipeId: string) => void;
}

export default function RecipeList({ onSelectRecipe }: RecipeListProps) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Alle");

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedCategory !== "Alle") params.set("category", selectedCategory);

        fetch(`/api/recipes?${params.toString()}`)
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden der Rezepte");
                return res.json();
            })
            .then((data) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    }, [search, selectedCategory]);

    const totalTime = (r: Recipe) => r.prepTimeMinutes + r.cookTimeMinutes;

    if (error) {
        return (
            <div className="p-6 bg-red-900/30 border border-red-500/30 rounded-2xl text-red-300">
                <span className="text-lg font-semibold">⚠️ Fehler</span>
                <p className="mt-1 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    🍳 Rezepte
                </h2>
                <span className="text-sm text-gray-400">
                    {recipes.length} Rezept{recipes.length !== 1 ? "e" : ""}
                </span>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rezept suchen…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-xl
                       text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50
                       transition-all duration-200"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                ${selectedCategory === cat
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10"
                                    : "bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50 hover:text-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipe Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-48 bg-gray-800/40 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-400 text-lg">Keine Rezepte gefunden</p>
                    <p className="text-gray-500 text-sm mt-1">
                        Versuche einen anderen Suchbegriff oder Kategorie
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe, idx) => (
                        <button
                            key={recipe.id}
                            onClick={() => onSelectRecipe?.(recipe.id)}
                            className="group text-left p-5 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30
                         rounded-2xl shadow-lg shadow-black/20
                         hover:bg-gray-700/60 hover:border-amber-500/30 hover:shadow-amber-500/5
                         transition-all duration-300 hover:-translate-y-1
                         animate-slide-up"
                            style={{ animationDelay: `${idx * 60}ms` }}
                        >
                            {/* Category Badge */}
                            <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-500/15 text-amber-400 mb-3">
                                {recipe.category}
                            </span>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-amber-400 transition-colors duration-200">
                                {recipe.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">
                                {recipe.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {totalTime(recipe)} Min
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {recipe.servings} Portionen
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {recipe.ingredients.length} Zutaten
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {recipe.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-700/60 text-gray-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
