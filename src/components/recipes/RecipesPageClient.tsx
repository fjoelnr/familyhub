"use client";

import { useState } from "react";
import RecipeList from "@/components/recipes/RecipeList";
import RecipeDetail from "@/components/recipes/RecipeDetail";

export default function RecipesPageClient() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Rezepte
        </h1>
        <p className="text-sm text-gray-400">
          Finde passende Gerichte und koche Schritt für Schritt mit.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2 bg-gray-900/40 rounded-3xl border border-gray-800/70 p-4 md:p-5 shadow-xl shadow-black/30">
          <RecipeList onSelectRecipe={(id) => setSelectedRecipeId(id)} />
        </section>

        <section className="lg:col-span-3 bg-gray-900/40 rounded-3xl border border-gray-800/70 p-4 md:p-5 shadow-xl shadow-black/30">
          {selectedRecipeId ? (
            <RecipeDetail
              recipeId={selectedRecipeId}
              onBack={() => setSelectedRecipeId(null)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
              <div className="text-4xl mb-1">👩‍🍳</div>
              <p className="text-sm md:text-base">
                Wähle links ein Rezept aus, um die Details zu sehen.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

