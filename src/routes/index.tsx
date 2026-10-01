import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Heart,
  Users,
  Phone,
  Sparkles,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import sandwichFrenchToastImage from "@/assets/sandwich-french-toast.jpg";
import najiInteriorImage from "@/assets/naji-interior.jpg";
import icedLatteImage from "@/assets/drink-iced-latte.jpg";
import cappuccinoImage from "@/assets/drink-cappuccino.jpg";
import matchaImage from "@/assets/drink-matcha.jpg";
import coldBrewImage from "@/assets/drink-cold-brew.jpg";
import foodCroissantBrunchImage from "@/assets/food-croissant-brunch.jpg";
import foodAvocadoToastImage from "@/assets/food-avocado-toast.jpg";
import foodBasqueCheesecakeImage from "@/assets/food-basque-cheesecake.jpg";
import { cafeName, featuredDrinks, phone, phoneHref, whatsappUrl } from "@/lib/naji-data";
import { Reveal } from "@/components/motion";
import { WhatsAppIcon } from "@/components/site-chrome";
import { OrderAndTrackingSection } from "@/components/order-system";
import { recordWhatsAppClick } from "@/lib/admin-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cafe Parisienne | Where Every Sip Feels Like Paris · London" },
      {
        name: "description",
        content:
          "Welcome to Cafe Parisienne at 225 Lavender Hill, London. Velvet-poured artisan coffee, golden Parisian croissants, and warm moments.",
      },
      { property: "og:title", content: "Cafe Parisienne | Lavender Hill, London" },
      {
        property: "og:description",
        content:
          "Where every sip feels like Paris in the heart of London. Discover our menu, story, and cozy atmosphere at 225 Lavender Hill.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: IndexPage,
});

function BeanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="12" rx="7.5" ry="9.5" transform="rotate(-30 12 12)" />
      <path d="M7 6.5C8.8 8.8 9.5 12 8 15C7 17 8 19 9 20" />
    </svg>
  );
}

const drinkImages = [icedLatteImage, cappuccinoImage, matchaImage, coldBrewImage];

const heroQuotes = [
  "“Velvet-poured single-origin espresso, warm golden croissants straight from the oven, and slow mornings worth lingering over.”",
  "“A little corner of Paris on Lavender Hill — where rich aroma, artisan pastries, and warm conversation meet every single morning.”",
  "“Crafted with passion from 6:30 AM daily — pour-over perfection, ceremonial Uji matcha, and soulful plates made to brighten your day.”",
];

