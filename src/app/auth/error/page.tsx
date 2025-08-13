"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An unexpected error occurred.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription>
            {errorMessages[error] || errorMessages.Default}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Error Code:{" "}
              <code className="bg-muted px-2 py-1 rounded">{error}</code>
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
