import MealPlanCalendar from "@/components/mealplan/MealPlanCalendar";

export const metadata = {
  title: "Essensplan | Family Hub",
};

export default function MealPlanPage() {
  return (
    <main className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
          Essensplan
        </h1>
        <p className="text-sm text-gray-400">
          Eine Wochenübersicht über alle geplanten Mahlzeiten.
        </p>
      </header>

      <section className="bg-gray-900/40 rounded-3xl border border-gray-800/70 p-4 md:p-6 shadow-xl shadow-black/30">
        <MealPlanCalendar />
      </section>
    </main>
  );
}

