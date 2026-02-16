export interface MealPlan {
  id: string;
  date: string; // YYYY-MM-DD
  weekStart?: string; // YYYY-MM-DD (for weekly plans)
  days?: MealPlanDay[]; // for weekly plans
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

export interface MealSlot {
  type: MealType;
  recipeId?: string;
  recipeTitle?: string;
}

export interface MealPlanDay {
  date: string;
  slots: MealSlot[];
}

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
export type MealSlotType = MealType;
