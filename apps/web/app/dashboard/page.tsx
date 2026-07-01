"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessProfile, setBusinessProfile] = useState<{
    businessName: string;
    businessType: string;
    profileId: string;
  } | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const buildWebsite = async () => {
    if (!businessProfile?.profileId) return;
    setIsBuilding(true);
    try {
      await fetch("http://localhost:5063/api/website/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: businessProfile.profileId }),
      });
      router.push(`/preview/${businessProfile.profileId}`);
    } catch {
      setIsBuilding(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.email) return;

    fetch(
      `http://localhost:5063/api/business-profile?userId=${session.user.email}`,
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setBusinessProfile({
            businessName: data.businessName,
            businessType: data.businessType,
            profileId: data.id,
          });
        }
      })
      .catch(() => {});
  }, [session?.user?.email]);

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
          {businessProfile ? (
            <div className="flex flex-col gap-1">
              <p className="text-base">{businessProfile.businessName}</p>
              <p className="text-sm text-muted-foreground">
                {businessProfile.businessType}
              </p>
              <button
                onClick={buildWebsite}
                disabled={isBuilding}
                className="mt-4 w-full rounded-2xl py-4 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {isBuilding ? "בונה את האתר שלך..." : "בנה את האתר שלי ✨"}
              </button>
            </div>
          ) : (
            <p className="text-base text-muted-foreground">
              הדשבורד שלך בבנייה. בקרוב תוכל לראות כאן את כל המידע על העסק שלך.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
