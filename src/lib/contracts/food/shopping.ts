export interface ShoppingItem {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  category?: string;
  checked: boolean;
  recipeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingCategory {
  id?: string;
  name?: string;
  category?: string;
  items: ShoppingItem[];
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
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
