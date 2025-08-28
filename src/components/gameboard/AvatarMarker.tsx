import React from "react";

interface AvatarMarkerProps {
  x: number; // percent (0-100)
  y: number; // percent (0-100)
  avatarUrl: string;
  name: string;
  weatherIcon?: string;
  trophy?: boolean;
  streak?: number;
  event?: string;
}

export const AvatarMarker: React.FC<AvatarMarkerProps> = ({
  x,
  y,
  avatarUrl,
  name,
  weatherIcon,
  trophy,
  streak,
  event,
}) => (
  <div
  className="absolute flex flex-col items-center pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
  >
    <div className="relative">
      <img
        src={avatarUrl}
        alt={name}
    className="w-12 h-12 rounded-full ring-1 ring-slate-700 shadow-sm bg-slate-800"
      />
      {weatherIcon && (
    <span className="absolute -top-2 -right-2 text-xs bg-slate-700 text-slate-200 rounded-full px-1.5 py-0.5 shadow-sm">
          {weatherIcon}
        </span>
      )}
      {trophy && (
        <span className="absolute -bottom-2 -right-2 text-xs bg-amber-50 text-amber-700 rounded-full px-1.5 py-0.5 shadow-sm">
          ★
        </span>
      )}
    </div>
  <span className="text-xs font-medium bg-slate-900/85 text-white rounded px-2 py-0.5 mt-1">
      {name}
    </span>
    {streak && streak > 1 && (
      <span className="text-[10px] mt-1 bg-amber-100 text-amber-800 rounded px-1.5 py-0.5">{`+${streak}`}</span>
    )}
    {event && (
      <span className="text-xs mt-0.5 text-slate-700 bg-rose-50 px-2 py-0.5 rounded">{event}</span>
    )}
  </div>
);
