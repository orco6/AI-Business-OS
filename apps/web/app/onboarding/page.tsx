"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreen } from "@/features/onboarding";
import { BusinessTypeScreen } from "@/features/onboarding/components/business-type-screen";
import {
  BusinessSpecificScreen,
  type BusinessSpecificData,
} from "@/features/onboarding/components/business-specific-screen";
import { CategoriesScreen } from "@/features/onboarding/components/categories-screen";
import {
  ContactDetailsScreen,
  type ContactDetails,
} from "@/features/onboarding/components/contact-details-screen";
import { DeepQuestionScreen } from "@/features/onboarding/components/deep-question-screen";
import { PhotosUploadScreen } from "@/features/onboarding/components/photos-upload-screen";
import {
  SocialProofScreen,
  type BusinessStats,
} from "@/features/onboarding/components/social-proof-screen";
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

function getBeforeAfterCategories(
  businessType: string,
  selectedCategories: string[],
): string[] {
  const categoryText = selectedCategories.join(" ").toLowerCase();

  if (businessType === "beauty") {
    if (
      categoryText.includes("ציפור") ||
      categoryText.includes("nail") ||
      categoryText.includes("מניקור")
    ) {
      return ["עיצוב ציפורניים"];
    }
    return ["תספורות ועיצוב שיער"];
  }

  if (businessType === "services") {
    if (
      categoryText.includes("וילון") ||
      categoryText.includes("curtain") ||
      categoryText.includes("עיצוב פנים") ||
      categoryText.includes("interior")
    ) {
      return ["עיצוב חללים"];
    }
    if (
      categoryText.includes("ניקיון") ||
      categoryText.includes("clean") ||
      categoryText.includes("גינון") ||
      categoryText.includes("garden")
    ) {
      return ["עבודות שביצענו"];
    }
    return [];
  }

  return [];
}

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
  const [businessSpecificData, setBusinessSpecificData] =
    useState<BusinessSpecificData | null>(null);
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(
    null,
  );
  const [socialProofScreenshots, setSocialProofScreenshots] = useState<
    string[]
  >([]);
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(
    null,
  );
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [profileId, setProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function finalizeOnboarding(
    type: string,
    answer?: string,
    categories?: string[],
    details?: ContactDetails,
    specificData?: BusinessSpecificData | null,
    photosParam?: Record<string, string[]>,
    screenshots?: string[],
    stats?: BusinessStats | null,
  ) {
    setIsLoading(true);
    const contact = details ?? contactDetails;
    const specific = specificData ?? businessSpecificData;
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
            recommendedTone:
              onboardingPlan?.businessInsights?.recommendedTone ?? "",
            suggestedColors:
              onboardingPlan?.businessInsights?.suggestedColors ?? [],
            targetAudience:
              onboardingPlan?.businessInsights?.targetAudience ?? "",
            mainValue: onboardingPlan?.businessInsights?.mainValue ?? "",
            keyFeatures: onboardingPlan?.businessInsights?.keyFeatures ?? [],
            phone: contact?.phone ?? "",
            whatsapp: contact?.whatsapp ?? "",
            address: contact?.address ?? "",
            city: contact?.city ?? "",
            hours: contact?.hours ?? "",
            ownerName: contact?.ownerName ?? "",
            menuUrl: specific?.menuUrl ?? "",
            hasReservations: specific?.hasReservations ?? false,
            reservationLink: specific?.reservationLink ?? "",
            cuisineType: specific?.cuisineType ?? "",
            pricingList: specific?.pricingList ?? "",
            bookingMethod: specific?.bookingMethod ?? "",
            teamSize: specific?.teamSize ?? "",
            serviceArea: specific?.serviceArea ?? "",
            emergency24_7: specific?.emergency24_7 ?? false,
            licenseNumber: specific?.licenseNumber ?? "",
            specialization: specific?.specialization ?? "",
            subjects: specific?.subjects ?? "",
            ageGroups: specific?.ageGroups ?? "",
            sessionFormat: specific?.sessionFormat ?? "",
            productCategories: specific?.productCategories ?? "",
            hasOnlineStore: specific?.hasOnlineStore ?? false,
            onlineStoreUrl: specific?.onlineStoreUrl ?? "",
            classTypes: specific?.classTypes ?? "",
            classSchedule: specific?.classSchedule ?? "",
            mainServiceDescription: specific?.mainServiceDescription ?? "",
            instagramUrl: specific?.instagramUrl ?? "",
            facebookUrl: specific?.facebookUrl ?? "",
            socialProofScreenshots: screenshots ?? socialProofScreenshots,
            yearsInBusiness: stats?.yearsInBusiness ?? businessStats?.yearsInBusiness ?? "",
            clientsServed: stats?.clientsServed ?? businessStats?.clientsServed ?? "",
            specialAchievement:
              stats?.specialAchievement ?? businessStats?.specialAchievement ?? "",
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

          const photosToSave = photosParam ?? uploadedPhotos;
          if (data.profileId && Object.keys(photosToSave).length > 0) {
            const urlsByCategory: Record<string, string[]> = {};

            for (const [category, photos] of Object.entries(photosToSave)) {
              const alreadyUploaded = photos.every((photo) =>
                photo.startsWith("http"),
              );
              if (alreadyUploaded) {
                urlsByCategory[category] = photos;
              } else {
                const uploadResponse = await fetch("/api/upload", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    images: photos,
                    category,
                    profileId: data.profileId,
                  }),
                });
                const result = (await uploadResponse.json()) as {
                  urls: string[];
                };
                urlsByCategory[category] = result.urls;
              }
            }

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

  if (step === 3.8) {
    return (
      <div className="relative">
        <SocialProofScreen
          profileId={profileId}
          onNext={(screenshots, stats) => {
            setSocialProofScreenshots(screenshots);
            setBusinessStats(stats);
            void finalizeOnboarding(
              businessType,
              undefined,
              selectedCategories,
              contactDetails ?? undefined,
              businessSpecificData,
              uploadedPhotos,
              screenshots,
              stats,
            );
          }}
          onSkip={() =>
            void finalizeOnboarding(
              businessType,
              undefined,
              selectedCategories,
              contactDetails ?? undefined,
              businessSpecificData,
              uploadedPhotos,
            )
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

  if (step === 3.7) {
    return (
      <div className="relative">
        <ContactDetailsScreen
          onNext={(details) => {
            setContactDetails(details);
            setStep(3.8);
          }}
          onSkip={() => setStep(3.8)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-base font-medium text-muted-foreground">רגע...</p>
          </div>
        )}
      </div>
    );
  }

  if (step === 3.6) {
    return (
      <div className="relative">
        <BusinessSpecificScreen
          businessType={businessType}
          onNext={(data) => {
            setBusinessSpecificData(data);
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

  if (step === 3.5) {
    const defaultCategoriesByType: Record<string, string[]> = {
      restaurant: ["מנות מהתפריט", "אווירת המסעדה", "הצוות שלנו"],
      beauty: ["הסלון שלנו", "עבודות שלנו"],
      services: ["עבודות שביצענו", "הצוות שלנו"],
      fitness: ["המתקנים שלנו", "אימונים"],
      retail: ["מוצרים", "החנות שלנו"],
      other: ["תמונות מהעסק"],
    };

    const photoCategories =
      selectedCategories.length > 0
        ? selectedCategories
        : (onboardingPlan?.suggestedCategories?.length ?? 0) > 0
          ? onboardingPlan!.suggestedCategories
          : (defaultCategoriesByType[businessType] ?? ["תמונות מהעסק"]);

    const beforeAfterCategories = getBeforeAfterCategories(
      businessType,
      selectedCategories.length > 0
        ? selectedCategories
        : (photoCategories ?? []),
    );

    return (
      <div className="relative">
        <PhotosUploadScreen
          categories={photoCategories}
          businessType={businessType}
          beforeAfterCategories={beforeAfterCategories}
          businessName={businessName}
          profileId={profileId}
          onNext={(photos) => {
            setUploadedPhotos(photos);
            setStep(3.6);
          }}
          onSkip={() => setStep(3.6)}
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
            setStep(3.5);
          }}
          onSkip={() => setStep(3.5)}
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
          onSkip={() => setStep(3.5)}
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
