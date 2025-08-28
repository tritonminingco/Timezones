"use client";

import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface TeamMemberCardProps {
  name: string;
  location: string;
  timezone: string;
  avatarUrl: string;
  weatherIcon?: string;
  streak?: number;
  trophy?: boolean;
  event?: string;
  work_start?: string; // HH:mm
  work_end?: string; // HH:mm
  mapX?: number; // 0-100 percent
  mapY?: number; // 0-100 percent
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  location,
  timezone,
  avatarUrl,
  weatherIcon,
  streak,
  trophy,
  event,
  work_start,
  work_end,
  mapX,
  mapY,
}) => {
  const [now, setNow] = useState(DateTime.now().setZone(timezone));

  useEffect(() => {
    const t = setInterval(() => {
      setNow(DateTime.now().setZone(timezone));
    }, 1000);
    return () => clearInterval(t);
  }, [timezone]);

  const formatTime = (dt: DateTime) => dt.toFormat("h:mm:ss a");

  const inWorkingHours = () => {
    if (!work_start || !work_end) return null;
    const start = DateTime.fromFormat(work_start, "HH:mm", { zone: timezone });
    const end = DateTime.fromFormat(work_end, "HH:mm", { zone: timezone });
    // handle overnight ranges
    if (end <= start) {
      return now >= start || now <= end;
    }
    return now >= start && now <= end;
  };

  const working = inWorkingHours();

  return (
  <div className="bg-slate-800 text-white rounded-lg shadow-sm p-5 flex flex-col items-center gap-3 relative border border-slate-700 hover:shadow-md transition-all duration-200">
      <div className="relative mb-2">
          <img
            src={avatarUrl}
            alt={name}
            className="w-16 h-16 rounded-full ring-1 ring-slate-700 shadow-sm bg-slate-700"
          />
        {weatherIcon && (
          <span className="absolute -top-2 -right-2 text-sm bg-slate-700 text-slate-200 rounded-full px-2 py-0.5 shadow-sm">
            {weatherIcon}
          </span>
        )}
        {trophy && (
          <span className="absolute -bottom-2 -right-2 text-xs bg-amber-700 text-white rounded-full px-2 py-0.5 shadow-sm">★</span>
        )}
      </div>
      {/* small country map thumbnail */}
      <div className="w-28 h-16 rounded overflow-hidden relative mt-2 shadow-inner border border-slate-700">
        <img src="/world-map.svg" alt="map" className="absolute inset-0 w-full h-full object-cover filter grayscale brightness-75 opacity-70" draggable={false} />
        {typeof mapX === 'number' && typeof mapY === 'number' ? (
          <span
            className="absolute w-2.5 h-2.5 bg-amber-400 rounded-full shadow-sm ring-1 ring-slate-800"
            style={{ left: `${mapX}%`, top: `${mapY}%`, transform: 'translate(-50%, -50%)' }}
          />
        ) : (
          <div className="absolute left-2 top-2 text-sm text-slate-500">{/* fallback: could show flag emoji */}</div>
        )}
      </div>
      <div className="text-center">
  <div className="font-semibold text-lg text-white">{name}</div>
  <div className="text-sm text-slate-300">{location}</div>
  <div className="text-xs text-slate-400">{timezone}</div>

        <div className="mt-2 text-sm">
          <div className="font-mono text-lg">{formatTime(now)}</div>
          {(() => {
            if (working === null) return <div className="text-xs text-slate-400">Working hours not set</div>;
            if (working) return <div className="text-xs text-emerald-400 font-medium">Working now</div>;
            return <div className="text-xs text-slate-500">Outside working hours</div>;
          })()}
          {work_start && work_end && (
            <div className="text-xs text-slate-400">{DateTime.fromFormat(work_start, 'HH:mm', { zone: timezone }).toFormat('h:mm a')} - {DateTime.fromFormat(work_end, 'HH:mm', { zone: timezone }).toFormat('h:mm a')}</div>
          )}
        </div>

        {streak && streak > 1 && (
          <div className="text-xs text-amber-400 font-medium mt-1">{streak} day streak</div>
        )}
        {event && (
          <div className="text-xs mt-1 text-slate-900 bg-rose-300/70 px-2 py-0.5 rounded-sm inline-block">{event}</div>
        )}
      </div>
    </div>
  );
};
