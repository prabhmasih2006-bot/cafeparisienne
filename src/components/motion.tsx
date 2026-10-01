import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  duration?: number;
  threshold?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 750,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenTransform = {
    up: "translate3d(0, 28px, 0)",
    down: "translate3d(0, -28px, 0)",
    left: "translate3d(28px, 0, 0)",
    right: "translate3d(-28px, 0, 0)",
    scale: "translate3d(0, 16px, 0) scale(0.96)",
    none: "translate3d(0, 0, 0)",
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : hiddenTransform,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      key={pathname}
      onClick={(e) => {
        const target = (e.target as HTMLElement | null)?.closest(
          "h1, h2, h3, h4, .interactive-text, .interactive-word"
        ) as HTMLElement | null;
        if (!target || target.closest("a, button, input, textarea")) return;
        target.classList.remove("font-click-pop");
        void target.offsetWidth;
        target.classList.add("font-click-pop");
      }}
      className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        animating ? "opacity-90 translate-y-1" : "opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
