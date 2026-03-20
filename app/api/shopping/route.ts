import { NextResponse } from "next/server";
import type { ShoppingCategory } from "@/lib/contracts/food/shopping";

const mockShoppingList: ShoppingCategory[] = [
  {
    category: "Gemüse",
    items: [
      { id: "s1", name: "Zwiebeln", amount: 3, unit: "Stück", category: "Gemüse", checked: false },
      { id: "s2", name: "Möhren", amount: 500, unit: "g", category: "Gemüse", checked: false },
      { id: "s3", name: "Paprika (rot)", amount: 2, unit: "Stück", category: "Gemüse", checked: true },
      { id: "s4", name: "Kartoffeln", amount: 1, unit: "kg", category: "Gemüse", checked: false },
      { id: "s5", name: "Kirschtomaten", amount: 200, unit: "g", category: "Gemüse", checked: false },
    ],
  },
  {
    category: "Fleisch",
    items: [
      { id: "s6", name: "Hackfleisch (gemischt)", amount: 400, unit: "g", category: "Fleisch", checked: false },
    ],
  },
  {
    category: "Milchprodukte",
    items: [
      { id: "s7", name: "Parmesan", amount: 50, unit: "g", category: "Milchprodukte", checked: false },
      { id: "s8", name: "Butter", amount: 250, unit: "g", category: "Milchprodukte", checked: true },
      { id: "s9", name: "Joghurt", amount: 500, unit: "g", category: "Milchprodukte", checked: false },
      { id: "s10", name: "Quark", amount: 250, unit: "g", category: "Milchprodukte", checked: false },
    ],
  },
  {
    category: "Nudeln & Reis",
    items: [
      { id: "s11", name: "Spaghetti", amount: 500, unit: "g", category: "Nudeln & Reis", checked: false },
      { id: "s12", name: "Suppennudeln", amount: 250, unit: "g", category: "Nudeln & Reis", checked: false },
    ],
  },
  {
    category: "Konserven",
    items: [
      { id: "s13", name: "Passierte Tomaten", amount: 500, unit: "ml", category: "Konserven", checked: false },
      { id: "s14", name: "Tomatenmark", amount: 1, unit: "Tube", category: "Konserven", checked: true },
      { id: "s15", name: "Gemüsebrühe", amount: 1, unit: "Packung", category: "Konserven", checked: false },
    ],
  },
  {
    category: "Obst",
    items: [
      { id: "s16", name: "Äpfel", amount: 4, unit: "Stück", category: "Obst", checked: false },
      { id: "s17", name: "Gemischte Beeren", amount: 300, unit: "g", category: "Obst", checked: false },
    ],
  },
  {
    category: "Backzutaten",
    items: [
      { id: "s18", name: "Mehl", amount: 1, unit: "kg", category: "Backzutaten", checked: true },
      { id: "s19", name: "Haferflocken", amount: 500, unit: "g", category: "Backzutaten", checked: false },
      { id: "s20", name: "Honig", amount: 1, unit: "Glas", category: "Backzutaten", checked: false },
    ],
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockShoppingList);
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping list" },
      { status: 500 }
    );
  }
}
