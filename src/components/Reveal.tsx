"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

const origins = {
  bottom: "translateY(90px)",
  top: "translateY(-90px)",
  left: "translateX(-15px)",
  right: "translateX(15px)",
} as const;

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  origin?: keyof typeof origins;
  delay?: number;
  className?: string;
};

/** Fades its children in once they scroll into view. */
export function Reveal({ children, as: Tag = "div", origin = "bottom", delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-from": origins[origin], "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
