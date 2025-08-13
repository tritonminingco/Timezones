"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DateTime } from "luxon";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  active: boolean;
  created_at: string;
  created_by_email?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  session: Session | null;
  currentTime: DateTime;
  mounted: boolean;
  onRemove: (id: number) => void;
  index?: number;
}

export function TeamMemberCard({
  member,
  session,
  currentTime,
  mounted,
  onRemove,
  index = 0,
}: TeamMemberCardProps) {
  const [localTime, setLocalTime] = useState<DateTime | null>(null);

  useEffect(() => {
    if (mounted && currentTime) {
      setLocalTime(currentTime.setZone(member.timezone));
    }
  }, [currentTime, member.timezone, mounted]);

  // Check if member is in working hours (9 AM - 5 PM local time)
  const isWorkingHours = localTime
    ? localTime.hour >= 9 && localTime.hour <= 17
    : false;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 transform hover:scale-105 ${
        isWorkingHours
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200 shadow-emerald-100 hover:shadow-emerald-200"
          : "bg-gradient-to-br from-white via-neutral-50 to-slate-50 border-neutral-200 shadow-neutral-100 hover:shadow-neutral-200"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: mounted ? `fadeInUp 0.6s ease-out forwards` : "none",
      }}
    >
      {/* Animated background glow */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isWorkingHours
            ? "bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-teal-400/10"
            : "bg-gradient-to-r from-neutral-400/5 via-slate-400/5 to-zinc-400/5"
        }`}
      ></div>

      {/* Animated corner accent */}
      <div
        className={`absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8 transition-all duration-500 group-hover:scale-150 ${
          isWorkingHours ? "bg-emerald-300/20" : "bg-neutral-300/20"
        }`}
      ></div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <Avatar
              className={`h-14 w-14 border-3 shadow-xl transition-all duration-500 group-hover:scale-110 ${
                isWorkingHours ? "border-emerald-300" : "border-neutral-300"
              }`}
            >
              <AvatarFallback
                className={`text-2xl font-bold bg-gradient-to-br flex items-center justify-center ${
                  isWorkingHours
                    ? "from-emerald-100 to-green-200 text-emerald-800"
                    : "from-neutral-100 to-neutral-200 text-neutral-700"
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  textAlign: "center" as const,
                }}
              >
                <span className="w-full pb-1.5 h-full flex items-center justify-center leading-none">
                  {member.flag}
                </span>
              </AvatarFallback>
            </Avatar>
            {/* Enhanced Status pulse indicator */}
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                isWorkingHours ? "bg-emerald-500" : "bg-neutral-400"
              } ${isWorkingHours ? "animate-pulse" : ""}`}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight text-neutral-800 font-bold group-hover:text-neutral-900 transition-colors">
              {member.name}
            </CardTitle>
            <p className="text-sm text-neutral-600 truncate font-medium group-hover:text-neutral-700 transition-colors">
              {member.location}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 relative z-10">
        {/* Time Display with enhanced styling */}
        <div className="space-y-4 mb-6 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-neutral-200/50">
          <div
            className={`text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r ${
              isWorkingHours
                ? "from-emerald-700 to-green-600"
                : "from-neutral-800 to-neutral-600"
            } bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
          >
            {mounted && localTime ? (
              <span className="tracking-wide">
                {localTime.toFormat("h:mm:ss a")}
              </span>
            ) : (
              <Skeleton className="h-10 w-40 bg-neutral-200" />
            )}
          </div>
          <div className="text-sm text-neutral-600 font-medium">
            {mounted && localTime ? (
              localTime.toFormat("cccc, MMMM dd")
            ) : (
              <Skeleton className="h-4 w-32 bg-neutral-200" />
            )}
          </div>
          <div
            className={`text-xs font-medium px-3 py-2 rounded-full inline-block border ${
              isWorkingHours
                ? "text-emerald-700 bg-emerald-100/80 border-emerald-200"
                : "text-neutral-600 bg-neutral-100/80 border-neutral-200"
            }`}
          >
            {mounted && localTime ? localTime.offsetNameShort : "--"} •{" "}
            {member.timezone}
          </div>
        </div>

        {/* Enhanced Working Hours Status and Control Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge
              variant={isWorkingHours ? "default" : "secondary"}
              className={`gap-2 text-xs font-bold px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                isWorkingHours
                  ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-300 shadow-lg shadow-emerald-200/50"
                  : "bg-gradient-to-r from-neutral-100 to-slate-100 text-neutral-700 border-neutral-300 shadow-lg shadow-neutral-200/50"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isWorkingHours
                    ? "bg-emerald-500 shadow-lg shadow-emerald-400/50 animate-pulse"
                    : "bg-neutral-400 shadow-lg shadow-neutral-300/50"
                }`}
              ></div>
              {mounted
                ? isWorkingHours
                  ? "Active Hours"
                  : "Off Hours"
                : "Loading..."}
            </Badge>
          </div>

          {/* Creator indicator and online status */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            {member.created_by_email === session?.user?.email && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                Your Member
              </Badge>
            )}

            {/* Online/Offline status - Shows if creator is currently logged in */}
            <Badge
              variant="outline"
              className={`text-xs ${
                member.created_by_email === session?.user?.email
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {member.created_by_email === session?.user?.email ? (
                <>🟢 Online</>
              ) : (
                <>⚫ Offline</>
              )}
            </Badge>

            {/* Enhanced Remove Button - Only show for admin or creator */}
            {(session?.user?.role === "admin" ||
              member.created_by_email === session?.user?.email) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(member.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 h-auto border-2 border-transparent hover:border-red-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="text-sm font-medium">
                  {session?.user?.role === "admin" ? "Admin Delete" : "Delete"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
