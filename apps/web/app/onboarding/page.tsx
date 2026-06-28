"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";
import { CategoriesScreen } from "@/features/onboarding/components/categories-screen";
import { DeepQuestionScreen } from "@/features/onboarding/components/deep-question-screen";
import { PhotosUploadScreen } from "@/features/onboarding/components/photos-upload-screen";
import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";

type OnboardingPlan = {
  needsCategories: boolean;
  categoriesLabel: string;
  suggestedCategories: string[];
  needsMenu: boolean;
  needsPricing: boolean;
  needsServiceArea: boolean;
  nextQuestion: string | null;
  websiteSections: string[];
  businessInsights?: {
    targetAudience: string;
    mainValue: string;
    recommendedTone: string;
    suggestedColors: string[];
    keyFeatures: string[];
  };
};

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [deepQuestion, setDeepQuestion] = useState("");
  const [businessAnswer, setBusinessAnswer] = useState("");
  const [onboardingPlan, setOnboardingPlan] = useState<OnboardingPlan | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>(
    {},
  );
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [profileId, setProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleBusinessTypeNext(
    type: string,
    answer?: string,
    categories?: string[],
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
            selectedCategories: categories ?? selectedCategories,
            userId: session?.user?.email ?? "anonymous",
            websiteSections: onboardingPlan?.websiteSections ?? [],
            recommendedTone: onboardingPlan?.businessInsights?.recommendedTone ?? "",
            suggestedColors: onboardingPlan?.businessInsights?.suggestedColors ?? [],
            targetAudience: onboardingPlan?.businessInsights?.targetAudience ?? "",
            mainValue: onboardingPlan?.businessInsights?.mainValue ?? "",
            keyFeatures: onboardingPlan?.businessInsights?.keyFeatures ?? [],
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
          setStep(4);
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

  async function handleDeepQuestionNext(answer: string) {
    setBusinessAnswer(answer);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5063/api/onboarding/plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName,
            businessType,
            businessAnswer: answer,
          }),
        },
      );

      if (response.status === 200) {
        const plan = (await response.json()) as OnboardingPlan;
        setOnboardingPlan(plan);
        if (plan.needsCategories) {
          setStep(3);
        } else {
          await handleBusinessTypeNext(businessType, answer);
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

  if (step === 4 && welcomeMessage && profileId) {
    return (
      <WelcomeScreen
        welcomeMessage={welcomeMessage}
        businessName={businessName}
        onNext={() => router.push("/dashboard")}
      />
    );
  }

  if (step === 3.5) {
    const photoCategories =
      selectedCategories.length > 0
        ? selectedCategories
        : (onboardingPlan?.suggestedCategories ?? []);

    return (
      <div className="relative">
        <PhotosUploadScreen
          categories={photoCategories}
          businessName={businessName}
          onNext={(photos) => {
            setUploadedPhotos(photos);
            handleBusinessTypeNext(businessType, undefined, selectedCategories);
          }}
          onSkip={() =>
            handleBusinessTypeNext(businessType, undefined, selectedCategories)
          }
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-base font-medium text-muted-foreground">רגע...</p>
          </div>
        )}
      </div>
    );
  }

  if (step === 3 && onboardingPlan?.needsCategories) {
    return (
      <div className="relative">
        <CategoriesScreen
          categoriesLabel={onboardingPlan.categoriesLabel}
          suggestedCategories={onboardingPlan.suggestedCategories}
          onNext={(categories) => {
            setSelectedCategories(categories);
            if (categories.length === 0 && !onboardingPlan.needsCategories) {
              handleBusinessTypeNext(businessType, undefined, categories);
            } else {
              setStep(3.5);
            }
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

  if (step === 2.5 && deepQuestion) {
    return (
      <div className="relative">
        <DeepQuestionScreen
          question={deepQuestion}
          onNext={handleDeepQuestionNext}
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
