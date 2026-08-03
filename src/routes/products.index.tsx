import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CategoryHero } from "@/components/site/CategoryHero";
import { useCategories, FALLBACK_CATEGORY_IMAGE } from "@/data/live-catalog";
import { LoadingBlock, EmptyBlock } from "@/components/site/DataState";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "IT Products — Laptops, Servers, Networking & Surveillance | Evertech" },
      { name: "description", content: "Genuine enterprise IT hardware from Dell, HP, Lenovo, Cisco, Fortinet, UNV and more. Browse our six product categories and request a tailored quotation." },
      { property: "og:title", content: "IT Products Catalog — Evertech Corporation" },
      { property: "og:description", content: "Six categories of enterprise IT hardware with featured models, brands and use cases." },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const { data: productCategories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <PageShell>
        <LoadingBlock label="Loading product catalog…" />
      </PageShell>
    );
  }

  if (!productCategories || productCategories.length === 0) {
    return (
      <PageShell>
        <EmptyBlock
          title="No product categories yet"
          message="Our product catalog is being updated. Please check back shortly or contact us for a tailored quotation."
          actionTo="/"
          actionLabel="Back to home"
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <CategoryHero
        eyebrow="Product Catalog"
        title="Enterprise IT hardware, sourced and supported."
        tagline="Six product lines covering the full corporate IT estate — every category configured to workload, supplied with official warranty and after-sales support."
        image={productCategories[0]?.image ?? FALLBACK_CATEGORY_IMAGE}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }]}
      />

      <section className="bg-[var(--surface)] py-20 md:py-28">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((c) => (
              <Link
                key={c.slug}
                to="/products/$category"
                params={{ category: c.slug }}
                className="group flex flex-col bg-white border border-border hover:border-[var(--steel)] transition-colors"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[var(--navy-deep)]">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center">
                        <c.icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-[var(--navy-deep)]">{c.name}</h2>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[var(--steel)] transition-colors" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.brands.slice(0, 4).map((b) => (
                      <span key={b} className="text-[10px] uppercase tracking-wider font-semibold text-[var(--navy-deep)]/70 bg-[var(--navy-deep)]/5 px-2 py-1">{b}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}