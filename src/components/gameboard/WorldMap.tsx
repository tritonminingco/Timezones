import React from "react";

interface WorldMapProps {
  children?: React.ReactNode;
}

// Uses a free SVG world map background for a realistic look
export const WorldMap: React.FC<WorldMapProps> = ({ children }) => (
  <section
    aria-label="World map overview"
    className="relative w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-700"
  >
    {/* muted map background */}
    <img
      src="/world-map.svg"
      alt="World map (decorative)"
      className="absolute inset-0 w-full h-full object-cover filter grayscale brightness-75 saturate-50 opacity-70 pointer-events-none"
      draggable={false}
    />

    {/* subtle vignette and gradient to ground the content */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/70 pointer-events-none" />

    {/* soft inner glow highlight */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-8 top-6 w-56 h-14 rounded-md bg-gradient-to-r from-slate-800/0 to-slate-800/20 blur-xl opacity-60" />
    </div>

    {/* overlay children (markers) */}
    <div className="absolute inset-0 flex items-stretch justify-stretch">{children}</div>
  </section>
);
