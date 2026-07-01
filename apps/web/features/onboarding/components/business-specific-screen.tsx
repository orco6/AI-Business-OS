"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FormEvent, type ReactNode, useState } from "react";

export type MenuDisplayMode =
  | "העלה תמונות"
  | "הזן מנות ידנית"
  | "יש לי קישור"
  | "אין כרגע";

export type BusinessSpecificData = {
  menuUrl?: string;
  menuDisplayMode?: MenuDisplayMode;
  menuTypes?: string;
  restaurantHighlights?: string;
  extraServices?: string;
  hasReservations?: boolean;
  reservationLink?: string;
  cuisineType?: string;
  pricingList?: string;
  bookingMethod?: string;
  bookingLink?: string;
  teamSize?: string;
  serviceArea?: string;
  emergency24_7?: boolean;
  emergencyHours?: string;
  isLicensed?: boolean;
  licenseNumber?: string;
  specialization?: string;
  subjects?: string;
  ageGroups?: string;
  sessionFormat?: string;
  studentAchievements?: string;
  offersFreeTrial?: boolean;
  productCategories?: string;
  hasOnlineStore?: boolean;
  onlineStoreUrl?: string;
  classTypes?: string;
  classSchedule?: string;
  mainServiceDescription?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

type BusinessSpecificScreenProps = {
  businessType: string;
  onNext: (data: BusinessSpecificData) => void;
  onSkip: () => void;
};

const inputClassName = cn(
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-start text-base text-foreground shadow-sm outline-none transition-colors",
  "placeholder:text-muted-foreground/60",
  "focus:border-primary focus:ring-2 focus:ring-ring/25",
);

const textareaClassName = cn(inputClassName, "min-h-[100px] resize-none py-3");

const MENU_DISPLAY_OPTIONS: MenuDisplayMode[] = [
  "העלה תמונות",
  "הזן מנות ידנית",
  "יש לי קישור",
  "אין כרגע",
];

const MENU_TYPE_OPTIONS = ["ערב", "בראנץ'", "אלכוהול", "עונתי", "ילדים"];

const RESTAURANT_HIGHLIGHT_OPTIONS = [
  "כשר",
  "טבעוני",
  "גלאט",
  "ללא גלוטן",
  "בשרי בלבד",
];

const EXTRA_SERVICE_OPTIONS = ["חדר פרטי", "ארוחות עסקיות", "קייטרינג"];

function Field({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 size-6 rounded-full bg-white shadow-sm transition-[inset-inline-start]",
            checked ? "start-5" : "start-0.5",
          )}
        />
      </button>
    </div>
  );
}

