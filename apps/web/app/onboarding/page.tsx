"use client";

import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");

  if (step === 2) {
    return (
      <BusinessTypeScreen
        onNext={(businessType) => {
          console.log({ businessName, businessType });
        }}
      />
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
