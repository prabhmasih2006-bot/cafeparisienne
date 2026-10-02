import { Link, useRouterState } from "@tanstack/react-router";
import {
  Coffee,
  Menu,
  Search,
  X,
  MapPin,
  Clock,
  ArrowUpRight,
  Phone,
  Banknote,
  Compass,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  address,
  cafeName,
  directionsUrl,
  drinks,
  foods,
  openingHours,
  phone,
  phoneHref,
  plusCode,
  priceRange,
  whatsappUrl,
} from "@/lib/naji-data";
import { recordWhatsAppClick } from "@/lib/admin-store";

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.031 2c-5.516 0-9.999 4.484-9.999 10 0 1.766.461 3.489 1.338 5.011L2 22l5.122-1.343A9.953 9.953 0 0 0 12.031 22c5.515 0 9.999-4.484 9.999-10s-4.484-10-9.999-10Zm5.824 14.122c-.246.691-1.434 1.323-1.985 1.406-.508.076-1.15.108-1.857-.116-.428-.136-.978-.318-1.685-.623-2.966-1.281-4.902-4.269-5.05-4.467-.148-.197-1.206-1.605-1.206-3.062 0-1.456.763-2.172 1.034-2.469.271-.296.591-.37.788-.37.197 0 .394.002.567.01.182.009.426-.069.666.508.246.593.837 2.049.911 2.197.074.148.123.321.025.518-.099.198-.148.321-.296.494-.148.173-.311.386-.444.519-.148.148-.302.309-.13.605.173.296.766 1.263 1.645 2.047 1.131 1.008 2.083 1.321 2.379 1.469.295.148.468.123.641-.074.172-.198.739-.864.936-1.161.197-.296.394-.246.665-.148.271.099 1.725.814 2.02.962.296.149.493.222.567.346.074.123.074.716-.171 1.407Z" />
    </svg>
  );
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/visit", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allMenuItems = [...drinks, ...foods];
  const filteredItems = searchQuery.trim()
    ? allMenuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.group.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMenuItems.slice(0, 4);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0e0d0b]/95 backdrop-blur-xl border-b border-sand/20 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.65)]"
          : "bg-[#0e0d0b]/80 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16 sm:h-[70px]" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="relative w-10 h-10 rounded-full border border-sand/35 bg-white/[0.03] flex items-center justify-center text-sand group-hover:border-sand group-hover:bg-sand/15 group-hover:scale-105 group-active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,181,142,0.08)] group-hover:shadow-[0_0_24px_rgba(212,181,142,0.28)]">
              <Coffee className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white group-hover:text-sand transition-colors duration-300">
                {cafeName}
              </span>
              <span className="text-[9px] tracking-[0.26em] text-sand font-sans font-medium uppercase -mt-0.5">
                Lavender Hill · London
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-9" aria-label="Main navigation">
            {navLinks.map((item) => {
              const isActive =
                item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative py-1.5 text-sm tracking-wide transition-colors duration-300 group ${
                    isActive
                      ? "text-white font-medium"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-sand transition-transform duration-300 ease-out origin-left ${
                      isActive
                        ? "scale-x-100 shadow-[0_0_10px_rgba(212,181,142,0.8)]"
                        : "scale-x-0 group-hover:scale-x-100 bg-white/70"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={phoneHref}
              title={`Call ${phone}`}
              aria-label={`Call ${phone}`}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.04] text-white/85 hover:text-sand hover:border-sand/50 hover:bg-sand/10 transition-all duration-300 active:scale-95"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordWhatsAppClick("Header Desktop")}
              title="Chat on WhatsApp (Hello)"
              aria-label="Chat on WhatsApp"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#25D366]/35 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 active:scale-95 shadow-[0_0_16px_rgba(37,211,102,0.18)]"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <a
              href="/#order-and-track-section"
              className="btn-premium text-xs sm:text-sm px-5 py-2.5 ml-1"
            >
              <span>Order / Track Order</span>
            </a>
            <button
              type="button"
              aria-label="Search site"
              onClick={() => setSearchOpen((prev) => !prev)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer active:scale-95 ${
                searchOpen
                  ? "border-sand bg-sand/20 text-sand"
                  : "border-white/10 bg-white/[0.03] text-white/80 hover:text-sand hover:border-sand/40 hover:bg-white/[0.07]"
              }`}
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={phoneHref}
              aria-label={`Call ${phone}`}
              className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-sand hover:bg-sand/15 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordWhatsAppClick("Header Mobile")}
              aria-label="WhatsApp Chat"
              className="w-9 h-9 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white active:scale-95 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:border-sand/50 active:scale-95 transition-all"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Search Panel */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          searchOpen ? "max-h-96 opacity-100 border-t border-white/10" : "max-h-0 opacity-0"
        } bg-[#13110e]/98 backdrop-blur-xl`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <div className="relative">
            <Search className="w-4 h-4 text-sand absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specialty coffee, matcha, pastries..."
              className="w-full rounded-full bg-white/[0.06] border border-white/15 pl-11 pr-10 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sand transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredItems.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                to="/menu"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-sand/30 transition-all group"
              >
                <div>
                  <p className="text-sm font-serif text-white group-hover:text-sand transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-white/50 line-clamp-1">{item.description}</p>
                </div>
                <span className="text-xs font-semibold text-sand ml-3 shrink-0">{item.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#141210]/98 backdrop-blur-xl ${
          open ? "max-h-[480px] opacity-100 border-t border-white/10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 space-y-5">
          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => {
              const isActive =
                item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between text-lg font-serif py-2 border-b border-white/5 transition-all ${
                    isActive ? "text-sand pl-2" : "text-white/90 hover:text-sand hover:pl-2"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}
          </nav>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={phoneHref}
              className="btn-outline-dark py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-sand" />
              <span>Call Us</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordWhatsAppClick("Mobile Menu Drawer")}
              className="rounded-full py-2.5 text-xs font-semibold bg-[#25D366] text-white flex items-center justify-center gap-2 shadow-md"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="space-y-2">
            <a
              href="/#order-and-track-section"
              onClick={() => setOpen(false)}
              className="btn-premium w-full py-3 text-sm text-center block"
            >
              Order / Track &amp; Cancel Order
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-[#0b0a08] text-white/80 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Subtle Ambient Top Highlight */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[620px] h-[1px] bg-gradient-to-r from-transparent via-sand/60 to-transparent" />
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-52 rounded-full bg-sand/[0.05] blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Custom Top Connect Banner inside Footer */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.04] via-sand/[0.07] to-white/[0.03] border border-sand/25 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-sand uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sand animate-pulse" />
               Lavender Hill · London SW11
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1">
              Visit {cafeName} or Message Us Directly
            </h3>
            <p className="text-xs sm:text-sm text-white/65 mt-1">
              {address} · {priceRange}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordWhatsAppClick("Footer Connect Banner")}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm shadow-[0_8px_24px_-4px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              href={phoneHref}
              className="btn-premium px-5 py-3 text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call {phone}</span>
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-dark px-5 py-3 text-xs sm:text-sm"
            >
              <MapPin className="w-4 h-4 text-sand" />
              <span>Directions</span>
            </a>
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-full border border-sand/40 bg-white/[0.03] flex items-center justify-center text-sand group-hover:border-sand group-hover:scale-105 transition-all duration-300">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-normal text-white group-hover:text-sand transition-colors">
                  {cafeName}
                </span>
                <span className="block text-[9px] tracking-[0.25em] text-sand uppercase">
                  Patisserie & Specialty Café
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm">
              Parisian charm on Lavender Hill. Savour artisan coffee, freshly baked Viennoiserie,
              and warm neighbourhood hospitality in the heart of London.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80">
              <Banknote className="w-3.5 h-3.5 text-sand" />
              <span>{priceRange}</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">
              Opening Hours
            </p>
            <div className="text-xs text-white/75 space-y-1.5">
              {openingHours.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2 text-white/90 font-medium">
                    <Clock className="w-3 h-3 text-sand shrink-0" />
                    {item.day}
                  </span>
                  <span className="text-white/65">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">Explore</p>
            <nav className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/70">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="inline-flex items-center gap-2 w-fit hover:text-sand hover:translate-x-1 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sand/60" />
                  <span>{l.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Location & Direct Contact */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">
              Location & Contact
            </p>
            <div className="text-xs sm:text-sm text-white/75 space-y-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 leading-relaxed hover:text-sand transition-colors group"
              >
                <MapPin className="w-4 h-4 text-sand shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>{address}</span>
              </a>

              <p className="flex items-center gap-2.5 text-white/55 text-xs">
                <Compass className="w-4 h-4 text-sand/80 shrink-0" />
                <span>{plusCode}</span>
              </p>

              <a
                href={phoneHref}
                className="flex items-center gap-2.5 hover:text-sand transition-colors group"
              >
                <Phone className="w-4 h-4 text-sand shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white group-hover:text-sand">{phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordWhatsAppClick("Footer Contact Info")}
                className="flex items-center gap-2.5 text-[#25D366] hover:text-[#42e67f] transition-colors group"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-medium">WhatsApp (Say &ldquo;Hello&rdquo;)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>
              © {new Date().getFullYear()} {cafeName} · 225 Lavender Hill, London SW11 1JR. All rights
              reserved.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href={phoneHref}
              aria-label={`Call ${phone}`}
              title={`Call ${phone}`}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/75 hover:text-sand hover:border-sand/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordWhatsAppClick("Footer Bottom Icon")}
              aria-label="WhatsApp Chat"
              title="WhatsApp Chat"
              className="w-9 h-9 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <a
        href={phoneHref}
        aria-label={`Call ${cafeName} at ${phone}`}
        title={`Call ${phone}`}
        className="group flex items-center gap-2.5 rounded-full bg-[#18130e] text-sand border border-sand/40 px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:bg-sand hover:text-[#18130e] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <Phone className="w-4 h-4 shrink-0" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">Call Us</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => recordWhatsAppClick("Floating Action Button")}
        aria-label="Chat on WhatsApp with Hello message"
        title="Chat on WhatsApp"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-[0_10px_28px_rgba(37,211,102,0.45)] hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <WhatsAppIcon className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}