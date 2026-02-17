import ShoppingList from "@/components/shopping/ShoppingList";

export const metadata = {
  title: "Einkaufsliste | Family Hub",
};

export default function ShoppingPage() {
  return (
    <main className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Einkaufsliste
        </h1>
        <p className="text-sm text-gray-400">
          Behalte den Überblick über alle Zutaten, die für eure Woche fehlen.
        </p>
      </header>

      <section className="bg-gray-900/40 rounded-3xl border border-gray-800/70 p-4 md:p-6 shadow-xl shadow-black/30">
        <ShoppingList />
      </section>
    </main>
  );
}

