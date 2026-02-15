import { NextResponse } from "next/server";
import type { Recipe } from "@/lib/contracts/food/recipe";

const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Spaghetti Bolognese",
    description:
      "Klassische Bolognese mit frischen Tomaten und Hackfleisch — ein Familienklassiker.",
    category: "Hauptgericht",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    ingredients: [
      { name: "Spaghetti", amount: 500, unit: "g", category: "Nudeln & Reis" },
      { name: "Hackfleisch (gemischt)", amount: 400, unit: "g", category: "Fleisch" },
      { name: "Zwiebel", amount: 2, unit: "Stück", category: "Gemüse" },
      { name: "Knoblauch", amount: 3, unit: "Zehen", category: "Gemüse" },
      { name: "Passierte Tomaten", amount: 500, unit: "ml", category: "Konserven" },
      { name: "Tomatenmark", amount: 2, unit: "EL", category: "Konserven" },
      { name: "Olivenöl", amount: 3, unit: "EL", category: "Öle & Gewürze" },
      { name: "Salz", amount: 1, unit: "TL", category: "Öle & Gewürze" },
      { name: "Pfeffer", amount: 1, unit: "Prise", category: "Öle & Gewürze" },
      { name: "Parmesan", amount: 50, unit: "g", category: "Milchprodukte" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Zwiebeln und Knoblauch fein würfeln.", durationMinutes: 5 },
      { stepNumber: 2, instruction: "Olivenöl erhitzen und Zwiebeln glasig dünsten.", durationMinutes: 3 },
      { stepNumber: 3, instruction: "Hackfleisch hinzufügen und krümelig anbraten.", durationMinutes: 8 },
      { stepNumber: 4, instruction: "Knoblauch und Tomatenmark kurz mitrösten.", durationMinutes: 2 },
      { stepNumber: 5, instruction: "Passierte Tomaten dazugeben, mit Salz und Pfeffer würzen. 30 Min köcheln lassen.", durationMinutes: 30 },
      { stepNumber: 6, instruction: "Spaghetti nach Packungsanleitung kochen, abgießen und mit der Soße servieren. Mit Parmesan bestreuen.", durationMinutes: 10 },
    ],
    tags: ["Pasta", "Klassiker", "Familienessen"],
  },
  {
    id: "2",
    title: "Kartoffelpuffer mit Apfelmus",
    description:
      "Knusprige Kartoffelpuffer, serviert mit hausgemachtem Apfelmus — perfekt für Kinder.",
    category: "Hauptgericht",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 20,
    ingredients: [
      { name: "Kartoffeln (mehligkochend)", amount: 1000, unit: "g", category: "Gemüse" },
      { name: "Zwiebel", amount: 1, unit: "Stück", category: "Gemüse" },
      { name: "Eier", amount: 2, unit: "Stück", category: "Milchprodukte" },
      { name: "Mehl", amount: 3, unit: "EL", category: "Backzutaten" },
      { name: "Salz", amount: 1, unit: "TL", category: "Öle & Gewürze" },
      { name: "Sonnenblumenöl", amount: 200, unit: "ml", category: "Öle & Gewürze" },
      { name: "Äpfel", amount: 4, unit: "Stück", category: "Obst" },
      { name: "Zucker", amount: 2, unit: "EL", category: "Backzutaten" },
      { name: "Zimt", amount: 1, unit: "TL", category: "Öle & Gewürze" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Kartoffeln schälen und grob reiben, Zwiebel fein reiben.", durationMinutes: 10 },
      { stepNumber: 2, instruction: "Kartoffelmasse gut ausdrücken, mit Eiern, Mehl und Salz vermischen.", durationMinutes: 5 },
      { stepNumber: 3, instruction: "Öl in der Pfanne erhitzen und flache Puffer goldbraun ausbacken.", durationMinutes: 15 },
      { stepNumber: 4, instruction: "Für das Apfelmus: Äpfel schälen, kleinschneiden und mit Zucker und Zimt weich kochen. Pürieren.", durationMinutes: 15 },
    ],
    tags: ["Vegetarisch", "Kinder-Liebling", "Deutsch"],
  },
  {
    id: "3",
    title: "Gemüsesuppe mit Einlage",
    description:
      "Wärmende Gemüsesuppe mit saisonalem Gemüse und kleinen Nudeln.",
    category: "Suppe",
    servings: 6,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    ingredients: [
      { name: "Möhren", amount: 3, unit: "Stück", category: "Gemüse" },
      { name: "Kartoffeln", amount: 2, unit: "Stück", category: "Gemüse" },
      { name: "Lauch", amount: 1, unit: "Stange", category: "Gemüse" },
      { name: "Sellerie", amount: 200, unit: "g", category: "Gemüse" },
      { name: "Gemüsebrühe", amount: 1.5, unit: "L", category: "Konserven" },
      { name: "Suppennudeln", amount: 100, unit: "g", category: "Nudeln & Reis" },
      { name: "Petersilie", amount: 1, unit: "Bund", category: "Kräuter" },
      { name: "Butter", amount: 2, unit: "EL", category: "Milchprodukte" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Gemüse waschen, schälen und in kleine Würfel schneiden.", durationMinutes: 15 },
      { stepNumber: 2, instruction: "Butter in einem großen Topf erhitzen, Gemüse kurz andünsten.", durationMinutes: 5 },
      { stepNumber: 3, instruction: "Mit Gemüsebrühe ablöschen und 20 Minuten köcheln lassen.", durationMinutes: 20 },
      { stepNumber: 4, instruction: "Suppennudeln hinzugeben und noch 8 Minuten kochen. Mit Petersilie garnieren.", durationMinutes: 10 },
    ],
    tags: ["Vegetarisch", "Gesund", "Suppe"],
  },
  {
    id: "4",
    title: "Kaiserschmarrn",
    description:
      "Fluffiger Kaiserschmarrn mit Puderzucker und Pflaumenkompott.",
    category: "Dessert",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { name: "Mehl", amount: 200, unit: "g", category: "Backzutaten" },
      { name: "Milch", amount: 250, unit: "ml", category: "Milchprodukte" },
      { name: "Eier", amount: 4, unit: "Stück", category: "Milchprodukte" },
      { name: "Zucker", amount: 3, unit: "EL", category: "Backzutaten" },
      { name: "Vanillezucker", amount: 1, unit: "Päckchen", category: "Backzutaten" },
      { name: "Butter", amount: 40, unit: "g", category: "Milchprodukte" },
      { name: "Rosinen", amount: 50, unit: "g", category: "Backzutaten" },
      { name: "Puderzucker", amount: 2, unit: "EL", category: "Backzutaten" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Eier trennen. Eigelb mit Milch, Mehl und Zucker glatt rühren.", durationMinutes: 5 },
      { stepNumber: 2, instruction: "Eiweiß steif schlagen und vorsichtig unterheben.", durationMinutes: 3 },
      { stepNumber: 3, instruction: "Butter in der Pfanne schmelzen, Teig eingießen und Rosinen darüber streuen.", durationMinutes: 2 },
      { stepNumber: 4, instruction: "Bei mittlerer Hitze goldbraun backen, wenden und mit zwei Gabeln zerreißen.", durationMinutes: 8 },
      { stepNumber: 5, instruction: "Mit Puderzucker bestäuben und servieren.", durationMinutes: 1 },
    ],
    tags: ["Süß", "Österreichisch", "Dessert"],
  },
  {
    id: "5",
    title: "Overnight Oats mit Beeren",
    description:
      "Schnelles, gesundes Frühstück — am Abend vorbereitet, morgens genießen.",
    category: "Frühstück",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    ingredients: [
      { name: "Haferflocken", amount: 100, unit: "g", category: "Backzutaten" },
      { name: "Milch oder Pflanzendrink", amount: 200, unit: "ml", category: "Milchprodukte" },
      { name: "Joghurt", amount: 150, unit: "g", category: "Milchprodukte" },
      { name: "Honig", amount: 2, unit: "EL", category: "Backzutaten" },
      { name: "Chiasamen", amount: 1, unit: "EL", category: "Backzutaten" },
      { name: "Gemischte Beeren", amount: 150, unit: "g", category: "Obst" },
      { name: "Nüsse (gehackt)", amount: 30, unit: "g", category: "Backzutaten" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Haferflocken, Milch, Joghurt, Honig und Chiasamen in einem Glas verrühren.", durationMinutes: 5 },
      { stepNumber: 2, instruction: "Über Nacht im Kühlschrank ziehen lassen (mind. 4 Stunden).", durationMinutes: 1 },
      { stepNumber: 3, instruction: "Am Morgen mit frischen Beeren und gehackten Nüssen toppen.", durationMinutes: 3 },
    ],
    tags: ["Gesund", "Meal-Prep", "Schnell"],
  },
  {
    id: "6",
    title: "Ofengemüse mit Kräuterquark",
    description:
      "Buntes Ofengemüse mit selbstgemachtem Kräuterquark — leicht und lecker.",
    category: "Beilage",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    ingredients: [
      { name: "Zucchini", amount: 1, unit: "Stück", category: "Gemüse" },
      { name: "Paprika (rot)", amount: 2, unit: "Stück", category: "Gemüse" },
      { name: "Süßkartoffel", amount: 1, unit: "Stück", category: "Gemüse" },
      { name: "Rote Zwiebeln", amount: 2, unit: "Stück", category: "Gemüse" },
      { name: "Kirschtomaten", amount: 200, unit: "g", category: "Gemüse" },
      { name: "Olivenöl", amount: 4, unit: "EL", category: "Öle & Gewürze" },
      { name: "Rosmarin", amount: 2, unit: "Zweige", category: "Kräuter" },
      { name: "Thymian", amount: 2, unit: "Zweige", category: "Kräuter" },
      { name: "Quark", amount: 250, unit: "g", category: "Milchprodukte" },
      { name: "Schnittlauch", amount: 1, unit: "Bund", category: "Kräuter" },
      { name: "Dill", amount: 1, unit: "Bund", category: "Kräuter" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Ofen auf 200°C Umluft vorheizen.", durationMinutes: 1 },
      { stepNumber: 2, instruction: "Gemüse waschen und in mundgerechte Stücke schneiden.", durationMinutes: 10 },
      { stepNumber: 3, instruction: "Gemüse auf ein Backblech geben, mit Olivenöl beträufeln und Kräuter darüber verteilen.", durationMinutes: 3 },
      { stepNumber: 4, instruction: "Im Ofen 30-35 Minuten rösten, bis das Gemüse goldbraun ist.", durationMinutes: 35 },
      { stepNumber: 5, instruction: "Quark mit fein geschnittenem Schnittlauch und Dill verrühren, salzen und pfeffern.", durationMinutes: 5 },
    ],
    tags: ["Vegetarisch", "Gesund", "Einfach"],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const category = searchParams.get("category") ?? "";

    let filtered = mockRecipes;

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          r.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (category) {
      filtered = filtered.filter((r) => r.category === category);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
