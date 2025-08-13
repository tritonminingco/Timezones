"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTime } from "luxon";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface TimezoneHeaderProps {
  session: Session | null;
  memberCount: number;
  currentTime?: DateTime;
  mounted?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
}

export function TimezoneHeader({
  session,
  memberCount,
  currentTime,
  mounted = false,
  loading = false,
  onRefresh,
}: TimezoneHeaderProps) {
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-neutral-50 to-neutral-100 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full translate-x-12 translate-y-12"></div>

      <CardHeader className="text-center pb-8 px-8 pt-12 relative">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            {/* Triton Logo */}
            <div className="relative">
              <Image
                src="/triton-logo.png"
                alt="Triton Logo"
                width={80}
                height={80}
                className="drop-shadow-lg hover:scale-110 transition-transform duration-300"
                priority
                unoptimized
              />
            </div>
            <CardTitle className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent tracking-tight">
              Triton&apos;s Team
            </CardTitle>
          </div>
          <CardTitle className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Timezone Dashboard
          </CardTitle>
        </div>
        <p className="text-neutral-600 text-xl md:text-2xl font-medium mt-6 leading-relaxed">
          Real-time collaboration across continents
        </p>
        <div className="mt-8 inline-flex items-center gap-2 text-sm text-neutral-500 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-neutral-200/60 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Live updates every second</span>
          <span className="text-neutral-400">•</span>
          <span>
            {mounted && currentTime
              ? currentTime.toFormat("MMMM dd, yyyy 'at' h:mm:ss a")
              : "Loading..."}{" "}
            UTC
          </span>
        </div>
        {/* Database status indicator */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Badge
            variant={loading ? "secondary" : "default"}
            className={`gap-3 px-6 py-3 font-semibold text-sm transition-all duration-300 ${
              loading
                ? "bg-amber-100 text-amber-800 border-amber-300 shadow-amber-100"
                : "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-emerald-100"
            } shadow-lg hover:shadow-xl`}
          >
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full ${
                  loading ? "bg-amber-500" : "bg-emerald-500"
                }`}
              ></div>
              {!loading && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-30"></div>
              )}
            </div>
            {loading ? "Syncing data..." : "Connected & Live"}
          </Badge>

          {onRefresh && (
            <Button
              variant="outline"
              size="lg"
              onClick={onRefresh}
              disabled={loading}
              className="border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">🔄</span>
              Refresh Data
            </Button>
          )}

          <div className="text-xs text-neutral-500 bg-neutral-100/60 px-4 py-2 rounded-lg">
            <span className="font-medium">{memberCount}</span> team member
            {memberCount !== 1 ? "s" : ""} online
          </div>
        </div>
        {/* User Profile Section */}
        <div className="mt-6 flex items-center justify-center gap-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-neutral-200/60">
          <Avatar className="h-10 w-10">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold text-neutral-700">
              Welcome, {session?.user?.name || session?.user?.email}
              {session?.user?.role === "admin" && (
                <Badge className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  ADMIN
                </Badge>
              )}
            </p>
            <p className="text-neutral-500 text-xs">
              Signed in with {session?.user?.provider || "OAuth"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="ml-auto"
          >
            Sign Out
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
