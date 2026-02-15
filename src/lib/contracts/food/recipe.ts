export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  servings?: number;
  category?: string; // breakfast, lunch, dinner, dessert, snack
  tags?: string[];
  sourceUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string; // g, ml, tbsp, tsp, piece, etc.
  optional?: boolean;
}

export interface RecipeCreate {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags?: string[];
  sourceUrl?: string;
  imageUrl?: string;
}

export type RecipeResponse = Recipe;
