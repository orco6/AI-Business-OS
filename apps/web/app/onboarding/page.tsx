"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";
import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [profileId, setProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleBusinessTypeNext(businessType: string) {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5063/api/onboarding/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName,
            businessType,
            userId: session?.user?.email ?? "anonymous",
          }),
        },
      );

      if (response.status === 200) {
        const data = (await response.json()) as {
          profileId?: string;
          welcomeMessage?: string;
        };
        if (data.profileId && data.welcomeMessage) {
          setProfileId(data.profileId);
          setWelcomeMessage(data.welcomeMessage);
          setStep(3);
        }
      } else {
        console.log("error");
      }
    } catch {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === 3 && welcomeMessage && profileId) {
    return (
      <WelcomeScreen
        welcomeMessage={welcomeMessage}
        businessName={businessName}
        onNext={() => router.push("/dashboard")}
      />
    );
  }

  if (step === 2) {
    return (
      <div className="relative">
        <BusinessTypeScreen onNext={handleBusinessTypeNext} />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-base font-medium text-muted-foreground">רגע...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <OnboardingScreen
      onNext={(name) => {
        setBusinessName(name);
        setStep(2);
      }}
    />
  );
}
