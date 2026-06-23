import { categories } from "./home-data";
import { SectionHeading } from "./section-heading";

export function CategoryGrid() {
  return (
    <section className="space-y-4">
      <SectionHeading title="Categories" action="Browse by section" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ name, icon: Icon, active, tone }) => (
          <button
            key={name}
            type="button"
            className={`flex h-24 w-full items-center justify-center rounded-2xl border transition-transform duration-200 hover:-translate-y-0.5 ${
              active ? "border-[#ead9c7] shadow-[0_10px_24px_rgba(0,0,0,0.04)]" : "border-transparent"
            } ${tone}`}
            aria-label={name}
          >
            <Icon className={`h-10 w-10 ${active ? "opacity-100" : "opacity-90"}`} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </section>
  );
}
