"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";
import { CategoriesScreen } from "@/features/onboarding/components/categories-screen";
import {
  ContactDetailsScreen,
  type ContactDetails,
} from "@/features/onboarding/components/contact-details-screen";
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
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>(
    {},
  );
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(
    null,
  );
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [profileId, setProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleBusinessTypeNext(
    type: string,
    answer?: string,
    categories?: string[],
    details?: ContactDetails,
    uploadedPhotosParam?: Record<string, string[]>,
  ) {
    setIsLoading(true);
    const contact = details ?? contactDetails;
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
            phone: contact?.phone ?? "",
            whatsapp: contact?.whatsapp ?? "",
            address: contact?.address ?? "",
            city: contact?.city ?? "",
            hours: contact?.hours ?? "",
            ownerName: contact?.ownerName ?? "",
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

          const photosToUpload = uploadedPhotosParam ?? uploadedPhotos;
          if (data.profileId && Object.keys(photosToUpload).length > 0) {
            const uploadEntries = await Promise.all(
              Object.entries(photosToUpload).map(async ([category, base64Photos]) => {
                const response = await fetch("/api/upload", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    images: base64Photos,
                    category,
                    profileId: data.profileId,
                  }),
                });
                const result = (await response.json()) as { urls: string[] };
                return [category, result.urls] as const;
              }),
            );
            const urlsByCategory = Object.fromEntries(uploadEntries);
            await fetch("http://localhost:5063/api/photos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profileId: data.profileId,
                photosByCategory: urlsByCategory,
              }),
            });
          }

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
          setStep(3.5);
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

  if (step === 3.7) {
    return (
      <div className="relative">
        <ContactDetailsScreen
          businessType={businessType}
          onNext={(details) => {
            setContactDetails(details);
            handleBusinessTypeNext(
              businessType,
              undefined,
              selectedCategories,
              details,
              uploadedPhotos,
            );
          }}
          onSkip={() => setStep(4)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-base font-medium text-muted-foreground">רגע...</p>
          </div>
        )}
      </div>
    );
  }

  if (step === 3.5) {
    const defaultCategoriesByType: Record<string, string[]> = {
      restaurant: ["מנות מהתפריט", "אווירת המסעדה", "הצוות שלנו"],
      beauty: ["עבודות לפני ואחרי", "הסלון שלנו"],
      services: ["עבודות שביצענו", "הצוות שלנו"],
      fitness: ["המתקנים שלנו", "אימונים"],
      other: ["תמונות מהעסק"],
    };

    const photoCategories =
      selectedCategories.length > 0
        ? selectedCategories
        : (onboardingPlan?.suggestedCategories?.length ?? 0) > 0
          ? onboardingPlan!.suggestedCategories
          : (defaultCategoriesByType[businessType] ?? ["תמונות מהעסק"]);

    return (
      <div className="relative">
        <PhotosUploadScreen
          categories={photoCategories}
          businessName={businessName}
          profileId={profileId}
          onNext={(photos) => {
            setUploadedPhotos(photos);
            setStep(3.7);
          }}
          onSkip={() => setStep(3.7)}
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
            setPendingCategories(categories);
            setStep(3.5);
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