function RadioGroup({
  name,
  label,
  hint,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-foreground">
        {label}
      </legend>
      {hint ? (
        <p className="mb-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors",
              value === option
                ? "border-primary bg-primary/5"
                : "border-border bg-card",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="size-4 accent-primary"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxGroup({
  label,
  hint,
  options,
  selected,
  onChange,
}: {
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-foreground">
        {label}
      </legend>
      {hint ? (
        <p className="mb-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function joinSelections(values: string[]): string | undefined {
  return values.length > 0 ? values.join(", ") : undefined;
}

export function BusinessSpecificScreen({
  businessType,
  onNext,
  onSkip,
}: BusinessSpecificScreenProps) {
  const [menuUrl, setMenuUrl] = useState("");
  const [menuDisplayMode, setMenuDisplayMode] = useState<MenuDisplayMode | "">(
    "",
  );
  const [menuTypes, setMenuTypes] = useState<string[]>([]);
  const [restaurantHighlights, setRestaurantHighlights] = useState<string[]>(
    [],
  );
  const [extraServices, setExtraServices] = useState<string[]>([]);
  const [reservationMethod, setReservationMethod] = useState("");
  const [reservationLink, setReservationLink] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [pricingList, setPricingList] = useState("");
  const [bookingMethod, setBookingMethod] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [emergency24_7, setEmergency24_7] = useState(false);
  const [emergencyHours, setEmergencyHours] = useState("");
  const [isLicensed, setIsLicensed] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [subjects, setSubjects] = useState("");
  const [ageGroups, setAgeGroups] = useState("");
  const [sessionFormat, setSessionFormat] = useState("");
  const [studentAchievements, setStudentAchievements] = useState("");
  const [offersFreeTrial, setOffersFreeTrial] = useState(false);
  const [productCategories, setProductCategories] = useState("");
  const [hasOnlineStore, setHasOnlineStore] = useState(false);
  const [onlineStoreUrl, setOnlineStoreUrl] = useState("");
  const [classTypes, setClassTypes] = useState("");
  const [classSchedule, setClassSchedule] = useState("");
  const [fitnessPricing, setFitnessPricing] = useState("");
  const [mainServiceDescription, setMainServiceDescription] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");

  function buildData(): BusinessSpecificData {
    const base: BusinessSpecificData = {
      instagramUrl: instagramUrl.trim() || undefined,
      facebookUrl: facebookUrl.trim() || undefined,
    };

    switch (businessType) {
      case "restaurant":
        return {
          ...base,
          cuisineType: cuisineType.trim() || undefined,
          menuTypes: joinSelections(menuTypes),
          menuDisplayMode: menuDisplayMode || undefined,
          menuUrl:
            menuDisplayMode === "יש לי קישור"
              ? menuUrl.trim() || undefined
              : undefined,
          restaurantHighlights: joinSelections(restaurantHighlights),
          extraServices: joinSelections(extraServices),
          hasReservations: reservationMethod
            ? reservationMethod !== "אין הזמנות מראש"
            : undefined,
          bookingMethod: reservationMethod || undefined,
          reservationLink:
            reservationMethod === "אתר הזמנות"
              ? reservationLink.trim() || undefined
              : undefined,
        };
      case "beauty":
        return {
          ...base,
          pricingList: pricingList.trim() || undefined,
          bookingMethod: bookingMethod || undefined,
          bookingLink:
            bookingMethod === "אפליקציה"
              ? bookingLink.trim() || undefined
              : undefined,
          teamSize: teamSize.trim() || undefined,
        };
      case "services":
        return {
          ...base,
          serviceArea: serviceArea.trim() || undefined,
          emergency24_7,
          emergencyHours: emergency24_7
            ? emergencyHours.trim() || undefined
            : undefined,
          specialization: specialization.trim() || undefined,
          isLicensed,
          licenseNumber: isLicensed
            ? licenseNumber.trim() || undefined
            : undefined,
        };
      case "education":
        return {
          ...base,
          subjects: subjects.trim() || undefined,
          ageGroups: ageGroups.trim() || undefined,
          sessionFormat: sessionFormat || undefined,
          studentAchievements: studentAchievements.trim() || undefined,
          offersFreeTrial,
        };
      case "retail":
        return {
          ...base,
          productCategories: productCategories.trim() || undefined,
          hasOnlineStore,
          onlineStoreUrl: hasOnlineStore
            ? onlineStoreUrl.trim() || undefined
            : undefined,
        };
      case "fitness":
        return {
          ...base,
          classTypes: classTypes.trim() || undefined,
          classSchedule: classSchedule.trim() || undefined,
          pricingList: fitnessPricing.trim() || undefined,
          sessionFormat: sessionFormat || undefined,
          studentAchievements: studentAchievements.trim() || undefined,
          offersFreeTrial,
        };
      default:
        return {
          ...base,
          mainServiceDescription: mainServiceDescription.trim() || undefined,
          serviceArea: serviceArea.trim() || undefined,
          isLicensed,
          licenseNumber: isLicensed
            ? licenseNumber.trim() || undefined
            : undefined,
        };
    }
  }

  function isValid(): boolean {
    switch (businessType) {
      case "restaurant":
        return (
          cuisineType.trim().length > 0 ||
          menuDisplayMode !== "" ||
          menuTypes.length > 0
        );
      case "beauty":
        return pricingList.trim().length > 0;
      case "services":
        return serviceArea.trim().length > 0;
      case "education":
        return subjects.trim().length > 0;
      case "retail":
        return productCategories.trim().length > 0;
      case "fitness":
        return classTypes.trim().length > 0;
      default:
        return mainServiceDescription.trim().length > 0;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid()) return;
    onNext(buildData());
  }

  function renderTypeFields() {
    switch (businessType) {
      case "restaurant":
        return (
          <>
            <Field
              id="cuisine-type"
              label="מה סוג המטבח שלך?"
              required
            >
              <input
                id="cuisine-type"
                type="text"
                dir="auto"
                value={cuisineType}
                onChange={(event) => setCuisineType(event.target.value)}
                placeholder="ים תיכוני, אסייתי, בשרי, איטלקי, וגאן, יפני..."
                className={inputClassName}
              />
            </Field>
            <CheckboxGroup
              label="יש לך כמה סוגי תפריטים?"
              hint="בחר את כל מה שרלוונטי"
              options={MENU_TYPE_OPTIONS}
              selected={menuTypes}
              onChange={setMenuTypes}
            />
            <RadioGroup
              name="menu-display-mode"
              label="איך תרצה להציג את התפריט?"
              options={MENU_DISPLAY_OPTIONS}
              value={menuDisplayMode}
              onChange={(value) =>
                setMenuDisplayMode(value as MenuDisplayMode)
              }
            />
            {menuDisplayMode === "יש לי קישור" ? (
              <Field id="menu-url" label="קישור לתפריט">
                <input
                  id="menu-url"
                  type="url"
                  dir="ltr"
                  value={menuUrl}
                  onChange={(event) => setMenuUrl(event.target.value)}
                  placeholder="https://..."
                  className={inputClassName}
                />
              </Field>
            ) : null}
            <CheckboxGroup
              label="מה הדגשים של המסעדה?"
              options={RESTAURANT_HIGHLIGHT_OPTIONS}
              selected={restaurantHighlights}
              onChange={setRestaurantHighlights}
            />
            <CheckboxGroup
              label="יש לכם גם..."
              options={EXTRA_SERVICE_OPTIONS}
              selected={extraServices}
              onChange={setExtraServices}
            />
            <RadioGroup
              name="reservation-method"
              label="איך מזמינים מקום?"
              options={[
                "וואטסאפ",
                "טלפון",
                "אתר הזמנות",
                "אין הזמנות מראש",
              ]}
              value={reservationMethod}
              onChange={setReservationMethod}
            />
            {reservationMethod === "אתר הזמנות" ? (
              <Field id="reservation-link" label="קישור להזמנת מקום">
                <input
                  id="reservation-link"
                  type="url"
                  dir="ltr"
                  value={reservationLink}
                  onChange={(event) => setReservationLink(event.target.value)}
                  placeholder="https://..."
                  className={inputClassName}
                />
              </Field>
            ) : null}
          </>
        );

      case "beauty":
        return (
          <>
            <Field id="pricing-list" label="מה המחירון שלך?" required>
              <textarea
                id="pricing-list"
                dir="auto"
                value={pricingList}
                onChange={(event) => setPricingList(event.target.value)}
                placeholder="תספורת גבר 80₪, תספורת אישה מ-120₪, צביעה מ-250₪..."
                rows={4}
                className={textareaClassName}
              />
            </Field>
            <RadioGroup
              name="booking-method"
              label="איך קובעים תור?"
              options={["וואטסאפ", "טלפון", "אפליקציה"]}
              value={bookingMethod}
              onChange={setBookingMethod}
            />
            {bookingMethod === "אפליקציה" ? (
              <Field id="booking-link" label="קישור לאפליקציית הזמנות">
                <input
                  id="booking-link"
                  type="url"
                  dir="ltr"
                  value={bookingLink}
                  onChange={(event) => setBookingLink(event.target.value)}
                  placeholder="https://..."
                  className={inputClassName}
                />
              </Field>
            ) : null}
            <Field
              id="team-size"
              label="כמה סטייליסטים / טכנאיות בצוות?"
            >
              <input
                id="team-size"
                type="text"
                dir="auto"
                value={teamSize}
                onChange={(event) => setTeamSize(event.target.value)}
                placeholder="רק אני / 2-3 / 4+"
                className={inputClassName}
              />
            </Field>
          </>
        );

      case "services":
        return (
          <>
            <Field id="service-area" label="באיזה אזור אתה עובד?" required>
              <input
                id="service-area"
                type="text"
                dir="auto"
                value={serviceArea}
                onChange={(event) => setServiceArea(event.target.value)}
                placeholder="תל אביב והסביבה, חיפה, גוש דן..."
                className={inputClassName}
              />
            </Field>
            <Toggle
              id="emergency-24-7"
              label="יש שירות חירום?"
              checked={emergency24_7}
              onChange={setEmergency24_7}
            />
            {emergency24_7 ? (
              <Field id="emergency-hours" label="באיזה שעות?">
                <input
                  id="emergency-hours"
                  type="text"
                  dir="auto"
                  value={emergencyHours}
                  onChange={(event) => setEmergencyHours(event.target.value)}
                  placeholder="24/7, לילות בלבד, סופי שבוע..."
                  className={inputClassName}
                />
              </Field>
            ) : null}
            <Field id="specialization" label="מה ההתמחות הראשית שלך?">
              <input
                id="specialization"
                type="text"
                dir="auto"
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
                placeholder="אינסטלציה, חשמל, שיפוצים, ניקיון..."
                className={inputClassName}
              />
            </Field>
            <Toggle
              id="is-licensed"
              label="האם אתה מורשה / מוסמך?"
              checked={isLicensed}
              onChange={setIsLicensed}
            />
            {isLicensed ? (
              <Field id="license-number" label="מספר רישיון / הסמכה">
                <input
                  id="license-number"
                  type="text"
                  dir="auto"
                  value={licenseNumber}
                  onChange={(event) => setLicenseNumber(event.target.value)}
                  placeholder="מספר רישיון או תיאור ההסמכה"
                  className={inputClassName}
                />
              </Field>
            ) : null}
          </>
        );

      case "education":
        return (
          <>
            <Field id="subjects" label="אילו מקצועות / תחומים אתה מלמד?" required>
              <input
                id="subjects"
                type="text"
                dir="auto"
                value={subjects}
                onChange={(event) => setSubjects(event.target.value)}
                placeholder="מתמטיקה, פיזיקה, אנגלית, נגינה..."
                className={inputClassName}
              />
            </Field>
            <Field id="age-groups" label="אילו גילאים?">
              <input
                id="age-groups"
                type="text"
                dir="auto"
                value={ageGroups}
                onChange={(event) => setAgeGroups(event.target.value)}
                placeholder="כיתות ד׳-י״ב, מבוגרים, גיל רך..."
                className={inputClassName}
              />
            </Field>
            <RadioGroup
              name="session-format"
              label="פנים אל פנים / אונליין / שניהם?"
              options={["פנים אל פנים", "אונליין", "שניהם"]}
              value={sessionFormat}
              onChange={setSessionFormat}
            />
            <Field
              id="student-achievements"
              label="מה ההישגים הכי גדולים של תלמידים שלך?"
            >
              <textarea
                id="student-achievements"
                dir="auto"
                value={studentAchievements}
                onChange={(event) =>
                  setStudentAchievements(event.target.value)
                }
                placeholder="למשל: עלה מ-60 ל-100 במתמטיקה, עבר בגרות בנגינה..."
                rows={3}
                className={textareaClassName}
              />
            </Field>
            <Toggle
              id="offers-free-trial"
              label="האם אתה מציע שיעור ניסיון?"
              checked={offersFreeTrial}
              onChange={setOffersFreeTrial}
            />
          </>
        );

      case "retail":
        return (
          <>
            <Field id="product-categories" label="מה המוצרים העיקריים?" required>
              <input
                id="product-categories"
                type="text"
                dir="auto"
                value={productCategories}
                onChange={(event) => setProductCategories(event.target.value)}
                placeholder="בגדי ילדים, תכשיטים, אביזרי בית..."
                className={inputClassName}
              />
            </Field>
            <Toggle
              id="has-online-store"
              label="יש חנות אונליין?"
              checked={hasOnlineStore}
              onChange={setHasOnlineStore}
            />
            {hasOnlineStore ? (
              <Field id="online-store-url" label="קישור לחנות אונליין">
                <input
                  id="online-store-url"
                  type="url"
                  dir="ltr"
                  value={onlineStoreUrl}
                  onChange={(event) => setOnlineStoreUrl(event.target.value)}
                  placeholder="https://..."
                  className={inputClassName}
                />
              </Field>
            ) : null}
          </>
        );

      case "fitness":
        return (
          <>
            <Field id="class-types" label="אילו שיעורים / תחומים?" required>
              <input
                id="class-types"
                type="text"
                dir="auto"
                value={classTypes}
                onChange={(event) => setClassTypes(event.target.value)}
                placeholder="יוגה, פילאטיס, TRX, שיעורי ילדים..."
                className={inputClassName}
              />
            </Field>
            <Field id="age-groups-fitness" label="אילו גילאים?">
              <input
                id="age-groups-fitness"
                type="text"
                dir="auto"
                value={ageGroups}
                onChange={(event) => setAgeGroups(event.target.value)}
                placeholder="מבוגרים, נוער, גיל רך..."
                className={inputClassName}
              />
            </Field>
            <RadioGroup
              name="session-format-fitness"
              label="פנים אל פנים / אונליין / שניהם?"
              options={["פנים אל פנים", "אונליין", "שניהם"]}
              value={sessionFormat}
              onChange={setSessionFormat}
            />
            <Field id="class-schedule" label="מתי השיעורים?">
              <input
                id="class-schedule"
                type="text"
                dir="auto"
                value={classSchedule}
                onChange={(event) => setClassSchedule(event.target.value)}
                placeholder="ימים ושעות"
                className={inputClassName}
              />
            </Field>
            <Field id="fitness-pricing" label="מחיר לשיעור / מנוי">
              <input
                id="fitness-pricing"
                type="text"
                dir="auto"
                value={fitnessPricing}
                onChange={(event) => setFitnessPricing(event.target.value)}
                placeholder="למשל: שיעור בודד 80₪, מנוי חודשי 350₪"
                className={inputClassName}
              />
            </Field>
            <Field
              id="student-achievements-fitness"
              label="מה ההישגים / התוצאות של המתאמנים שלך?"
            >
              <textarea
                id="student-achievements-fitness"
                dir="auto"
                value={studentAchievements}
                onChange={(event) =>
                  setStudentAchievements(event.target.value)
                }
                placeholder="למשל: 92% מהמתאמנים שיפרו גמישות, ירידה במשקל..."
                rows={3}
                className={textareaClassName}
              />
            </Field>
            <Toggle
              id="offers-free-trial-fitness"
              label="האם אתה מציע שיעור ניסיון?"
              checked={offersFreeTrial}
              onChange={setOffersFreeTrial}
            />
          </>
        );

      default:
        return (
          <>
            <Field id="main-service" label="תאר את השירות העיקרי שלך" required>
              <textarea
                id="main-service"
                dir="auto"
                value={mainServiceDescription}
                onChange={(event) =>
                  setMainServiceDescription(event.target.value)
                }
                placeholder="ספר לנו על השירות שאתה מציע..."
                rows={4}
                className={textareaClassName}
              />
            </Field>
            <Field id="service-area-other" label="מה אזור השירות שלך?">
              <input
                id="service-area-other"
                type="text"
                dir="auto"
                value={serviceArea}
                onChange={(event) => setServiceArea(event.target.value)}
                placeholder="תל אביב והסביבה..."
                className={inputClassName}
              />
            </Field>
            <Toggle
              id="is-licensed-other"
              label="האם יש לך הסמכה / רישיון מקצועי?"
              checked={isLicensed}
              onChange={setIsLicensed}
            />
            {isLicensed ? (
              <Field id="license-number-other" label="פרטי הסמכה / רישיון">
                <input
                  id="license-number-other"
                  type="text"
                  dir="auto"
                  value={licenseNumber}
                  onChange={(event) => setLicenseNumber(event.target.value)}
                  placeholder="תואר, רישיון, הסמכה..."
                  className={inputClassName}
                />
              </Field>
            ) : null}
          </>
        );
    }
  }

  const titles: Record<string, { title: string; subtitle: string }> = {
    restaurant: {
      title: "פרטים על המסעדה",
      subtitle: "תפריט, מטבח והזמנות — מה שלקוחות רוצים לראות",
    },
    beauty: {
      title: "פרטים על הסלון",
      subtitle: "מחירון, תורים וצוות",
    },
    services: {
      title: "פרטים על השירות",
      subtitle: "אזור פעילות, חירום והתמחות",
    },
    education: {
      title: "פרטים על ההוראה",
      subtitle: "תחומים, גילאים והישגים",
    },
    retail: {
      title: "פרטים על החנות",
      subtitle: "מוצרים וחנות אונליין",
    },
    fitness: {
      title: "פרטים על הסטודיו",
      subtitle: "שיעורים, לוח זמנים ותוצאות",
    },
    other: {
      title: "ספר לנו עוד",
      subtitle: "כמה פרטים שיעזרו לנו לבנות אתר מושלם",
    },
  };

  const instagramLabels: Record<string, { label: string; hint?: string }> = {
    beauty: {
      label: "Instagram שלך",
      hint: "קריטי לעסקי יופי — העבודות שלך מדברות בעד עצמן",
    },
    restaurant: {
      label: "Instagram",
      hint: "אם יש — נציג תמונות מהאינסטגרם שלך באתר",
    },
  };

  const copy = titles[businessType] ?? titles.other;
  const instagramCopy =
    instagramLabels[businessType] ?? { label: "Instagram" };

  return (
    <main className="flex min-h-[100svh] flex-col px-6 py-10">
      <header className="mx-auto flex w-full max-w-md items-center gap-3">
        <div className="relative">
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-primary"
          >
            <span className="size-3 rounded-full bg-primary-foreground" />
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -start-0.5 size-3 rounded-full border-2 border-background bg-emerald-500"
          />
        </div>
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          העוזר שלך
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col pt-8">
        <header className="mb-6 text-start">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            {copy.title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {copy.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4">
            {renderTypeFields()}

            <Field
              id="instagram-url"
              label={instagramCopy.label}
              hint={instagramCopy.hint}
            >
              <input
                id="instagram-url"
                type="url"
                dir="ltr"
                value={instagramUrl}
                onChange={(event) => setInstagramUrl(event.target.value)}
                placeholder="https://instagram.com/..."
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={!isValid()}
              className="w-full shadow-sm transition-transform active:scale-[0.99] disabled:opacity-40"
            >
              המשך
            </Button>

            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              דלג, אמשיך אחר כך
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
