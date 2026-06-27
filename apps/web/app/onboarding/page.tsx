"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";
import { DeepQuestionScreen } from "@/features/onboarding/components/deep-question-screen";
import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [deepQuestion, setDeepQuestion] = useState("");
  const [businessAnswer, setBusinessAnswer] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [profileId, setProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleBusinessTypeNext(
    type: string,
    answer?: string,
  ) {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5063/api/onboarding/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName,
            businessType: type,
            businessAnswer: answer ?? businessAnswer,
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

  async function handleBusinessTypeSelected(type: string) {
    setBusinessType(type);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5063/api/onboarding/deep-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessType: type }),
        },
      );

      if (response.status === 200) {
        const data = (await response.json()) as { question?: string };
        if (data.question) {
          setDeepQuestion(data.question);
          setStep(2.5);
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

  if (step === 2.5 && deepQuestion) {
    return (
      <div className="relative">
        <DeepQuestionScreen
          question={deepQuestion}
          onNext={(answer) => {
            setBusinessAnswer(answer);
            handleBusinessTypeNext(businessType, answer);
          }}
          onSkip={() => handleBusinessTypeNext(businessType)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-base font-medium text-muted-foreground">רגע...</p>
          </div>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="relative">
        <BusinessTypeScreen onNext={handleBusinessTypeSelected} />
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
