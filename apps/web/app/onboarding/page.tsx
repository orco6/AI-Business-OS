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
import {
  MenuUploadScreen,
  needsMenuUploadScreen,
  type MenuUploadData,
} from "@/features/onboarding/components/menu-upload-screen";
import { PhotosUploadScreen } from "@/features/onboarding/components/photos-upload-screen";
import {
  SocialProofScreen,
  type BusinessStats,
} from "@/features/onboarding/components/social-proof-screen";
import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";

const API_BASE =
  typeof window !== "undefined"
    ? `http://${window.location.hostname}:5063`
    : "http://localhost:5063";

const API_TIMEOUT_MS = 90_000;

function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
}

function getFetchErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "הבקשה ארכה יותר מדי. ודא שה-API רץ ונסה שוב.";
  }

  return "משהו השתבש, נסה שוב";
}

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
  const [heroPhotoUrl, setHeroPhotoUrl] = useState("");
  const [businessSpecificData, setBusinessSpecificData] =
    useState<BusinessSpecificData | null>(null);
  const [menuUploadData, setMenuUploadData] = useState<MenuUploadData | null>(
    null,
  );
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
  const [errorMessage, setErrorMessage] = useState("");

  async function finalizeOnboarding(
    type: string,
    answer?: string,
    categories?: string[],
    details?: ContactDetails,
    specificData?: BusinessSpecificData | null,
    photosParam?: Record<string, string[]>,
    screenshots?: string[],
    stats?: BusinessStats | null,
    menuData?: MenuUploadData | null,
    heroPhotoParam?: string,
  ) {
    setIsLoading(true);
    const contact = details ?? contactDetails;
    const specific = specificData ?? businessSpecificData;
    const menu = menuData ?? menuUploadData;
    const heroPhoto = heroPhotoParam ?? heroPhotoUrl;
    setErrorMessage("");
    try {
      const response = await apiFetch("/api/onboarding/start", {
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
            menuDisplayMode: specific?.menuDisplayMode ?? "",
            menuTypes: specific?.menuTypes ?? "",
            restaurantHighlights: specific?.restaurantHighlights ?? "",
            extraServices: specific?.extraServices ?? "",
            hasReservations: specific?.hasReservations ?? false,
            reservationLink: specific?.reservationLink ?? "",
            cuisineType: specific?.cuisineType ?? "",
            menuPhotos: menu?.menuPhotos ?? [],
            menuItems: menu?.menuItems ?? [],
            pricingList: specific?.pricingList ?? "",
            bookingMethod: specific?.bookingMethod ?? "",
            bookingLink: specific?.bookingLink ?? "",
            teamSize: specific?.teamSize ?? "",
            serviceArea: specific?.serviceArea ?? "",
            emergency24_7: specific?.emergency24_7 ?? false,
            emergencyHours: specific?.emergencyHours ?? "",
            isLicensed: specific?.isLicensed ?? false,
            licenseNumber: specific?.licenseNumber ?? "",
            specialization: specific?.specialization ?? "",
            subjects: specific?.subjects ?? "",
            ageGroups: specific?.ageGroups ?? "",
            sessionFormat: specific?.sessionFormat ?? "",
            studentAchievements: specific?.studentAchievements ?? "",
            offersFreeTrial: specific?.offersFreeTrial ?? false,
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
            heroPhotoUrl: heroPhoto,
          }),
      });

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

            await apiFetch("/api/photos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profileId: data.profileId,
                photosByCategory: urlsByCategory,
                heroPhotoUrl: heroPhoto,
              }),
            });
          }

          setStep(4);
        } else {
          setErrorMessage("משהו השתבש, נסה שוב");
        }
      } else {
        setErrorMessage("משהו השתבש, נסה שוב");
      }
    } catch (error) {
      setErrorMessage(getFetchErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBusinessTypeSelected(type: string) {
    setBusinessType(type);
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await apiFetch("/api/onboarding/deep-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType: type }),
      });

      if (response.status === 200) {
        const data = (await response.json()) as { question?: string };
        if (data.question) {
          setDeepQuestion(data.question);
          setStep(2.5);
        } else {
          setErrorMessage("משהו השתבש, נסה שוב");
        }
      } else {
        setErrorMessage("משהו השתבש, נסה שוב");
      }
    } catch (error) {
      setErrorMessage(getFetchErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeepQuestionNext(answer: string) {
    setBusinessAnswer(answer);
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await apiFetch("/api/onboarding/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessType,
          businessAnswer: answer,
        }),
      });

      if (response.status === 200) {
        const plan = (await response.json()) as OnboardingPlan;
        setOnboardingPlan(plan);
        if (plan.needsCategories) {
          setStep(3);
        } else {
          setStep(3.5);
        }
      } else {
        setErrorMessage("משהו השתבש, נסה שוב");
      }
    } catch (error) {
      setErrorMessage(getFetchErrorMessage(error));
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
          errorMessage={errorMessage}
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
      <ContactDetailsScreen
        onNext={(details) => {
          setContactDetails(details);
          setIsLoading(false);
          setStep(3.8);
        }}
        onSkip={() => {
          setIsLoading(false);
          setStep(3.8);
        }}
      />
    );
  }

  if (step === 3.65 && businessSpecificData?.menuDisplayMode) {
    return (
      <div className="relative">
        <MenuUploadScreen
          menuDisplayMode={businessSpecificData.menuDisplayMode}
          menuTypes={businessSpecificData.menuTypes}
          profileId={profileId}
          onNext={(data) => {
            setMenuUploadData(data);
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

  if (step === 3.6) {
    return (
      <div className="relative">
        <BusinessSpecificScreen
          businessType={businessType}
          onNext={(data) => {
            setBusinessSpecificData(data);
            setStep(
              needsMenuUploadScreen(businessType, data.menuDisplayMode)
                ? 3.65
                : 3.7,
            );
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
          onNext={(photos, heroUrl) => {
            setUploadedPhotos(photos);
            setHeroPhotoUrl(heroUrl ?? "");
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
          errorMessage={errorMessage}
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
        <BusinessTypeScreen
          errorMessage={errorMessage}
          onNext={handleBusinessTypeSelected}
        />
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
