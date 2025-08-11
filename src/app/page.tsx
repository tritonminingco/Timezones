/**
 * TeamTimezoneLanding.tsx
 *
 * A deployable landing page that displays Jorge's team timezone board
 * showing real-time local times for team members across different time zones.
 *
 * Features:
 * - Pre-loaded team members with their locations and timezones
 * - Real-time clock display for each member's local time
 * - Add additional team members if needed
 * - Professional landing page design
 * - Responsive layout for all devices
 * - SHARED DATABASE: All users see the same team members
 * - Auto-sync every 30 seconds
 *
 * Author: Jorge Pimentel
 * Created: August 2025
 *
 * Dependencies:
 * - React (hooks: useState, useEffect)
 * - Luxon (DateTime for timezone calculations)
 * - TailwindCSS (for styling)
 * - shadcn/ui components
 * - Vercel Blob (shared storage)
 */

"use client";

import { DateTime } from "luxon"; // Luxon library for robust date/time handling across timezones
import React, { useEffect, useState } from "react";
import { useTeamMembers } from "../hooks/useTeamMembers"; // Custom hook for shared database

// shadcn/ui components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Advanced CSS animations for enhanced UI experience
const advancedStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .shimmer-effect {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200px 100%;
    animation: shimmer 2s infinite;
  }
  
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }
`;

/**
 * Main TimezoneBoard component - Now with shared database
 * Manages the state and rendering of the team timezone dashboard
 * Data is shared between all users accessing the page
 */
const TimezoneBoard: React.FC = () => {
  // Shared database state using custom hook
  const { members, loading, error, addMember, removeMember, refreshMembers } =
    useTeamMembers();

  // Form state for adding new members
  const [name, setName] = useState(""); // Form input for new member's name
  const [location, setLocation] = useState(""); // Form input for location
  const [timezone, setTimezone] = useState("America/New_York"); // Default timezone

  // Time state
  const [currentTime, setCurrentTime] = useState(DateTime.now()); // Current time for real-time updates
  const [mounted, setMounted] = useState(false); // Track if component has mounted to prevent hydration issues

  // Handle mounting and real-time clock updates
  useEffect(() => {
    setMounted(true); // Component has mounted on client
    setCurrentTime(DateTime.now()); // Set initial time after mount

    // Inject advanced styles
    const styleElement = document.createElement("style");
    styleElement.textContent = advancedStyles;
    document.head.appendChild(styleElement);

    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000); // Update every second

    return () => {
      clearInterval(interval); // Cleanup on unmount
      // Cleanup styles on unmount
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  /**
   * Handles form submission to add a new team member to shared database
   * @param e - React form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Validation: ensure name, location and timezone are provided
    if (!name || !location || !timezone) return;

    // Add member to shared database
    const success = await addMember({
      name,
      location,
      timezone,
      flag: "🌍", // Default flag for new members
    });

    if (success) {
      // Reset form fields after successful submission
      setName("");
      setLocation("");
      setTimezone("America/New_York"); // Reset to default
    }
  };

  /**
   * Removes a team member from the shared database
   * @param id - Unique identifier of the user to remove
   */
  const handleDelete = async (id: number) => {
    await removeMember(id);
  };

  // Show loading state
  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-neutral-200 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center p-12">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-neutral-200 border-t-neutral-600 animate-spin mb-6"></div>
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-neutral-400 animate-ping"></div>
            </div>
            <div className="space-y-3 text-center">
              <Skeleton className="h-5 w-56 bg-neutral-200 mx-auto" />
              <Skeleton className="h-3 w-32 bg-neutral-100 mx-auto" />
            </div>
            <p className="text-neutral-600 text-sm mt-4 animate-pulse">
              Loading team timezone board...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // JSX return - The landing page UI structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-4 md:p-8">
      {/* Main container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
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
                {mounted
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

              <Button
                variant="outline"
                size="lg"
                onClick={refreshMembers}
                disabled={loading}
                className="border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="mr-2">🔄</span>
                Refresh Data
              </Button>

              <div className="text-xs text-neutral-500 bg-neutral-100/60 px-4 py-2 rounded-lg">
                <span className="font-medium">{members.length}</span> team
                member{members.length !== 1 ? "s" : ""} online
              </div>
            </div>{" "}
            {/* Error display */}
            {error && (
              <Alert className="mt-4 max-w-md mx-auto">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
        </Card>

        {/* Team Members Display - Main Feature */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((member, index) => {
            // Calculate the current local time for this user's timezone using Luxon
            const localTime = mounted
              ? currentTime.setZone(member.timezone)
              : null;
            const isWorkingHours = localTime
              ? localTime.hour >= 9 && localTime.hour <= 17
              : false;

            return (
              <Card
                key={member.id}
                className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 transform hover:scale-105 ${
                  isWorkingHours
                    ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200 shadow-emerald-100 hover:shadow-emerald-200"
                    : "bg-gradient-to-br from-white via-neutral-50 to-slate-50 border-neutral-200 shadow-neutral-100 hover:shadow-neutral-200"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: mounted
                    ? `fadeInUp 0.6s ease-out forwards`
                    : "none",
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
                          isWorkingHours
                            ? "border-emerald-300"
                            : "border-neutral-300"
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
                      {mounted && localTime ? localTime.offsetNameShort : "--"}{" "}
                      • {member.timezone}
                    </div>
                  </div>

                  {/* Enhanced Working Hours Status */}
                  <div className="flex items-center justify-between">
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

                    {/* Enhanced Remove Button */}
                    {members.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 h-auto border-2 border-transparent hover:border-red-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <span className="text-sm font-medium">Remove</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Team Member Form */}
        <Card className="relative overflow-hidden shadow-2xl border-2 border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-slate-50 hover:shadow-3xl transition-all duration-500">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-600 via-transparent to-neutral-600 transform -skew-y-3"></div>
          </div>

          <CardHeader className="pb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-lg">
                <span className="text-2xl">➕</span>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                  Add New Team Member
                </CardTitle>
                <p className="text-neutral-600 text-sm mt-1 font-medium">
                  Expand your global team collaboration
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Enhanced Name input field */}
                <div className="group space-y-3">
                  <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Maria Rodriguez"
                      required
                      disabled={loading}
                      className="border-2 border-neutral-300 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 bg-white transition-all duration-300 hover:border-neutral-400 px-4 py-3 font-medium"
                    />
                    <div className="absolute inset-0 border-2 border-transparent rounded-md group-hover:border-neutral-200 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Enhanced Location input field */}
                <div className="group space-y-3">
                  <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                    Location
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Tokyo, Japan"
                      required
                      disabled={loading}
                      className="border-2 border-neutral-300 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 bg-white transition-all duration-300 hover:border-neutral-400 px-4 py-3 font-medium"
                    />
                    <div className="absolute inset-0 border-2 border-transparent rounded-md group-hover:border-neutral-200 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Enhanced Timezone input field */}
                <div className="group space-y-3">
                  <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                    Timezone
                  </label>
                  <div className="relative">
                    <Select
                      value={timezone}
                      onValueChange={setTimezone}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full border-2 border-neutral-300 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 bg-white transition-all duration-300 hover:border-neutral-400 px-4 py-3 font-medium h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectGroup>
                          <SelectItem value="America/New_York">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="America/Chicago">
                            Central Time (CT)
                          </SelectItem>
                          <SelectItem value="America/Denver">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            Pacific Time (PT)
                          </SelectItem>
                          <SelectItem value="America/Anchorage">
                            Alaska Time (AKT)
                          </SelectItem>
                          <SelectItem value="Pacific/Honolulu">
                            Hawaii Time (HST)
                          </SelectItem>
                          <SelectItem value="America/Toronto">
                            Toronto, Canada
                          </SelectItem>
                          <SelectItem value="America/Vancouver">
                            Vancouver, Canada
                          </SelectItem>
                          <SelectItem value="America/Montreal">
                            Montreal, Canada
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectItem value="America/Mexico_City">
                            Mexico City, Mexico
                          </SelectItem>
                          <SelectItem value="America/Guatemala">
                            Guatemala City, Guatemala
                          </SelectItem>
                          <SelectItem value="America/Bogota">
                            Bogotá, Colombia
                          </SelectItem>
                          <SelectItem value="America/Lima">
                            Lima, Peru
                          </SelectItem>
                          <SelectItem value="America/Santiago">
                            Santiago, Chile
                          </SelectItem>
                          <SelectItem value="America/Buenos_Aires">
                            Buenos Aires, Argentina
                          </SelectItem>
                          <SelectItem value="America/Sao_Paulo">
                            São Paulo, Brazil
                          </SelectItem>
                          <SelectItem value="America/Caracas">
                            Caracas, Venezuela
                          </SelectItem>
                          <SelectItem value="America/Panama">
                            Panama City, Panama
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectItem value="Europe/London">
                            London, UK
                          </SelectItem>
                          <SelectItem value="Europe/Dublin">
                            Dublin, Ireland
                          </SelectItem>
                          <SelectItem value="Europe/Paris">
                            Paris, France
                          </SelectItem>
                          <SelectItem value="Europe/Berlin">
                            Berlin, Germany
                          </SelectItem>
                          <SelectItem value="Europe/Rome">
                            Rome, Italy
                          </SelectItem>
                          <SelectItem value="Europe/Madrid">
                            Madrid, Spain
                          </SelectItem>
                          <SelectItem value="Europe/Amsterdam">
                            Amsterdam, Netherlands
                          </SelectItem>
                          <SelectItem value="Europe/Brussels">
                            Brussels, Belgium
                          </SelectItem>
                          <SelectItem value="Europe/Zurich">
                            Zurich, Switzerland
                          </SelectItem>
                          <SelectItem value="Europe/Vienna">
                            Vienna, Austria
                          </SelectItem>
                          <SelectItem value="Europe/Prague">
                            Prague, Czech Republic
                          </SelectItem>
                          <SelectItem value="Europe/Warsaw">
                            Warsaw, Poland
                          </SelectItem>
                          <SelectItem value="Europe/Budapest">
                            Budapest, Hungary
                          </SelectItem>
                          <SelectItem value="Europe/Bucharest">
                            Bucharest, Romania
                          </SelectItem>
                          <SelectItem value="Europe/Athens">
                            Athens, Greece
                          </SelectItem>
                          <SelectItem value="Europe/Stockholm">
                            Stockholm, Sweden
                          </SelectItem>
                          <SelectItem value="Europe/Oslo">
                            Oslo, Norway
                          </SelectItem>
                          <SelectItem value="Europe/Copenhagen">
                            Copenhagen, Denmark
                          </SelectItem>
                          <SelectItem value="Europe/Helsinki">
                            Helsinki, Finland
                          </SelectItem>
                          <SelectItem value="Europe/Riga">
                            Riga, Latvia
                          </SelectItem>
                          <SelectItem value="Europe/Tallinn">
                            Tallinn, Estonia
                          </SelectItem>
                          <SelectItem value="Europe/Vilnius">
                            Vilnius, Lithuania
                          </SelectItem>
                          <SelectItem value="Europe/Kiev">
                            Kiev, Ukraine
                          </SelectItem>
                          <SelectItem value="Europe/Moscow">
                            Moscow, Russia
                          </SelectItem>
                          <SelectItem value="Europe/Istanbul">
                            Istanbul, Turkey
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectItem value="Africa/Cairo">
                            Cairo, Egypt
                          </SelectItem>
                          <SelectItem value="Africa/Lagos">
                            Lagos, Nigeria
                          </SelectItem>
                          <SelectItem value="Africa/Nairobi">
                            Nairobi, Kenya
                          </SelectItem>
                          <SelectItem value="Africa/Johannesburg">
                            Johannesburg, South Africa
                          </SelectItem>
                          <SelectItem value="Africa/Casablanca">
                            Casablanca, Morocco
                          </SelectItem>
                          <SelectItem value="Africa/Tunis">
                            Tunis, Tunisia
                          </SelectItem>
                          <SelectItem value="Africa/Algiers">
                            Algiers, Algeria
                          </SelectItem>
                          <SelectItem value="Africa/Accra">
                            Accra, Ghana
                          </SelectItem>
                          <SelectItem value="Africa/Addis_Ababa">
                            Addis Ababa, Ethiopia
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectItem value="Asia/Tokyo">
                            Tokyo, Japan
                          </SelectItem>
                          <SelectItem value="Asia/Seoul">
                            Seoul, South Korea
                          </SelectItem>
                          <SelectItem value="Asia/Shanghai">
                            Shanghai, China
                          </SelectItem>
                          <SelectItem value="Asia/Beijing">
                            Beijing, China
                          </SelectItem>
                          <SelectItem value="Asia/Hong_Kong">
                            Hong Kong
                          </SelectItem>
                          <SelectItem value="Asia/Taipei">
                            Taipei, Taiwan
                          </SelectItem>
                          <SelectItem value="Asia/Singapore">
                            Singapore
                          </SelectItem>
                          <SelectItem value="Asia/Bangkok">
                            Bangkok, Thailand
                          </SelectItem>
                          <SelectItem value="Asia/Ho_Chi_Minh">
                            Ho Chi Minh City, Vietnam
                          </SelectItem>
                          <SelectItem value="Asia/Jakarta">
                            Jakarta, Indonesia
                          </SelectItem>
                          <SelectItem value="Asia/Manila">
                            Manila, Philippines
                          </SelectItem>
                          <SelectItem value="Asia/Kuala_Lumpur">
                            Kuala Lumpur, Malaysia
                          </SelectItem>
                          <SelectItem value="Asia/Kolkata">
                            Mumbai, India
                          </SelectItem>
                          <SelectItem value="Asia/Delhi">
                            Delhi, India
                          </SelectItem>
                          <SelectItem value="Asia/Dhaka">
                            Dhaka, Bangladesh
                          </SelectItem>
                          <SelectItem value="Asia/Karachi">
                            Karachi, Pakistan
                          </SelectItem>
                          <SelectItem value="Asia/Kabul">
                            Kabul, Afghanistan
                          </SelectItem>
                          <SelectItem value="Asia/Tehran">
                            Tehran, Iran
                          </SelectItem>
                          <SelectItem value="Asia/Dubai">Dubai, UAE</SelectItem>
                          <SelectItem value="Asia/Riyadh">
                            Riyadh, Saudi Arabia
                          </SelectItem>
                          <SelectItem value="Asia/Kuwait">
                            Kuwait City, Kuwait
                          </SelectItem>
                          <SelectItem value="Asia/Baghdad">
                            Baghdad, Iraq
                          </SelectItem>
                          <SelectItem value="Asia/Jerusalem">
                            Jerusalem, Israel
                          </SelectItem>
                          <SelectItem value="Asia/Beirut">
                            Beirut, Lebanon
                          </SelectItem>
                          <SelectItem value="Asia/Damascus">
                            Damascus, Syria
                          </SelectItem>
                          <SelectItem value="Asia/Amman">
                            Amman, Jordan
                          </SelectItem>
                          <SelectItem value="Asia/Baku">
                            Baku, Azerbaijan
                          </SelectItem>
                          <SelectItem value="Asia/Yerevan">
                            Yerevan, Armenia
                          </SelectItem>
                          <SelectItem value="Asia/Tbilisi">
                            Tbilisi, Georgia
                          </SelectItem>
                          <SelectItem value="Asia/Almaty">
                            Almaty, Kazakhstan
                          </SelectItem>
                          <SelectItem value="Asia/Tashkent">
                            Tashkent, Uzbekistan
                          </SelectItem>
                          <SelectItem value="Asia/Novosibirsk">
                            Novosibirsk, Russia
                          </SelectItem>
                          <SelectItem value="Asia/Vladivostok">
                            Vladivostok, Russia
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectItem value="Australia/Sydney">
                            Sydney, Australia
                          </SelectItem>
                          <SelectItem value="Australia/Melbourne">
                            Melbourne, Australia
                          </SelectItem>
                          <SelectItem value="Australia/Brisbane">
                            Brisbane, Australia
                          </SelectItem>
                          <SelectItem value="Australia/Perth">
                            Perth, Australia
                          </SelectItem>
                          <SelectItem value="Australia/Adelaide">
                            Adelaide, Australia
                          </SelectItem>
                          <SelectItem value="Australia/Darwin">
                            Darwin, Australia
                          </SelectItem>
                          <SelectItem value="Pacific/Auckland">
                            Auckland, New Zealand
                          </SelectItem>
                          <SelectItem value="Pacific/Wellington">
                            Wellington, New Zealand
                          </SelectItem>
                          <SelectItem value="Pacific/Fiji">
                            Suva, Fiji
                          </SelectItem>
                          <SelectItem value="Pacific/Guam">Guam</SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectItem value="Atlantic/Reykjavik">
                            Reykjavik, Iceland
                          </SelectItem>
                          <SelectItem value="Atlantic/Azores">
                            Azores, Portugal
                          </SelectItem>
                          <SelectItem value="Atlantic/Cape_Verde">
                            Cape Verde
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 border-2 border-transparent rounded-md group-hover:border-neutral-200 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit button */}
              <div className="pt-8 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold px-12 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-neutral-400"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                  <span className="relative z-10 flex items-center gap-3 text-lg">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">✅</span>
                        Add Team Member
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="mt-8 border-0 bg-gradient-to-r from-neutral-100 to-neutral-200 shadow-lg">
          <CardContent className="text-center py-6">
            <p className="text-neutral-600 text-sm font-medium">
              Built with ❤️ by Jorge Pimentel and Phillip • Updated in real-time
              • Shared across all users
            </p>
            <p className="text-neutral-500 text-xs mt-2">
              Powered by Vercel Blob Storage
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Export the component as default for use in other files
export default TimezoneBoard;
