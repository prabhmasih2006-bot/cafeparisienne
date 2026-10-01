import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShoppingBag, Clock } from "lucide-react";
import { drinks, foods, type MenuItem } from "@/lib/naji-data";
import icedLatteImage from "@/assets/drink-iced-latte.jpg";
import { Reveal } from "@/components/motion";
import { OrderAndTrackingSection } from "@/components/order-system";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu | Cafe Parisienne" },
      {
        name: "description",
        content:
          "Explore the complete menu at Cafe Parisienne on Lavender Hill, London. Specialty coffees, signature espresso drinks, ceremonial matcha, and fresh artisanal bakery bites.",
      },
      { property: "og:title", content: "Menu | Cafe Parisienne" },
      {
        property: "og:description",
        content:
          "Specialty coffees, signature drinks, ceremonial matcha, and fresh food at Cafe Parisienne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <article className="group relative -mx-4 px-4 py-5 sm:py-6 rounded-2xl border-b border-[#e8e4de] hover:border-transparent hover:bg-white hover:shadow-[0_14px_34px_-12px_rgba(26,21,16,0.1)] transition-all duration-300 flex items-start justify-between gap-4">
      <div className="space-y-1.5 max-w-lg">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-serif text-xl sm:text-2xl text-[#1a1510] group-hover:text-sand-dark transition-colors duration-300">
            {item.name}
          </h3>
          {item.tag && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sand/25 text-[#1a1510] border border-sand/40">
              <Sparkles className="w-2.5 h-2.5 text-sand-dark" />
              {item.tag}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#78716c] leading-relaxed">
          {item.description}
        </p>
      </div>
      <span className="font-semibold text-base sm:text-lg text-[#1a1510] shrink-0 px-3 py-1 rounded-full bg-transparent group-hover:bg-sand/25 transition-colors duration-300">
        {item.price}
      </span>
    </article>
  );
}

function MenuPage() {
  const coffee = drinks.filter((d) => d.group === "Coffee");
  const signature = drinks.filter((d) => d.group === "Signature");
  const matcha = drinks.filter((d) => d.group === "Matcha & Tea");

  const categories = [
    { id: "coffee-espresso", label: "Coffee & Espresso" },
    { id: "signature-drinks", label: "Signature Drinks" },
    { id: "matcha-teas", label: "Matcha & Teas" },
    { id: "food-bakery", label: "Food & Bakery" },
  ];

  return (
    <div className="bg-[#faf9f6] text-[#1c1814] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#0e0d0b] text-white pt-32 pb-20 sm:pt-40 sm:pb-26 border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/3 w-[440px] h-[440px] rounded-full bg-sand/[0.07] blur-[130px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Reveal delay={50} direction="up">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-sand/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                <p className="text-xs font-semibold tracking-[0.22em] text-sand uppercase">
                  Crafted With Care
                </p>
              </div>
            </Reveal>
            <Reveal delay={130} direction="up">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-none">
                Our Full Menu
              </h1>
            </Reveal>
            <Reveal delay={210} direction="up">
              <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl font-sans">
                From our single-origin espresso extractions and velvety microfoam lattes to organic
                ceremonial matcha and daily-baked pastries, every offering is thoughtfully made.
              </p>
            </Reveal>

            {/* Quick Category Jump Pills */}
            <Reveal delay={290} direction="up">
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="btn-outline-dark text-xs px-4 py-2"
                  >
                    {cat.label}
                  </a>
                ))}
                <a
                  href="#order-and-track-section"
                  className="btn-premium text-xs px-5 py-2 inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order &amp; Track / Cancel</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Main Menu Layout */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky Left Visual / Quick Info */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8">
            <Reveal direction="right">
              <div className="card-luxury rounded-3xl overflow-hidden bg-white border border-[#e8e4de] p-3.5 shadow-sm">
                <div className="image-showcase rounded-2xl overflow-hidden">
                  <img
                    src={icedLatteImage}
                    alt="Chilled specialty iced latte on rustic wooden table"
                    width={800}
                    height={600}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <div className="p-4 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-dark">
                    House Specialty
                  </p>
                  <h4 className="font-serif text-2xl font-normal text-[#1a1510] mt-1">
                    Single-Origin Roast
                  </h4>
                  <p className="text-xs sm:text-sm text-[#78716c] mt-2 leading-relaxed">
                    Beans roasted weekly and dialed in every morning for peak flavor extraction.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} direction="right">
              <div className="card-luxury bg-white rounded-3xl border border-[#e8e4de] p-7 space-y-4 shadow-sm">
                <h4 className="font-serif text-xl text-[#1a1510]">Dietary Options</h4>
                <p className="text-xs sm:text-sm text-[#78716c] leading-relaxed">
                  Oat milk, almond milk, and decaf espresso available for all coffee beverages upon
                  request.
                </p>
                <div className="pt-2">
                  <Link
                    to="/visit"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-sand-dark hover:text-[#1a1510] transition-colors group"
                  >
                    <span>Visit Our Café</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </aside>

          {/* Right Menu Columns */}
          <div className="lg:col-span-8 space-y-18">
            {/* Coffee & Espresso */}
            <Reveal direction="up">
              <div id="coffee-espresso" className="scroll-mt-28">
                <div className="flex items-baseline justify-between border-b-2 border-[#1a1510] pb-3.5 mb-3">
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1510]">
                    Coffee & Espresso
                  </h2>
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand-dark">
                    Classics
                  </span>
                </div>
                <div className="space-y-1">
                  {coffee.map((item) => (
                    <MenuItemRow key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Signature Creations */}
            <Reveal direction="up">
              <div id="signature-drinks" className="scroll-mt-28">
                <div className="flex items-baseline justify-between border-b-2 border-[#1a1510] pb-3.5 mb-3">
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1510]">
                    Signature Drinks
                  </h2>
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand-dark">
                    Handcrafted
                  </span>
                </div>
                <div className="space-y-1">
                  {signature.map((item) => (
                    <MenuItemRow key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Matcha & Botanical Teas */}
            <Reveal direction="up">
              <div id="matcha-teas" className="scroll-mt-28">
                <div className="flex items-baseline justify-between border-b-2 border-[#1a1510] pb-3.5 mb-3">
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1510]">
                    Matcha & Teas
                  </h2>
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand-dark">
                    Uji Ceremonial
                  </span>
                </div>
                <div className="space-y-1">
                  {matcha.map((item) => (
                    <MenuItemRow key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Fresh Food & Bakery */}
            <Reveal direction="up">
              <div id="food-bakery" className="scroll-mt-28">
                <div className="flex items-baseline justify-between border-b-2 border-[#1a1510] pb-3.5 mb-3">
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1510]">
                    Food & Bakery
                  </h2>
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand-dark">
                    Fresh Daily
                  </span>
                </div>
                <div className="space-y-1">
                  {foods.map((item) => (
                    <MenuItemRow key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Order Online & Track / Cancel Order Section */}
        <div className="mt-20">
          <Reveal direction="up">
            <OrderAndTrackingSection />
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0e0d0b] text-white py-20 border-t border-white/10 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-96 bg-sand/[0.04] blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl text-white">
                  Ready to stop by for a cup?
                </h3>
                <p className="text-sm sm:text-base text-white/70 mt-1.5">
                  Join us dine-in or take your favorite brew with you.
                </p>
              </div>
              <Link
                to="/visit"
                className="btn-premium px-8 py-4 text-sm shrink-0 group"
              >
                <span>Find Our Location</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}