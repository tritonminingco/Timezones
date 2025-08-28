"use client";

import React, { useMemo } from "react";
import { EventBanner } from "./EventBanner";
import { TeamMemberCard } from "./TeamMemberCard";
import { SignUpForm } from "./SignUpForm";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { getCoordsForLocation } from "@/lib/utils/map";

// Weather icons by timezone
const weatherIcons: Record<string, string> = {
  "America/New_York": "⛅️",
  "Europe/London": "🌧️",
  "Asia/Tokyo": "☀️",
  "Australia/Sydney": "🌩️",
};

const randomEvents = [
  { event: "🌪️ Storm rolls in!", location: "London" },
  { event: "☀️ Double XP hour!", location: "Tokyo" },
  { event: "🎉 Bonus Streak!", location: "New York" },
];

export const GameBoard: React.FC = () => {
  const { members } = useTeamMembers();
  // Pick a random event for demo
  const event = useMemo(() => {
    const idx = Math.floor(Math.random() * randomEvents.length);
    return randomEvents[idx];
  }, []);

  // cityCoords replaced by simple projection util (approximate)

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">Triton&apos;s Global Ops Clock</h1>
      </div>
      {/* Decorative map header */}
      <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg mb-8">
        <img
          src="/world-map.svg"
          alt="World Map"
          className="w-full h-full object-cover opacity-80"
          draggable={false}
        />
      </div>
      {/* Event banner */}
      <EventBanner event={event.event} location={event.location} />
  {/* Team member cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {members.map((member) => {
          const coords = getCoordsForLocation(member.location || member.timezone);
          return (
            <TeamMemberCard
              key={member.id}
              name={member.name}
              location={member.location}
              timezone={member.timezone}
              avatarUrl={member.creator_avatar || "/avatar-placeholder.png"}
              weatherIcon={weatherIcons[member.timezone]}
              streak={1}
              trophy={false}
              event={event.location === member.location ? event.event : undefined}
              mapX={coords?.x}
              mapY={coords?.y}
            />
          );
        })}
      </div>
      {/* Signup form (placed at the bottom) */}
      <div className="mt-6 flex justify-center">
        <SignUpForm />
      </div>
    </div>
  );
};
