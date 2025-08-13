"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateTime } from "luxon";
import { Session } from "next-auth";

interface TeamMember {
  id: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  created_by_email?: string;
}

interface MemberCardProps {
  member: TeamMember;
  currentTime: DateTime;
  session: Session | null;
  onRemove: (id: number) => void;
}

export function MemberCard({
  member,
  currentTime,
  session,
  onRemove,
}: MemberCardProps) {
  const memberTime = currentTime.setZone(member.timezone);
  const timeString = memberTime.toFormat("h:mm:ss a");
  const dateString = memberTime.toFormat("cccc, LLL dd");

  // Determine if it's business hours (9 AM - 6 PM)
  const hour = memberTime.hour;
  const isBusinessHours = hour >= 9 && hour < 18;
  const isWeekend = memberTime.weekday > 5;

  // Status logic
  const isCreator = member.created_by_email === session?.user?.email;
  const isOnline = isCreator; // Creator is online if they're currently logged in

  // Permission logic
  const canDelete = session?.user?.role === "admin" || isCreator;

  return (
    <Card className="group relative overflow-hidden shadow-lg border-2 border-neutral-200 bg-gradient-to-br from-white to-neutral-50 hover:shadow-2xl hover:border-neutral-300 transition-all duration-500 transform hover:scale-[1.02]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neutral-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Status indicator */}
      <div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        } shadow-lg`}
      ></div>

      <CardContent className="p-6 relative z-10">
        <div className="space-y-4">
          {/* Header with flag and name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow-lg">
                {member.flag}
              </span>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                  {member.name}
                </h3>
                <p className="text-neutral-600 text-sm font-medium">
                  {member.location}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-1">
              {isCreator && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  Your Member
                </Badge>
              )}
              {isOnline && (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  Online
                </Badge>
              )}
            </div>
          </div>

          {/* Time display */}
          <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-xl p-4 shadow-inner">
            <div className="text-center space-y-1">
              <div className="text-3xl font-black text-neutral-800 font-mono tracking-wider">
                {timeString}
              </div>
              <div className="text-sm text-neutral-600 font-semibold uppercase tracking-wide">
                {dateString}
              </div>
              <div className="text-xs text-neutral-500 font-medium">
                {member.timezone.replace("_", " ")}
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex justify-center gap-2">
            {isBusinessHours && !isWeekend && (
              <Badge className="bg-green-100 text-green-800 border-green-300 text-xs font-bold">
                🟢 Business Hours
              </Badge>
            )}
            {!isBusinessHours && !isWeekend && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-bold">
                🟡 After Hours
              </Badge>
            )}
            {isWeekend && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs font-bold">
                🔵 Weekend
              </Badge>
            )}
          </div>

          {/* Delete button */}
          {canDelete && (
            <div className="pt-2">
              <Button
                onClick={() => onRemove(member.id)}
                variant="destructive"
                size="sm"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-sm">🗑️ Remove</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
