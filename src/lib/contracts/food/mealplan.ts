export interface MealPlan {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meal[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  type: MealType;
  recipeId?: string;
  recipeName?: string;
  title?: string;
  description?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanCreate {
  date: string;
  meals?: Omit<Meal, 'id'>[];
  notes?: string;
}

export interface MealUpdate {
  date?: string;
  meals?: Meal[];
  notes?: string;
}

export type MealPlanResponse = MealPlan;
