import { NextResponse } from "next/server";
import type { MealPlan, MealPlanDay } from "@/lib/contracts/food/mealplan";

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const today = new Date();
    const monday = getMonday(new Date(today));

    const days: MealPlanDay[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        date: formatDate(date),
        slots: [
          { type: "breakfast" as const, recipeId: undefined, recipeTitle: undefined },
          { type: "lunch" as const, recipeId: undefined, recipeTitle: undefined },
          { type: "dinner" as const, recipeId: undefined, recipeTitle: undefined },
          { type: "snack" as const, recipeId: undefined, recipeTitle: undefined },
        ],
      };
    });

    // Fill some slots with recipe references
    days[0].slots[0] = { type: "breakfast", recipeId: "5", recipeTitle: "Overnight Oats mit Beeren" };
    days[0].slots[2] = { type: "dinner", recipeId: "1", recipeTitle: "Spaghetti Bolognese" };

    days[1].slots[1] = { type: "lunch", recipeId: "3", recipeTitle: "Gemüsesuppe mit Einlage" };
    days[1].slots[3] = { type: "snack", recipeId: "4", recipeTitle: "Kaiserschmarrn" };

    days[2].slots[0] = { type: "breakfast", recipeId: "5", recipeTitle: "Overnight Oats mit Beeren" };
    days[2].slots[2] = { type: "dinner", recipeId: "6", recipeTitle: "Ofengemüse mit Kräuterquark" };

    days[3].slots[1] = { type: "lunch", recipeId: "2", recipeTitle: "Kartoffelpuffer mit Apfelmus" };

    days[4].slots[2] = { type: "dinner", recipeId: "1", recipeTitle: "Spaghetti Bolognese" };

    days[5].slots[0] = { type: "breakfast", recipeId: "5", recipeTitle: "Overnight Oats mit Beeren" };
    days[5].slots[1] = { type: "lunch", recipeId: "6", recipeTitle: "Ofengemüse mit Kräuterquark" };
    days[5].slots[2] = { type: "dinner", recipeId: "2", recipeTitle: "Kartoffelpuffer mit Apfelmus" };

    days[6].slots[1] = { type: "lunch", recipeId: "3", recipeTitle: "Gemüsesuppe mit Einlage" };
    days[6].slots[3] = { type: "snack", recipeId: "4", recipeTitle: "Kaiserschmarrn" };

    const mockMealPlan: MealPlan = {
      weekStart: formatDate(monday),
      days,
    };

    return NextResponse.json(mockMealPlan);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}
