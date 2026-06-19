"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

function useRevealObserver(margin = "-80px") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return ref;
}

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: SectionRevealProps) {
  const ref = useRevealObserver("-60px");

  const dirClass = {
    up: "reveal reveal-up",
    left: "reveal reveal-left",
    right: "reveal reveal-right",
    none: "reveal reveal-up",
  };

  return (
    <div
      ref={ref}
      className={`${dirClass[direction]} ${className}`}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const ref = useRevealObserver("-30px");

  return (
    <div
      ref={ref}
      className={`reveal reveal-item ${className}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {children}
    </div>
  );
}
