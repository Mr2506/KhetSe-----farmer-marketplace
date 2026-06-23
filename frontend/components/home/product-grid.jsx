import { products } from "./home-data";
import { SectionHeading } from "./section-heading";

export function ProductGrid() {
  return (
    <section className="space-y-4 pb-8">
      <SectionHeading title="Popular items" action="See all" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map(({ name, description, price, accent, icon: Icon }) => (
          <article
            key={name}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02),0_10px_24px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:-translate-y-1"
          >
            <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${accent}`}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/45 backdrop-blur-sm">
                <Icon className="h-10 w-10 text-white drop-shadow-sm" strokeWidth={1.8} />
              </div>
            </div>
            <div className="space-y-1 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">{name}</h3>
                  <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {price}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}