export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  steps?: RecipeStep[];
  prepTime?: number;
  cookTime?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  category?: string;
  tags?: string[];
  sourceUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category?: string;
  optional?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
}

export interface RecipeCreate {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  steps?: RecipeStep[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags?: string[];
  sourceUrl?: string;
  imageUrl?: string;
}

export interface RecipeUpdate {
  title?: string;
  description?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
  steps?: RecipeStep[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags?: string[];
  sourceUrl?: string;
  imageUrl?: string;
}
