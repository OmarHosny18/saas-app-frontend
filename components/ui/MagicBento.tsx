"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MagicBentoProps {
  enableSpotlight?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
  disableAnimations?: boolean;
}

export default function MagicBento({
  enableSpotlight = true,
  clickEffect = true,
  spotlightRadius = 400,
  glowColor = "132, 0, 255",
  disableAnimations = false,
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableAnimations) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableSpotlight || !containerRef.current) return;

      const x = e.clientX;
      const y = e.clientY;

      containerRef.current.style.background = `
        radial-gradient(
          ${spotlightRadius}px circle at ${x}px ${y}px,
          rgba(${glowColor}, 0.15),
          transparent 60%
        )
      `;
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect || !containerRef.current) return;

      const ripple = document.createElement("div");

      ripple.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, transparent 70%);
        left: ${e.clientX - 200}px;
        top: ${e.clientY - 200}px;
        pointer-events: none;
        z-index: 9999;
      `;

      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1.5,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [
    enableSpotlight,
    clickEffect,
    spotlightRadius,
    glowColor,
    disableAnimations,
  ]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" />
  );
}
