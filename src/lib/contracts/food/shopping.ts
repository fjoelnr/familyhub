export interface ShoppingItem {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  category?: string; // produce, dairy, meat, pantry, frozen, etc.
  checked: boolean;
  recipeId?: string; // optional link to recipe
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingCreate {
  name: string;
  items?: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>[];
}

export interface ShoppingItemCreate {
  name: string;
  amount?: number;
  unit?: string;
  category?: string;
  recipeId?: string;
}
