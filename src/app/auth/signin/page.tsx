"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

interface Provider {
  id: string;
  name: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return <FaGoogle className="mr-2 h-4 w-4" />;
      case "github":
        return <FaGithub className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to Triton Timezone
          </CardTitle>
          <CardDescription>
            Sign in with your preferred provider to access the team dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers &&
            Object.values(providers).map((provider: Provider) => (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                variant="outline"
                className="w-full"
              >
                {getProviderIcon(provider.id)}
                Sign in with {provider.name}
              </Button>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
