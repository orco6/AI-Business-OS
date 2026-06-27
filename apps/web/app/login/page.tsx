"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tight">ברוכים הבאים</h1>
          <p className="text-base text-muted-foreground">
            התחברו כדי להמשיך לעסק שלכם
          </p>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
        >
          התחברות עם Google
        </Button>
      </div>
    </main>
  );
}
