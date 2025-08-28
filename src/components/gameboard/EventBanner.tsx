import React from "react";

interface EventBannerProps {
  event: string;
  location?: string;
}

export const EventBanner: React.FC<EventBannerProps> = ({ event, location }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 rounded-md px-4 py-2 shadow-md flex items-center gap-3">
    <img src="/triton-logo.png" alt="Triton" className="w-6 h-6" />
    <div className="flex flex-col">
      <div className="text-sm font-semibold text-white">Triton&apos;s Global Ops Clock</div>
      {event && <div className="text-xs text-slate-300">{event}{location ? ` • ${location}` : ''}</div>}
    </div>
  </div>
);
