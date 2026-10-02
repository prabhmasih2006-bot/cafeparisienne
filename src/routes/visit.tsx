import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Send, CheckCircle2, Phone, Banknote, Compass } from "lucide-react";
import { useState } from "react";
import {
  address,
  cafeName,
  directionsUrl,
  openingHours,
  phone,
  phoneHref,
  plusCode,
  priceRange,
  whatsappUrl,
} from "@/lib/naji-data";
import najiInteriorImage from "@/assets/naji-interior.jpg";
import { Reveal } from "@/components/motion";
import { WhatsAppIcon } from "@/components/site-chrome";
import { recordWhatsAppClick, recordFormSubmission } from "@/lib/admin-store";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit & Contact | Cafe Parisienne" },
      {
        name: "description",
        content:
          "Visit Cafe Parisienne at 225 Lavender Hill, London SW11 1JR. Find our location, opening hours, directions, phone, and WhatsApp contact.",
      },
      { property: "og:title", content: "Visit & Contact | Cafe Parisienne" },
      {
        property: "og:description",
        content: "Great coffee, fresh food, and a welcoming space at 225 Lavender Hill, London.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/visit" }],
  }),
  component: VisitPage,
});

function VisitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    recordFormSubmission({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      formType: "contact",
    });

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#faf9f6] text-[#1c1814] min-h-screen">
      {/* Header Banner */}
      <section className="relative bg-[#0e0d0b] text-white pt-32 pb-20 sm:pt-40 sm:pb-28 border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/4 w-[440px] h-[440px] rounded-full bg-sand/[0.07] blur-[130px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal delay={50} direction="up">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-sand/30 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                  <p className="text-xs font-semibold tracking-[0.22em] text-sand uppercase">
                    225 Lavender Hill · London SW11
                  </p>
                </div>
              </Reveal>
              <Reveal delay={130} direction="up">
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-none">
                  Come By <br />
                  <span className="italic text-sand">{cafeName}.</span>
                </h1>
              </Reveal>
              <Reveal delay={210} direction="up">
                <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-lg">
                  Your neighbourhood Parisian café in London awaits. Stop by for your morning
                  espresso, call us directly, or message us on WhatsApp with a single tap.
                </p>
              </Reveal>
              <Reveal delay={290} direction="up">
                <div className="mt-9 flex flex-wrap gap-3.5">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium px-6 py-3.5 text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Get Directions</span>
                  </a>
                  <a
                    href={phoneHref}
                    className="btn-outline-dark px-6 py-3.5 text-sm"
                  >
                    <Phone className="w-4 h-4 text-sand" />
                    <span>{phone}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordWhatsAppClick("Visit Page Banner")}
                    className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3.5 text-sm shadow-[0_8px_24px_-4px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} direction="scale">
              <div className="relative group">
                <div className="pointer-events-none absolute -inset-3 rounded-3xl border border-sand/20 translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                <div className="image-showcase rounded-3xl overflow-hidden shadow-[0_28px_60px_-15px_rgba(0,0,0,0.8)] border border-white/15 aspect-[4/3]">
                  <img
                    src={najiInteriorImage}
                    alt="Cafe Parisienne interior and coffee bar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Info & Contact Form */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal direction="right">
              <div className="card-luxury bg-white p-8 sm:p-10 rounded-3xl border border-[#e8e4de] space-y-7 shadow-sm">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl p-3 -m-3 hover:bg-[#faf9f6] transition-colors"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sand-dark flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-sand/15 border border-sand/30 flex items-center justify-center group-hover:bg-sand group-hover:text-[#1a1510] transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-sand-dark group-hover:text-[#1a1510]" />
                    </span>
                    <span>Location</span>
                  </p>
                  <h3 className="font-serif text-2xl text-[#1a1510] group-hover:text-sand-dark transition-colors mt-3">
                    {cafeName}
                  </h3>
                  <p className="text-sm text-[#57534e] mt-1.5 leading-relaxed">{address}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#78716c]">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#faf9f6] border border-[#e8e4de]">
                      <Compass className="w-3 h-3 text-sand-dark" />
                      {plusCode}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#faf9f6] border border-[#e8e4de]">
                      <Banknote className="w-3 h-3 text-sand-dark" />
                      {priceRange}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-sand-dark group-hover:text-[#1a1510] underline underline-offset-4">
                    Open in Google Maps →
                  </span>
                </a>

                <div className="rounded-2xl overflow-hidden border border-[#e8e4de] h-52 bg-[#faf9f6]">
                  <iframe
                    title="Cafe Parisienne Location Map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Direct Call & WhatsApp Buttons */}
                <div className="border-t border-[#e8e4de] pt-7">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sand-dark flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-sand/15 border border-sand/30 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-sand-dark" />
                    </span>
                    <span>Call or WhatsApp</span>
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={phoneHref}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#faf9f6] border border-[#e8e4de] hover:border-sand hover:bg-sand/10 transition-all group"
                    >
                      <span className="w-10 h-10 rounded-full bg-[#1a1510] text-sand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716c]">
                          Call Us
                        </span>
                        <span className="block text-xs sm:text-sm font-semibold text-[#1a1510] truncate">
                          {phone}
                        </span>
                      </div>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordWhatsAppClick("Visit Page Contact Card")}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all group"
                    >
                      <span className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                        <WhatsAppIcon className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#15803d]">
                          WhatsApp
                        </span>
                        <span className="block text-xs sm:text-sm font-semibold text-[#1a1510] truncate">
                          Say &ldquo;Hello&rdquo; →
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="border-t border-[#e8e4de] pt-7">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sand-dark flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-sand/15 border border-sand/30 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-sand-dark" />
                    </span>
                    <span>Opening Hours</span>
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-[#57534e]">
                    {openingHours.map((item) => (
                      <div
                        key={item.day}
                        className="flex justify-between items-center px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e4de]/70"
                      >
                        <span className="font-medium text-[#1a1510]">{item.day}</span>
                        <span className="font-medium text-sand-dark">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Reveal delay={120} direction="left">
              <div className="card-luxury bg-white p-8 sm:p-10 rounded-3xl border border-[#e8e4de] shadow-sm">
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1510]">Send Us a Message</h2>
                <p className="text-sm sm:text-base text-[#78716c] mt-2 leading-relaxed">
                  Inquiring about catering, private events, or just want to say hello to {cafeName}?
                  Fill out the form below or message us on WhatsApp.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#1a1510] uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full rounded-2xl border border-[#e8e4de] bg-[#faf9f6] px-4 py-3.5 text-sm text-[#1a1510] transition-all duration-200 focus:outline-none focus:border-sand focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,181,142,0.18)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a1510] uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full rounded-2xl border border-[#e8e4de] bg-[#faf9f6] px-4 py-3.5 text-sm text-[#1a1510] transition-all duration-200 focus:outline-none focus:border-sand focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,181,142,0.18)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1a1510] uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="General Inquiry / Catering / Reservation"
                      className="w-full rounded-2xl border border-[#e8e4de] bg-[#faf9f6] px-4 py-3.5 text-sm text-[#1a1510] transition-all duration-200 focus:outline-none focus:border-sand focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,181,142,0.18)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1a1510] uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="w-full rounded-2xl border border-[#e8e4de] bg-[#faf9f6] px-4 py-3.5 text-sm text-[#1a1510] transition-all duration-200 focus:outline-none focus:border-sand focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,181,142,0.18)]"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      className="btn-premium px-8 py-4 text-sm cursor-pointer group"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </button>

                    {submitted && (
                      <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Thank you! Your message has been received. Our team will get back to you shortly.
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}