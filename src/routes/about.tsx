import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Croissant, Flame, Leaf, Sparkles, Utensils } from "lucide-react";
import sandwichFrenchToastImage from "@/assets/sandwich-french-toast.jpg";
import foodCroissantBrunchImage from "@/assets/food-croissant-brunch.jpg";
import foodAvocadoToastImage from "@/assets/food-avocado-toast.jpg";
import foodBasqueCheesecakeImage from "@/assets/food-basque-cheesecake.jpg";
import najiFoodImage from "@/assets/naji-food.jpg";
import { Reveal } from "@/components/motion";
import { foods } from "@/lib/naji-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Our Food & Kitchen | Cafe Parisienne" },
      {
        name: "description",
        content:
          "Discover the food, all-day brunch plates, artisan sourdough toasts, and freshly baked Parisian pastries at Cafe Parisienne on Lavender Hill, London.",
      },
      { property: "og:title", content: "About Our Food & Kitchen | Cafe Parisienne" },
      {
        property: "og:description",
        content:
          "Explore our signature food options — from flaky French croissants and avocado poached egg sourdough to caramelized Basque burnt cheesecake.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const featuredFoodShowcase = [
  {
    title: "Avocado & Poached Eggs Sourdough",
    category: "All-Day Brunch",
    price: "£9.50",
    description:
      "Crushed Hass avocado, two runny free-range poached eggs, cherry tomatoes, microgreens, and chili flakes on thick-cut grilled sourdough.",
    image: foodAvocadoToastImage,
    badge: "Chef's Favourite",
  },
  {
    title: "Parisian Butter Croissant & Viennoiserie",
    category: "Morning Bakery",
    price: "£4.75",
    description:
      "Hand-laminated daily with French cultured butter — golden, crisp, and honeycombed inside, served warm with berry compote or almond frangipane.",
    image: foodCroissantBrunchImage,
    badge: "Baked Fresh Daily",
  },
  {
    title: "Brioche French Toast & Artisan Sandwiches",
    category: "Sweet & Savoury Plates",
    price: "£8.95",
    description:
      "Caramelized thick-cut brioche topped with seasonal berries, whipped mascarpone, and pure maple, alongside our toasted gourmet club sandwiches.",
    image: sandwichFrenchToastImage,
    badge: "Signature Plate",
  },
  {
    title: "Basque Burnt Cheesecake",
    category: "Patisserie Counter",
    price: "£6.50",
    description:
      "Deeply caramelized crust with an ultra-creamy, velvety center, finished with fresh raspberries, blackberries, and a dusting of icing sugar.",
    image: foodBasqueCheesecakeImage,
    badge: "House Special",
  },
];

const additionalKitchenOptions = [
  ...foods,
  {
    name: "Eggs Florentine Brioche",
    price: "£10.50",
    description:
      "Two poached free-range eggs, buttered baby spinach, and warm citrus hollandaise over toasted Parisian brioche.",
    group: "Food & Bakery" as const,
    tag: "Brunch Special",
  },
  {
    name: "Truffle Mushroom Melt Sourdough",
    price: "£9.25",
    description:
      "Roasted wild mushrooms, aged Gruyère cheese, thyme butter, and black truffle oil pressed on artisan sourdough.",
    group: "Food & Bakery" as const,
    tag: "Hot Kitchen",
  },
];