function IndexPage() {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [waveActive, setWaveActive] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const triggerWordPop = (id: string) => {
    setActiveWord(id);
    setWaveActive(true);
    setTimeout(() => setActiveWord(null), 650);
    setTimeout(() => setWaveActive(false), 750);
  };

  return (
    <div className="bg-[#faf9f6] text-[#1c1814] selection:bg-sand selection:text-[#1c1814]">
      {/* HERO SECTION */}
      <section className="relative min-h-[94svh] bg-[#0e0d0b] text-white pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 flex items-center overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-sand/[0.08] blur-[130px] animate-float-slow" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-[440px] h-[440px] rounded-full bg-sand/[0.06] blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 z-10">
              <Reveal delay={50} direction="up">
                <button
                  type="button"
                  onClick={() => {
                    triggerWordPop("badge");
                    setQuoteIdx((prev) => (prev + 1) % heroQuotes.length);
                  }}
                  className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-sand/15 border border-sand/35 hover:border-sand mb-6 cursor-pointer transition-all duration-300 active:scale-95 ${
                    activeWord === "badge" ? "font-click-pop" : ""
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-sand animate-pulse" />
                  <span className="text-xs font-semibold tracking-[0.22em] text-sand uppercase">
                    {cafeName} · 225 Lavender Hill, London
                  </span>
                </button>
              </Reveal>

              <Reveal delay={140} direction="up">
                <h1
                  onClick={() => triggerWordPop("heading")}
                  title="Click words to animate"
                  className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[4.85rem] font-normal leading-[1.06] tracking-tight text-white cursor-pointer select-none"
                >
                  {["Where", "Every", "Sip"].map((word, i) => (
                    <span
                      key={word}
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerWordPop(word);
                      }}
                      style={{ transitionDelay: waveActive ? `${i * 55}ms` : "0ms" }}
                      className={`interactive-word mr-3 sm:mr-4 ${
                        activeWord === word || waveActive
                          ? "font-click-pop text-sand"
                          : "hover:text-sand"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                  <br />
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerWordPop("paris");
                    }}
                    className={`interactive-word italic font-normal text-gold-shimmer mr-3 sm:mr-4 ${
                      activeWord === "paris" || waveActive ? "font-click-pop scale-105" : ""
                    }`}
                  >
                    Feels Like Paris,
                  </span>
                  <br />
                  {["Poured", "for", "London."].map((word, i) => (
                    <span
                      key={word}
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerWordPop(word);
                      }}
                      style={{ transitionDelay: waveActive ? `${(i + 3) * 55}ms` : "0ms" }}
                      className={`interactive-word mr-3 sm:mr-4 text-white/95 ${
                        activeWord === word || waveActive
                          ? "font-click-pop text-sand"
                          : "hover:text-sand"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
              </Reveal>

              <Reveal delay={230} direction="up">
                <div
                  onClick={() => {
                    triggerWordPop("quote");
                    setQuoteIdx((prev) => (prev + 1) % heroQuotes.length);
                  }}
                  title="Click text to animate & switch mood"
                  className={`mt-6 max-w-xl cursor-pointer select-none rounded-2xl p-4 -mx-4 hover:bg-white/[0.03] border border-transparent hover:border-sand/20 transition-all duration-300 group ${
                    activeWord === "quote" ? "font-click-pop bg-white/[0.04] border-sand/30" : ""
                  }`}
                >
                  <p className="text-base sm:text-lg text-white/85 group-hover:text-white leading-relaxed font-serif italic transition-colors">
                    {heroQuotes[quoteIdx]}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-sans tracking-wider uppercase text-sand/85">
                    <span className="px-2.5 py-1 rounded-full bg-sand/10 border border-sand/25 group-hover:bg-sand/20 transition-colors">
                      ✦ Artisan Single-Origin Roast
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-sand/10 border border-sand/25 group-hover:bg-sand/20 transition-colors">
                      ✦ Fresh Parisian Pastries
                    </span>
                    <span className="text-white/45 group-hover:text-sand transition-colors ml-1">
                      (Tap text to animate ↻)
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={320} direction="up">
                <div className="mt-9 sm:mt-11 flex flex-wrap items-center gap-3.5">
                  <Link
                    to="/menu"
                    className="btn-premium px-8 py-4 text-sm sm:text-base group"
                  >
                    <span>Explore Our Menu</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordWhatsAppClick("Hero Direct WhatsApp")}
                    className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-4 text-sm sm:text-base shadow-[0_8px_24px_-4px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={phoneHref}
                    className="btn-outline-dark px-6 py-4 text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 text-sand" />
                    <span>{phone}</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <Reveal delay={200} direction="scale" className="w-full max-w-lg lg:max-w-none">
                <div className="relative group">
                  {/* Decorative Offset Frame */}
                  <div className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-sand/20 translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:border-sand/40" />

                  <div className="image-showcase relative w-full rounded-3xl overflow-hidden shadow-[0_28px_60px_-15px_rgba(0,0,0,0.8)] border border-white/15">
                    <img
                      src={sandwichFrenchToastImage}
                      alt="Artisanal toasted sandwich and brioche French toast with fresh berries and banana"
                      width={1200}
                      height={900}
                      className="w-full h-auto object-cover"
                      fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-75 group-hover:opacity-55 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION BAR (4 CUSTOMISED COLUMNS) */}
      <section className="bg-gradient-to-b from-[#faf7f2] via-[#f3ede2] to-[#faf7f2] border-y border-[#e2d6c3] py-16 lg:py-24 relative z-10 overflow-hidden">
        {/* Subtle decorative ambient glows */}
        <div className="pointer-events-none absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-[#d4b58e]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#c89b6e]/15 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1612] text-[#f3cfa0] text-[11px] font-semibold uppercase tracking-[0.24em] shadow-sm">
                ✦ The Parisienne Signature ✦
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1b140e] mt-4 tracking-tight cursor-pointer">
                Crafted with{" "}
                <span className="italic font-light text-[#a86428] underline decoration-[#d4b58e]/60 decoration-1 underline-offset-8">
                  Passion, Flavour &amp; Warmth
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {/* 1. Premium Beans */}
            <Reveal delay={60} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#1b1510] via-[#241c15] to-[#140f0c] border border-[#d4b58e]/30 hover:border-[#f5c27c]/70 shadow-[0_18px_40px_-15px_rgba(27,21,16,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#f5c27c]/10 blur-2xl group-hover:bg-[#f5c27c]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5c27c]/25 to-[#b87d3e]/10 border border-[#f5c27c]/40 flex items-center justify-center text-[#f7c987] transition-all duration-300 group-hover:bg-[#f5c27c] group-hover:text-[#1b1510] group-hover:scale-110 group-hover:rotate-3 shadow-[0_8px_20px_-4px_rgba(245,194,124,0.35)]">
                      <BeanIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5c27c] bg-[#f5c27c]/10 border border-[#f5c27c]/30 px-3 py-1 rounded-full">
                      01 · Roastery
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold tracking-wide text-[#ffdfa8] group-hover:text-white transition-colors">
                    Premium{" "}
                    <span className="italic font-normal text-[#f5b865]">Specialty Beans</span>
                  </h3>
                  <p className="mt-3 text-sm font-sans text-[#dfd3c3] leading-relaxed">
                    Single-origin Arabica sourced ethically from the world&apos;s finest high-altitude
                    coffee estates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#f5c27c]">
                  <span>✦ Small-Batch Roasted</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>

            {/* 2. Fresh Ingredients */}
            <Reveal delay={140} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#132019] via-[#1a2b22] to-[#0f1914] border border-[#6ee7b7]/25 hover:border-[#6ee7b7]/65 shadow-[0_18px_40px_-15px_rgba(19,32,25,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#6ee7b7]/10 blur-2xl group-hover:bg-[#6ee7b7]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6ee7b7]/25 to-[#10b981]/10 border border-[#6ee7b7]/40 flex items-center justify-center text-[#86efac] transition-all duration-300 group-hover:bg-[#6ee7b7] group-hover:text-[#0f1914] group-hover:scale-110 group-hover:-rotate-3 shadow-[0_8px_20px_-4px_rgba(110,231,183,0.3)]">
                      <Leaf className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#86efac] bg-[#6ee7b7]/10 border border-[#6ee7b7]/30 px-3 py-1 rounded-full">
                      02 · Kitchen
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold tracking-wide text-[#d9fbe5] group-hover:text-white transition-colors">
                    Farm-Fresh{" "}
                    <span className="italic font-normal text-[#7ce8a6]">Ingredients</span>
                  </h3>
                  <p className="mt-3 text-sm font-sans text-[#cfe3d6] leading-relaxed">
                    Locally sourced organic produce, French cultured butter, and artisan pastries
                    baked fresh daily.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#86efac]">
                  <span>✦ 100% Daily Fresh</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>

            {/* 3. Cozy Atmosphere */}
            <Reveal delay={220} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#231413] via-[#2d1a18] to-[#180d0c] border border-[#fda4af]/25 hover:border-[#fda4af]/65 shadow-[0_18px_40px_-15px_rgba(35,20,19,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#fda4af]/10 blur-2xl group-hover:bg-[#fda4af]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fda4af]/25 to-[#f43f5e]/10 border border-[#fda4af]/40 flex items-center justify-center text-[#fecdd3] transition-all duration-300 group-hover:bg-[#fda4af] group-hover:text-[#231413] group-hover:scale-110 group-hover:rotate-3 shadow-[0_8px_20px_-4px_rgba(253,164,175,0.3)]">
                      <Heart className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#fecdd3] bg-[#fda4af]/10 border border-[#fda4af]/30 px-3 py-1 rounded-full">
                      03 · Ambience
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold tracking-wide text-[#ffe4e8] group-hover:text-white transition-colors">
                    Cozy Parisian{" "}
                    <span className="italic font-normal text-[#ff9ebb]">Atmosphere</span>
                  </h3>
                  <p className="mt-3 text-sm font-sans text-[#e5cfd2] leading-relaxed">
                    Warm timber interiors, sunlit tables, and soulful melodies designed for slow,
                    peaceful mornings.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#fecdd3]">
                  <span>✦ Warm &amp; Inviting</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>

            {/* 4. Friendly Community */}
            <Reveal delay={300} direction="up">
              <div className="card-luxury group relative flex flex-col justify-between text-left p-7 rounded-3xl bg-gradient-to-br from-[#1f1910] via-[#2a2115] to-[#15110a] border border-[#fde047]/25 hover:border-[#fde047]/65 shadow-[0_18px_40px_-15px_rgba(31,25,16,0.35)] h-full overflow-hidden cursor-pointer">
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#fde047]/10 blur-2xl group-hover:bg-[#fde047]/25 transition-all duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fde047]/25 to-[#eab308]/10 border border-[#fde047]/40 flex items-center justify-center text-[#fef08a] transition-all duration-300 group-hover:bg-[#fde047] group-hover:text-[#1f1910] group-hover:scale-110 group-hover:-rotate-3 shadow-[0_8px_20px_-4px_rgba(253,224,71,0.3)]">
                      <Users className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#fef08a] bg-[#fde047]/10 border border-[#fde047]/30 px-3 py-1 rounded-full">
                      04 · London SW11
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold tracking-wide text-[#fff7cc] group-hover:text-white transition-colors">
                    Friendly{" "}
                    <span className="italic font-normal text-[#facc15]">Community</span>
                  </h3>
                  <p className="mt-3 text-sm font-sans text-[#e6dec8] leading-relaxed">
                    A welcoming Lavender Hill gathering spot where great coffee and warm smiles
                    bring people together.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#fef08a]">
                  <span>✦ Everyone Welcome</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-24 lg:py-32 bg-[#faf9f6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Story Image */}
            <div className="lg:col-span-6">
              <Reveal direction="right">
                <div className="relative group">
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-sand/15 -rotate-1 transition-transform duration-500 group-hover:rotate-0" />
                  <div className="image-showcase relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,21,16,0.18)] border border-[#e8e4de] aspect-[4/3]">
                    <img
                      src={najiInteriorImage}
                      alt="Cafe Parisienne warm interior and coffee bar"
                      width={1200}
                      height={900}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-6 lg:pl-6">
              <Reveal delay={100} direction="left">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-sand-dark uppercase">
                  <span className="w-6 h-[1px] bg-sand-dark" />
                  <span>About Us · Lavender Hill, London</span>
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1a1510] tracking-tight mt-3 leading-[1.08] cursor-pointer">
                  Our Story &amp;{" "}
                  <span className="italic font-light text-[#a86428]">Parisian Soul</span>
                </h2>
                <p className="mt-5 text-[#57534e] text-base sm:text-lg leading-relaxed">
                  {cafeName} was founded with a simple belief: that great coffee and warm pastries
                  have the power to turn an ordinary morning into something unforgettable. What
                  started as a neighbourhood dream at 225 Lavender Hill has blossomed into a beloved
                  sanctuary for coffee lovers, foodies, and creatives.
                </p>
                <p className="mt-3.5 text-[#57534e] text-sm sm:text-base leading-relaxed">
                  From 6:30 AM, our kitchen fills with the aroma of French cultured-butter
                  croissants, wild-yeast sourdough toasts, and small-batch specialty espresso poured
                  with care.
                </p>

                {/* Attractive Cafe Highlights / Pillars below Our Story text */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1611] to-[#271e17] text-white border border-[#d4b58e]/30 shadow-md group hover:-translate-y-1 transition-all duration-300">
                    <span className="font-serif text-2xl font-bold text-[#f5c27c] block">
                      6:30 AM
                    </span>
                    <span className="text-xs font-semibold text-[#ffdfa8] mt-1 block">
                      Morning Oven Bake
                    </span>
                    <p className="text-[11px] text-[#d6c7b2] mt-1 leading-snug">
                      Flaky croissants &amp; brioche fresh from the oven.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#14221a] to-[#1d3025] text-white border border-[#6ee7b7]/30 shadow-md group hover:-translate-y-1 transition-all duration-300">
                    <span className="font-serif text-2xl font-bold text-[#86efac] block">
                      100%
                    </span>
                    <span className="text-xs font-semibold text-[#d9fbe5] mt-1 block">
                      Artisan Arabica
                    </span>
                    <p className="text-[11px] text-[#cfe3d6] mt-1 leading-snug">
                      Single-origin espresso &amp; ceremonial Uji matcha.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#241514] to-[#301c1a] text-white border border-[#fda4af]/30 shadow-md group hover:-translate-y-1 transition-all duration-300">
                    <span className="font-serif text-2xl font-bold text-[#fecdd3] block">
                      All-Day
                    </span>
                    <span className="text-xs font-semibold text-[#ffe4e8] mt-1 block">
                      Brunch &amp; Patisserie
                    </span>
                    <p className="text-[11px] text-[#e5cfd2] mt-1 leading-snug">
                      Sourdough plates &amp; burnt Basque cheesecake.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    to="/about"
                    className="btn-outline-light px-6 py-3 text-sm group"
                  >
                    <span>Explore Kitchen &amp; Food</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                  <a
                    href="#order-and-track-section"
                    className="btn-premium px-6 py-3 text-sm group inline-flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Online</span>
                  </a>
                  <a
                    href="#order-and-track-section"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1c1612] hover:bg-[#2a211b] text-[#f5c27c] border border-[#d4b58e]/40 text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                  >
                    <Clock className="w-4 h-4 text-[#f5c27c]" />
                    <span>Track / Cancel Order</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ATTRACTIVE CAFE EXPERIENCE SHOWCASE BELOW OUR STORY */}
          <div className="mt-20 pt-16 border-t border-[#e5ddd0]">
            <Reveal direction="up">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c1612] text-[#f5c27c] text-[11px] font-semibold uppercase tracking-[0.22em]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inside {cafeName}</span>
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1b140e] mt-3 tracking-tight cursor-pointer">
                    Signature Moments &amp;{" "}
                    <span className="italic font-light text-[#a86428]">Daily Craft</span>
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-[#57534e] max-w-md leading-relaxed">
                  Every corner of our Lavender Hill café is designed to delight your senses — from
                  the first morning espresso pull to our afternoon patisserie table.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Highlight Card 1 */}
              <Reveal delay={80} direction="up">
                <div className="card-luxury group rounded-3xl overflow-hidden bg-white border border-[#e5ddd0] shadow-[0_16px_38px_-14px_rgba(26,21,16,0.12)] flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={foodCroissantBrunchImage}
                      alt="Freshly baked Parisian butter croissants and pain au chocolat"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-[#1b1510]/85 backdrop-blur-md border border-[#f5c27c]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5c27c]">
                      ✦ 01 · Morning Bakery
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-2xl text-[#1c1612] group-hover:text-[#a86428] transition-colors">
                        Golden French{" "}
                        <span className="italic font-normal text-[#b86f2d]">Viennoiserie</span>
                      </h4>
                      <p className="mt-2.5 text-xs sm:text-sm text-[#57534e] leading-relaxed">
                        Hand-laminated croissants, almond frangipane pastries, and warm brioche
                        baked fresh every single morning for crisp, honeycomb layers.
                      </p>
                    </div>
                    <div className="mt-5 pt-3.5 border-t border-[#f0eae1] flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#a86428]">
                      <span>Served Warm from 6:30 AM</span>
                      <a href="#order-and-track-section" className="hover:underline">
                        Order Now →
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Highlight Card 2 */}
              <Reveal delay={160} direction="up">
                <div className="card-luxury group rounded-3xl overflow-hidden bg-white border border-[#e5ddd0] shadow-[0_16px_38px_-14px_rgba(26,21,16,0.12)] flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={foodAvocadoToastImage}
                      alt="Smashed avocado and poached free-range eggs on toasted sourdough"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-[#132019]/85 backdrop-blur-md border border-[#6ee7b7]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86efac]">
                      ✦ 02 · All-Day Brunch
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-2xl text-[#1c1612] group-hover:text-[#236b48] transition-colors">
                        Chef&apos;s Sourdough{" "}
                        <span className="italic font-normal text-[#2b7a54]">&amp; Brunch Plates</span>
                      </h4>
                      <p className="mt-2.5 text-xs sm:text-sm text-[#57534e] leading-relaxed">
                        Wild-yeast toasted sourdough topped with crushed Hass avocado, poached
                        free-range eggs, heirloom tomatoes, and warm Gruyère truffle melts.
                      </p>
                    </div>
                    <div className="mt-5 pt-3.5 border-t border-[#f0eae1] flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#2b7a54]">
                      <span>Plated Fresh to Order</span>
                      <a href="#order-and-track-section" className="hover:underline">
                        Order Now →
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Highlight Card 3 */}
              <Reveal delay={240} direction="up">
                <div className="card-luxury group rounded-3xl overflow-hidden bg-white border border-[#e5ddd0] shadow-[0_16px_38px_-14px_rgba(26,21,16,0.12)] flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={foodBasqueCheesecakeImage}
                      alt="Caramelized Basque burnt cheesecake with fresh berries"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-[#231413]/85 backdrop-blur-md border border-[#fda4af]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fecdd3]">
                      ✦ 03 · Patisserie Counter
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-2xl text-[#1c1612] group-hover:text-[#a83b4b] transition-colors">
                        Signature Basque{" "}
                        <span className="italic font-normal text-[#b84355]">Burnt Cheesecake</span>
                      </h4>
                      <p className="mt-2.5 text-xs sm:text-sm text-[#57534e] leading-relaxed">
                        Deeply caramelized top with an ultra-creamy center, paired with fresh
                        seasonal berries and our house-whisked pistachio or matcha lattes.
                      </p>
                    </div>
                    <div className="mt-5 pt-3.5 border-t border-[#f0eae1] flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#b84355]">
                      <span>House Specialty Dessert</span>
                      <a href="#order-and-track-section" className="hover:underline">
                        Order Now →
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DRINKS SECTION */}
      <section className="py-24 lg:py-32 bg-[#ffffff] border-t border-[#e8e4de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Reveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-sand-dark uppercase">
                  <span className="w-6 h-[1px] bg-sand-dark" />
                  <span>Our Menu</span>
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#1a1510] tracking-tight mt-2.5">
                  Featured Drinks
                </h2>
                <p className="text-[#78716c] text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                  From rich espressos to creamy lattes, our menu is crafted to delight every coffee
                  lover.
                </p>
              </div>
              <div>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1510] hover:text-sand-dark border-b border-[#1a1510]/30 hover:border-sand-dark pb-1 transition-all duration-300 group"
                >
                  <span>View Full Menu</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {featuredDrinks.map((item, index) => (
              <Reveal key={item.name} delay={index * 90} direction="up">
                <Link
                  to="/menu"
                  className="card-luxury group flex flex-col rounded-3xl bg-[#faf9f6] border border-[#e8e4de] p-3.5 h-full focus:outline-none"
                >
                  {/* Image */}
                  <div className="image-showcase relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f5f2eb]">
                    <img
                      src={drinkImages[index]}
                      alt={item.name}
                      width={600}
                      height={450}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    {/* Interactive Hover Badge */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#1a1510] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-4 pb-2 px-2 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-xl font-medium text-[#1a1510] group-hover:text-sand-dark transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-sm font-semibold text-[#1a1510] bg-sand/25 px-2.5 py-0.5 rounded-full shrink-0">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#78716c] mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM BANNER: YOUR NEXT FAVORITE SPOT AWAITS */}
      <section className="bg-[#0e0d0b] text-white overflow-hidden border-t border-white/10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left Text */}
          <div className="px-6 py-20 sm:px-12 md:px-16 lg:px-20 xl:px-24 relative z-10">
            <Reveal direction="up">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.12] tracking-tight">
                Your Next Favorite <br />
                Spot Awaits
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
                Great coffee, fresh food, and a welcoming space. We can't wait to see you.
              </p>
              <div className="mt-9">
                <Link
                  to="/visit"
                  className="btn-premium px-8 py-3.5 text-sm sm:text-base group"
                >
                  <span>Visit Us</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Image */}
          <div className="image-showcase relative h-80 sm:h-96 lg:h-[460px] w-full overflow-hidden">
            <img
              src={sandwichFrenchToastImage}
              alt="Artisanal sandwich and French toast with fresh fruits at Cafe Parisienne"
              width={1200}
              height={800}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0d0b] via-[#0e0d0b]/25 to-transparent lg:block hidden pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-transparent to-transparent lg:hidden block pointer-events-none" />
          </div>
        </div>
      </section>

      {/* INTERACTIVE ORDER ONLINE & TRACK / CANCEL ORDER SECTION (BELOW FEATURED DRINKS & YOUR NEXT FAVORITE SPOT) */}
      <section className="py-20 lg:py-28 bg-[#faf7f2] border-t border-[#e5ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <OrderAndTrackingSection />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
