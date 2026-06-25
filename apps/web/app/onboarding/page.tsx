"use client";

import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleBusinessTypeNext(businessType: string) {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5063/api/onboarding/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessName, businessType }),
        },
      );

      if (response.status === 200) {
        const data = (await response.json()) as { profileId?: string };
        console.log({ profileId: data.profileId });
      } else {
        console.log("error");
      }
    } catch {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
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
