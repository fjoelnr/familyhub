import RecipesPageClient from "@/components/recipes/RecipesPageClient";

export const metadata = {
  title: "Rezepte | Family Hub",
};

export default function RecipesPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 h-full">
      <RecipesPageClient />
    </div>
  );
}