function AboutPage() {
  return (
    <div className="bg-[#faf9f6] text-[#1c1814] min-h-screen">
      {/* Header Banner */}
      <section className="relative bg-[#0e0d0b] text-white pt-32 pb-24 sm:pt-40 sm:pb-32 border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-1/4 w-[420px] h-[420px] rounded-full bg-sand/[0.07] blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Reveal delay={50} direction="up">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-sand/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                <p className="text-xs font-semibold tracking-[0.22em] text-sand uppercase">
                  Cafe Parisienne · Kitchen & Patisserie
                </p>
              </div>
            </Reveal>
            <Reveal delay={130} direction="up">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-[1.06] cursor-pointer">
                Crafted Food, Brunch{" "}
                <span className="italic font-light text-sand">&amp; Parisian Pastries.</span>
              </h1>
            </Reveal>
            <Reveal delay={210} direction="up">
              <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl font-sans">
                From golden all-butter croissants out of the morning oven to hearty sourdough brunch
                plates and melt-in-your-mouth patisserie — explore the food options prepared fresh
                every day in our Lavender Hill kitchen.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Attractive Food Photo Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featuredFoodShowcase.map((item, idx) => (
            <Reveal
              key={item.title}
              delay={100 + idx * 70}
              direction="up"
              className="md:col-span-6"
            >
              <div className="image-showcase group relative rounded-3xl overflow-hidden shadow-[0_24px_50px_-14px_rgba(0,0,0,0.28)] border border-white/20 h-80 sm:h-96 lg:h-[420px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#0e0d0b]/80 backdrop-blur-md border border-sand/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
                    {item.badge}
                  </span>
                  <span className="rounded-full bg-white/95 text-[#1a1510] px-3.5 py-1.5 text-sm font-serif font-semibold shadow-md">
                    {item.price}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand mb-1.5">
                    {item.category}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white leading-snug">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Complete Food Options Menu Showcase */}
      <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <Reveal direction="up">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-sand-dark uppercase">
                <span className="w-6 h-[1px] bg-sand-dark" />
                <span>Our Kitchen Offerings</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1510] tracking-tight mt-3 leading-[1.12] cursor-pointer">
                Signature Food &amp; Bakery Options
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100} direction="up">
            <p className="text-[#57534e] text-sm sm:text-base max-w-md leading-relaxed">
              Every plate is made to order using seasonal British produce, organic free-range eggs,
              and artisan sourdough &amp; brioche baked fresh each morning.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalKitchenOptions.map((item, index) => (
            <Reveal key={item.name} delay={60 + index * 50} direction="up">
              <div className="card-luxury group rounded-3xl border border-[#e8e4de] bg-white p-6 sm:p-7 flex flex-col justify-between gap-4 hover:border-sand/60 transition-all duration-300 h-full">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-serif text-xl sm:text-2xl text-[#1a1510] group-hover:text-sand-dark transition-colors">
                        {item.name}
                      </h3>
                      {item.tag && (
                        <span className="rounded-full bg-sand/20 border border-sand/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#1a1510]">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <span className="font-serif text-xl font-semibold text-[#1a1510] shrink-0 bg-[#faf9f6] border border-[#e8e4de] px-3.5 py-1 rounded-full">
                      {item.price}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#57534e] leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-3 border-t border-[#f0ece6] flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-sand-dark">
                  <span>Freshly Prepared in Kitchen</span>
                  <span className="inline-flex items-center gap-1 text-[#1a1510] group-hover:translate-x-1 transition-transform">
                    Available Daily
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Highlight Banner with Food Spread */}
        <Reveal delay={180} direction="up">
          <div className="mt-14 rounded-3xl overflow-hidden border border-[#e8e4de] bg-[#14110e] text-white grid grid-cols-1 lg:grid-cols-12 shadow-[0_24px_50px_-14px_rgba(0,0,0,0.22)]">
            <div className="lg:col-span-5 h-72 lg:h-auto relative overflow-hidden">
              <img
                src={najiFoodImage}
                alt="Freshly plated café brunch and artisan bakery spread"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-sand uppercase">
                <Flame className="w-4 h-4 text-sand" />
                <span>All-Day Brunch &amp; Bakery Table</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                Wholesome plates made from scratch, served from 6:30 am.
              </h3>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                Whether you are stopping in for a warm almond croissant on your morning walk,
                sharing a plate of smashed avocado sourdough with friends, or treating yourself to a
                slice of Basque burnt cheesecake, our kitchen crafts every bite with care.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/menu" className="btn-premium px-6 py-3 text-xs sm:text-sm group">
                  <span>View Complete Menu</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4 Culinary Pillars */}
      <section className="bg-gradient-to-b from-[#faf7f2] via-[#f3ede2] to-[#faf7f2] border-y border-[#e2d6c3] py-20 lg:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-[#d4b58e]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#c89b6e]/15 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1612] text-[#f3cfa0] text-[11px] font-semibold uppercase tracking-[0.24em] shadow-sm">
                ✦ Our Culinary Standards ✦
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1b140e] mt-4 cursor-pointer">
                What makes our food{" "}
                <span className="italic font-light text-[#a86428] underline decoration-[#d4b58e]/60 decoration-1 underline-offset-8">
                  extraordinary
                </span>
              </h3>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {/* 1. French Viennoiserie */}
            <Reveal delay={60} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#1b1510] via-[#241c15] to-[#140f0c] border border-[#d4b58e]/30 hover:border-[#f5c27c]/70 shadow-[0_18px_40px_-15px_rgba(27,21,16,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#f5c27c]/10 blur-2xl group-hover:bg-[#f5c27c]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5c27c]/25 to-[#b87d3e]/10 border border-[#f5c27c]/40 flex items-center justify-center text-[#f7c987] transition-all duration-300 group-hover:bg-[#f5c27c] group-hover:text-[#1b1510] group-hover:scale-110 group-hover:rotate-3 shadow-[0_8px_20px_-4px_rgba(245,194,124,0.35)]">
                      <Croissant className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5c27c] bg-[#f5c27c]/10 border border-[#f5c27c]/30 px-3 py-1 rounded-full">
                      01 · Bakery
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-semibold tracking-wide text-[#ffdfa8] group-hover:text-white transition-colors">
                    French{" "}
                    <span className="italic font-normal text-[#f5b865]">Viennoiserie</span>
                  </h4>
                  <p className="mt-3 text-sm font-sans text-[#dfd3c3] leading-relaxed">
                    All-butter croissants, pain au chocolat, and brioche baked fresh each morning for
                    irresistible flaky layers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#f5c27c]">
                  <span>✦ French Butter Layers</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>

            {/* 2. Made-to-Order Brunch */}
            <Reveal delay={140} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#132019] via-[#1a2b22] to-[#0f1914] border border-[#6ee7b7]/25 hover:border-[#6ee7b7]/65 shadow-[0_18px_40px_-15px_rgba(19,32,25,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#6ee7b7]/10 blur-2xl group-hover:bg-[#6ee7b7]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6ee7b7]/25 to-[#10b981]/10 border border-[#6ee7b7]/40 flex items-center justify-center text-[#86efac] transition-all duration-300 group-hover:bg-[#6ee7b7] group-hover:text-[#0f1914] group-hover:scale-110 group-hover:-rotate-3 shadow-[0_8px_20px_-4px_rgba(110,231,183,0.3)]">
                      <Utensils className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#86efac] bg-[#6ee7b7]/10 border border-[#6ee7b7]/30 px-3 py-1 rounded-full">
                      02 · Kitchen
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-semibold tracking-wide text-[#d9fbe5] group-hover:text-white transition-colors">
                    Made-to-Order{" "}
                    <span className="italic font-normal text-[#7ce8a6]">Brunch</span>
                  </h4>
                  <p className="mt-3 text-sm font-sans text-[#cfe3d6] leading-relaxed">
                    Wild-yeast artisan sourdough toasts, poached free-range eggs, and warm savoury
                    melts plated fresh to order.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#86efac]">
                  <span>✦ Cooked to Order</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>

            {/* 3. Seasonal Produce */}
            <Reveal delay={220} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#231413] via-[#2d1a18] to-[#180d0c] border border-[#fda4af]/25 hover:border-[#fda4af]/65 shadow-[0_18px_40px_-15px_rgba(35,20,19,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#fda4af]/10 blur-2xl group-hover:bg-[#fda4af]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fda4af]/25 to-[#f43f5e]/10 border border-[#fda4af]/40 flex items-center justify-center text-[#fecdd3] transition-all duration-300 group-hover:bg-[#fda4af] group-hover:text-[#231413] group-hover:scale-110 group-hover:rotate-3 shadow-[0_8px_20px_-4px_rgba(253,164,175,0.3)]">
                      <Leaf className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#fecdd3] bg-[#fda4af]/10 border border-[#fda4af]/30 px-3 py-1 rounded-full">
                      03 · Organic
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-semibold tracking-wide text-[#ffe4e8] group-hover:text-white transition-colors">
                    Seasonal{" "}
                    <span className="italic font-normal text-[#ff9ebb]">Produce</span>
                  </h4>
                  <p className="mt-3 text-sm font-sans text-[#e5cfd2] leading-relaxed">
                    Ripe Hass avocados, heirloom tomatoes, organic berries, and cold-pressed extra
                    virgin olive oil.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#fecdd3]">
                  <span>✦ British Farm Fresh</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>

            {/* 4. Artisan Patisserie */}
            <Reveal delay={300} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#1f1910] via-[#2a2115] to-[#15110a] border border-[#fde047]/25 hover:border-[#fde047]/65 shadow-[0_18px_40px_-15px_rgba(31,25,16,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#fde047]/10 blur-2xl group-hover:bg-[#fde047]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fde047]/25 to-[#eab308]/10 border border-[#fde047]/40 flex items-center justify-center text-[#fef08a] transition-all duration-300 group-hover:bg-[#fde047] group-hover:text-[#1f1910] group-hover:scale-110 group-hover:-rotate-3 shadow-[0_8px_20px_-4px_rgba(253,224,71,0.3)]">
                      <Sparkles className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#fef08a] bg-[#fde047]/10 border border-[#fde047]/30 px-3 py-1 rounded-full">
                      04 · Patisserie
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-semibold tracking-wide text-[#fff7cc] group-hover:text-white transition-colors">
                    Artisan{" "}
                    <span className="italic font-normal text-[#facc15]">Patisserie</span>
                  </h4>
                  <p className="mt-3 text-sm font-sans text-[#e6dec8] leading-relaxed">
                    Small-batch cakes, citrus loaves, and our signature Basque burnt cheesecake
                    crafted in-house daily.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#fef08a]">
                  <span>✦ Handcrafted Daily</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0e0d0b] text-white py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-96 bg-sand/[0.04] blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl text-white">
                  Ready to taste our kitchen favourites?
                </h3>
                <p className="text-sm sm:text-base text-white/70 mt-1.5">
                  Join us at 225 Lavender Hill for fresh pastries, sourdough toasts, and all-day
                  brunch.
                </p>
              </div>
              <Link to="/visit" className="btn-premium px-8 py-4 text-sm shrink-0 group">
                <span>Visit Us</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}