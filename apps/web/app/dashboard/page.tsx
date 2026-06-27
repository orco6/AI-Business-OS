"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-[100svh] items-center justify-center">
        <p className="text-muted-foreground">טוען...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100svh] flex-col px-6 py-10">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          AI Business OS
        </span>
        <Button
          size="lg"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          יציאה
        </Button>
      </header>

      <div className="mx-auto mt-16 flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">שלום,</p>
          <h1 className="text-2xl font-medium tracking-tight">
            {session?.user?.name}
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-base text-muted-foreground">
            הדשבורד שלך בבנייה. בקרוב תוכל לראות כאן את כל המידע על העסק שלך.
          </p>
        </div>
      </div>
    </main>
  );
}
