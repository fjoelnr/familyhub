"use client";

import { useEffect, useState } from "react";
import type { Recipe } from "@/lib/contracts/food/recipe";

interface RecipeDetailProps {
    recipeId: string;
    onBack?: () => void;
    onAddToShoppingList?: (recipeId: string) => void;
}

export default function RecipeDetail({
    recipeId,
    onBack,
    onAddToShoppingList,
}: RecipeDetailProps) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [addedToList, setAddedToList] = useState(false);

    useEffect(() => {
        fetch("/api/recipes")
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden des Rezepts");
                return res.json();
            })
            .then((data: Recipe[]) => {
                const found = data.find((r) => r.id === recipeId);
                if (!found) throw new Error("Rezept nicht gefunden");
                setRecipe(found);
                setLoading(false);
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    }, [recipeId]);

    const toggleIngredient = (index: number) => {
        setCheckedIngredients((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const toggleStep = (stepNumber: number) => {
        setCompletedSteps((prev) => {
            const next = new Set(prev);
            if (next.has(stepNumber)) next.delete(stepNumber);
            else next.add(stepNumber);
            return next;
        });
    };

    const handleAddToShoppingList = () => {
        onAddToShoppingList?.(recipeId);
        setAddedToList(true);
        setTimeout(() => setAddedToList(false), 3000);
    };

    if (error) {
        return (
            <div className="p-6 bg-red-900/30 border border-red-500/30 rounded-2xl text-red-300">
                <span className="text-lg font-semibold">⚠️ Fehler</span>
                <p className="mt-1 text-sm">{error}</p>
                {onBack && (
                    <button onClick={onBack} className="mt-3 text-sm text-amber-400 hover:underline">
                        ← Zurück zur Übersicht
                    </button>
                )}
            </div>
        );
    }

    if (loading || !recipe) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-800/40 rounded-xl w-1/3" />
                <div className="h-4 bg-gray-800/40 rounded-lg w-2/3" />
                <div className="h-64 bg-gray-800/40 rounded-2xl" />
            </div>
        );
    }

    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
    const stepsProgress = recipe.steps.length > 0
        ? Math.round((completedSteps.size / recipe.steps.length) * 100)
        : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Zurück zur Übersicht
                </button>
            )}

            {/* Header */}
            <div className="p-6 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-lg shadow-black/20">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-amber-500/15 text-amber-400 mb-3">
                    {recipe.category}
                </span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    {recipe.title}
                </h1>
                <p className="text-gray-400 mt-2">{recipe.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Gesamtzeit</div>
                            <div className="font-medium text-gray-300">{totalTime} Min</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Portionen</div>
                            <div className="font-medium text-gray-300">{recipe.servings}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Vorbereitung</div>
                            <div className="font-medium text-gray-300">{recipe.prepTimeMinutes} Min</div>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {recipe.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-700/60 text-gray-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Two Column Layout: Ingredients + Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Ingredients */}
                <div className="lg:col-span-2 p-5 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-lg shadow-black/20">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-100">🧂 Zutaten</h2>
                        <span className="text-xs text-gray-500">
                            {checkedIngredients.size}/{recipe.ingredients.length}
                        </span>
                    </div>

                    <ul className="space-y-2">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx}>
                                <label
                                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200
                    ${checkedIngredients.has(idx)
                                            ? "bg-emerald-500/10 border border-emerald-500/20"
                                            : "hover:bg-gray-700/40 border border-transparent"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checkedIngredients.has(idx)}
                                        onChange={() => toggleIngredient(idx)}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800
                               text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0
                               transition-all duration-200 cursor-pointer accent-emerald-500"
                                    />
                                    <span
                                        className={`flex-1 text-sm transition-all duration-200 ${checkedIngredients.has(idx)
                                            ? "line-through text-gray-500"
                                            : "text-gray-300"
                                            }`}
                                    >
                                        <span className="font-medium text-gray-200">
                                            {ing.amount} {ing.unit}
                                        </span>{" "}
                                        {ing.name}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>

                    {/* Add to Shopping List Button */}
                    <button
                        onClick={handleAddToShoppingList}
                        disabled={addedToList}
                        className={`w-full mt-5 py-3 rounded-xl font-medium text-sm transition-all duration-300
              ${addedToList
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
                            }`}
                    >
                        {addedToList ? "✓ Zur Einkaufsliste hinzugefügt!" : "🛒 Zur Einkaufsliste hinzufügen"}
                    </button>
                </div>

                {/* Steps */}
                <div className="lg:col-span-3 p-5 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-lg shadow-black/20">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-100">👨‍🍳 Zubereitung</h2>
                        <span className="text-xs text-gray-500">
                            Schritt {completedSteps.size} von {recipe.steps.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-700/50 rounded-full mb-5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${stepsProgress}%` }}
                        />
                    </div>

                    <ol className="space-y-3">
                        {recipe.steps.map((step) => (
                            <li key={step.stepNumber}>
                                <button
                                    onClick={() => toggleStep(step.stepNumber)}
                                    className={`w-full text-left flex gap-4 p-4 rounded-xl transition-all duration-300
                    ${completedSteps.has(step.stepNumber)
                                            ? "bg-emerald-500/10 border border-emerald-500/20"
                                            : "bg-gray-700/30 border border-gray-700/20 hover:bg-gray-700/50"
                                        }`}
                                >
                                    {/* Step Number */}
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                      ${completedSteps.has(step.stepNumber)
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-700 text-gray-400"
                                            }`}
                                    >
                                        {completedSteps.has(step.stepNumber) ? "✓" : step.stepNumber}
                                    </div>

                                    {/* Step Content */}
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm transition-all duration-200 ${completedSteps.has(step.stepNumber)
                                                ? "text-gray-500 line-through"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            {step.instruction}
                                        </p>
                                        {step.durationMinutes && (
                                            <span className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                ca. {step.durationMinutes} Min
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ol>

                    {/* Completion Message */}
                    {stepsProgress === 100 && (
                        <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center animate-scale-in">
                            <span className="text-2xl">🎉</span>
                            <p className="text-emerald-400 font-medium mt-1">
                                Fertig! Guten Appetit!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
