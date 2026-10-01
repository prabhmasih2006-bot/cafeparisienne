import { createFileRoute } from "@tanstack/react-router";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import sandwichFrenchToastImage from "@/assets/sandwich-french-toast.jpg";
import foodCroissantBrunchImage from "@/assets/food-croissant-brunch.jpg";
import foodAvocadoToastImage from "@/assets/food-avocado-toast.jpg";
import foodBasqueCheesecakeImage from "@/assets/food-basque-cheesecake.jpg";
import drinksImage from "@/assets/naji-drinks.jpg";
import foodImage from "@/assets/naji-food.jpg";
import { Reveal } from "@/components/motion";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Cafe Parisienne" },
      {
        name: "description",
        content:
          "An editorial visual gallery inspired by Cafe Parisienne's drinks, food and warm café atmosphere.",
      },
      { property: "og:title", content: "Gallery | Cafe Parisienne" },
      {
        property: "og:description",
        content: "Coffee, drinks, food and café atmosphere in an editorial visual gallery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const images = [
  {
    src: sandwichFrenchToastImage,
    alt: "Artisanal sandwich and French toast with fresh fruits",
    label: "Sandwich & French Toast",
    cls: "md:col-span-2 md:row-span-2",
  },
  {
    src: foodCroissantBrunchImage,
    alt: "Golden Parisian butter croissant and pain au chocolat",
    label: "Parisian Viennoiserie",
    cls: "",
  },
  {
    src: foodAvocadoToastImage,
    alt: "Smashed avocado and poached eggs on toasted artisan sourdough",
    label: "Avocado & Poached Eggs",
    cls: "",
  },
  {
    src: foodBasqueCheesecakeImage,
    alt: "Caramelized Basque burnt cheesecake topped with fresh berries",
    label: "Basque Burnt Cheesecake",
    cls: "md:col-span-2",
  },
  {
    src: drinksImage,
    alt: "Specialty coffee and matcha drinks",
    label: "Drinks",
    cls: "",
  },
  {
    src: foodImage,
    alt: "Fresh café toast and cakes",
    label: "Bakery & Bites",
    cls: "",
  },
];

function GalleryPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <section className="relative bg-[#0e0d0b] pb-20 pt-32 sm:pt-40 text-white border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-1/4 w-[420px] h-[420px] rounded-full bg-sand/[0.07] blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={50} direction="up">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-sand/30 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sand" />
              <p className="text-xs font-semibold tracking-[0.22em] text-sand uppercase">
                Coffee · Food · Atmosphere
              </p>
            </div>
          </Reveal>
          <Reveal delay={130} direction="up">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-none tracking-tight text-white max-w-4xl">
              A visual taste of Cafe Parisienne.
            </h1>
          </Reveal>
          <Reveal delay={210} direction="up">
            <p className="mt-6 max-w-lg text-sm sm:text-base text-white/70 leading-relaxed">
              Editorial imagery is illustrative and is not presented as authentic photography of the
              café.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[330px]">
          {images.map((img, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <button
                  className={`group image-showcase relative overflow-hidden rounded-3xl border border-[#e8e4de] shadow-[0_14px_34px_-12px_rgba(26,21,16,0.14)] hover:shadow-[0_24px_50px_-12px_rgba(26,21,16,0.26)] text-left cursor-pointer transition-all duration-500 hover:-translate-y-1 ${img.cls}`}
                  aria-label={`Open ${img.label} image`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={i === 0 ? 1920 : 1600}
                    height={1200}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />

                  {/* Expand Icon Pill on Hover */}
                  <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#1a1510] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </span>

                  {/* Label Pill */}
                  <span className="absolute bottom-5 left-5 rounded-full bg-[#0e0d0b]/85 backdrop-blur-md border border-white/15 px-4 py-2 text-xs font-medium tracking-wide text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:border-sand/50">
                    {img.label}
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl rounded-3xl border border-white/15 bg-[#0e0d0b]/95 backdrop-blur-xl p-3 sm:p-4 shadow-2xl">
                <DialogTitle className="sr-only">{img.label}</DialogTitle>
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={i === 0 ? 1920 : 1600}
                    height={1200}
                    className="max-h-[80vh] w-full object-contain rounded-2xl"
                  />
                  <div className="mt-3 flex items-center justify-between px-2 text-xs text-white/75">
                    <span className="font-serif text-base text-sand">{img.label}</span>
                    <span>{img.alt}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
}