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
    <Card className="border bg-slate-900 text-white shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] mix-blend-overlay"></div>

      <CardHeader className="text-center pb-6 px-6 pt-8 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <Image
                src="/triton-logo.png"
                alt="Triton Logo"
                width={64}
                height={64}
                className="transition-transform duration-200"
                priority
                unoptimized
              />
            </div>
            <div className="text-left">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Triton&apos;s Global Ops Clock
              </CardTitle>
              <div className="text-sm text-slate-300 mt-0.5">Live team clockboard — stay in sync across timezones</div>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-3 text-sm text-slate-200 bg-slate-800/60 px-4 py-2 rounded-full border border-slate-700 shadow-sm">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            <div className="font-medium text-white">Live</div>
            <div className="text-slate-300">•</div>
            <div>
              {mounted && currentTime ? (
                <>
                  <span className="font-semibold text-white">{currentTime.toFormat("h:mm:ss a")}</span>
                  <span className="ml-2 text-xs text-slate-300">({currentTime.offsetNameShort})</span>
                </>
              ) : (
                <span className="text-slate-300">Loading…</span>
              )}
            </div>
            <div className="text-slate-300">•</div>
            <div className="text-xs text-slate-300">UTC {mounted && currentTime ? currentTime.toUTC().toFormat('h:mm a') : '--:--'}</div>
          </div>
        </div>

        {/* Controls / status */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 px-6 pb-6">
          <Badge
            variant={loading ? "secondary" : "default"}
            className={`gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              loading
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-emerald-900/40 text-emerald-300 border-emerald-800"
            } shadow-sm`}
          >
            <div className="relative">
              <div className={`w-2.5 h-2.5 rounded-full ${loading ? "bg-amber-500" : "bg-emerald-400"}`}></div>
              {!loading && <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-20"></div>}
            </div>
            {loading ? "Syncing data..." : "Connected & Live"}
          </Badge>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 shadow-sm transition-all duration-150"
            >
              Refresh
            </Button>
          )}

          <div className="text-xs text-slate-300 bg-slate-800/40 px-3 py-1 rounded-md">
            <span className="font-medium text-white">{memberCount}</span> member{memberCount !== 1 ? "s" : ""}
            &nbsp;•&nbsp;{Math.max(1, Math.round(memberCount * 0.8))} active
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-6 pb-8">
          <div className="mt-2 flex items-center justify-center gap-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700">
            <Avatar className="h-9 w-9">
              {session?.user?.image ? (
                <Image src={session.user.image} alt={session.user.name || "User"} width={36} height={36} className="rounded-full" />
              ) : (
                <AvatarFallback className="bg-indigo-600 text-white font-semibold">{session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-white">
                Welcome, {session?.user?.name || session?.user?.email}
                {session?.user?.role === "admin" && (
                  <Badge className="ml-2 bg-red-600 text-white">ADMIN</Badge>
                )}
              </p>
              <p className="text-slate-300 text-xs">Signed in with {session?.user?.provider || "OAuth"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/auth/signin" })} className="ml-auto">Sign Out</Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
