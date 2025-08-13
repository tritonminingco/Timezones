/**
 * Simplified TimezoneBoard - Component-based architecture
 *
 * Broken down into smaller, manageable components for better maintainability
 */

"use client";

import { AddMemberForm } from "@/components/timezone/AddMemberForm";
import { TeamMemberCard } from "@/components/timezone/TeamMemberCard";
import { TimezoneHeader } from "@/components/timezone/TimezoneHeader";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTeamMembers } from "../hooks/useTeamMembers";

// shadcn/ui components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TimezoneBoard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Shared database state using custom hook
  const { members, loading, error, addMember, removeMember } = useTeamMembers();

  // Time state
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [mounted, setMounted] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Handle mounting and real-time clock updates
  useEffect(() => {
    setMounted(true);
    setCurrentTime(DateTime.now());

    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle member removal
  const handleRemoveMember = async (id: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      await removeMember(id);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-6 p-8">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">
            Loading your dashboard...
          </h2>
          <p className="text-neutral-300">
            Please wait while we authenticate you
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <TimezoneHeader
          session={session}
          memberCount={members.length}
          currentTime={currentTime}
          mounted={mounted}
          loading={loading}
        />

        {/* Team Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert>
            <AlertDescription>
              Error loading team members: {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                session={session}
                currentTime={currentTime}
                mounted={mounted}
                onRemove={handleRemoveMember}
              />
            ))}
          </div>
        )}

        {/* Add New Member Form */}
        <AddMemberForm session={session} members={members} loading={loading} />

        {/* Footer */}
        <Card className="mt-8 border-0 bg-gradient-to-r from-neutral-100 to-neutral-200 shadow-lg">
          <CardContent className="text-center py-6">
            <p className="text-neutral-600 text-sm font-medium">
              Built with ❤️ by Jorge Pimentel and Phillip • Updated in real-time
              • Shared across all users
            </p>
            <p className="text-neutral-500 text-xs mt-2">
              Powered by Neon PostgreSQL
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimezoneBoard;
