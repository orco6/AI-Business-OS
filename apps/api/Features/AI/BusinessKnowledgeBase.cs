namespace Api.Features.AI;

public static class BusinessKnowledgeBase
{
    public static string GetKnowledgeForBusiness(string businessType, string businessDescription)
    {
        return $"""
        BUSINESS KNOWLEDGE BASE FOR ISRAELI SMALL BUSINESSES
        
        You are analyzing: Type={businessType}, Description={businessDescription}
        
        Based on the description, identify which specific business category this is and apply the relevant knowledge:

        ═══════════════════════════════════════
        FOOD & BEVERAGE
        ═══════════════════════════════════════
        
        RESTAURANT / מסעדה:
        Critical info needed: cuisine type, dine-in/takeout/delivery, opening hours, address
        Delivery: Wolt/10bis/direct? delivery zones?
        Reservations: yes/no? phone/online?
        Menu: upload photo or describe sections
        Parking/accessibility: yes/no?
        Kashrut: kosher/not?
        Atmosphere: family/romantic/business?
        Website must have: menu (HTML not PDF), hours, map, order CTA
        
        CAFE / בית קפה:
        Critical: coffee types, food menu, seating, WiFi policy
        Special: vegan options? pet-friendly? workspace-friendly?
        Hours: weekday vs weekend
        Website must have: menu, hours, atmosphere photos, location
        
        BAKERY / מאפייה:
        Critical: what products, custom orders? wedding cakes?
        Preorder required? pickup only or delivery?
        Kashrut certification?
        Website must have: product gallery, ordering process, contact
        
        CATERING / קייטרינג:
        Critical: event types (weddings/corporate/private), min guests
        Kashrut level, cuisine style
        Service area, staffing included?
        Website must have: gallery, packages, contact form, testimonials

        ═══════════════════════════════════════
        RETAIL - PHYSICAL STORE
        ═══════════════════════════════════════
        
        CLOTHING STORE / חנות בגדים:
        Critical: men/women/kids/all? brands or own label?
        Price range: budget/mid/luxury?
        Online store too? delivery?
        Sizes range, returns policy
        Website must have: categories, size guide, contact, location
        
        FURNITURE / רהיטים:
        Critical: style (modern/classic/industrial), custom made?
        Delivery & assembly service?
        Showroom address and hours
        Website must have: gallery by room, process, delivery info
        
        CURTAINS & BLINDS / וילונות ותריסים:
        Critical: product types (fabric/roller/electric/shutters)
        Installation service? measurement at home?
        Service area, price range
        Website must have: product categories, gallery, area served, contact
        
        ELECTRONICS / אלקטרוניקה:
        Critical: new/used/both? which brands? repair service?
        Warranty policy, delivery?
        Website must have: product categories, brands, warranty, contact
        
        JEWELRY / תכשיטים:
        Critical: mass market/custom made? gold/silver/both?
        Repair service? engraving?
        Price range, online store?
        Website must have: gallery, materials, custom order process
        
        PET STORE / חנות חיות:
        Critical: which animals? food only or also accessories/grooming?
        Grooming service? vet consultations?
        Website must have: categories, services, location, hours
        
        FLOWER SHOP / חנות פרחים:
        Critical: arrangements, events (weddings/events), delivery?
        Same-day delivery? online orders?
        Website must have: gallery, ordering, delivery zones, contact
        
        JUDAICA / יודאיקה:
        Critical: imported/handmade? personalized items?
        Bar mitzvah packages? wholesale?
        Website must have: categories, customization, contact

        ═══════════════════════════════════════
        HOME SERVICES / שירותים לבית
        ═══════════════════════════════════════
        
        PLUMBER / אינסטלטור:
        Critical: services (repairs/renovations/boilers), emergency service?
        Licensed? years of experience?
        Service cities/areas, response time
        Pricing: hourly/fixed quote?
        Website must have: services, area, WhatsApp CTA, emergency button, testimonials
        
        ELECTRICIAN / חשמלאי:
        Critical: residential/commercial/both? solar panels?
        Licensed (rashut)? emergency service?
        Service areas, years of experience
        Website must have: services, license badge, area, WhatsApp, testimonials
        
        CONTRACTOR / קבלן שיפוצים:
        Critical: apartment renovation/additions/commercial?
        Full renovation or specific work? (tiling, painting, etc)
        Portfolio of past projects? licensed?
        Service areas, project timeline
        Website must have: before/after gallery, services, process, contact
        
        CLEANING SERVICE / שירות ניקיון:
        Critical: homes/offices/post-construction/end-of-tenancy?
        One-time or recurring? team size?
        Eco-friendly products? insured?
        Service areas, pricing model
        Website must have: services, areas, pricing info, booking CTA
        
        GARDENING / גינון:
        Critical: maintenance/design/both? irrigation systems?
        Residential/commercial? tree trimming?
        Service areas, frequency of visits
        Website must have: gallery, services, area, seasonal packages
        
        LOCKSMITH / מנעולן:
        Critical: emergency 24/7? car/home/safe?
        Licensed? response time?
        Service areas
        Website must have: emergency phone prominent, services, area, 24/7 badge
        
        PEST CONTROL / הדברה:
        Critical: residential/commercial? specific pests?
        Warranty on treatment? organic options?
        Service areas, pricing
        Website must have: pests list, process, guarantee, contact
        
        MOVING COMPANY / חברת הובלות:
        Critical: local/national/international? storage?
        Piano/heavy items? packing service?
        Insurance included? pricing model
        Website must have: services, coverage area, quote request, insurance info

        ═══════════════════════════════════════
        BEAUTY & WELLNESS / יופי ובריאות
        ═══════════════════════════════════════
        
        HAIR SALON / מספרה:
        Critical: women/men/both? treatments offered?
        (cuts, coloring, highlights, keratin, extensions)
        Solo stylist or team? booking method?
        Price range, location
        Website must have: services with prices, gallery before/after, booking CTA, team
        
        BARBERSHOP / ספר:
        Critical: cuts/beard/both? kids?
        Walk-in or appointment? booking app?
        Location, hours
        Website must have: services, prices, gallery, booking, location
        
        NAIL SALON / מניקור פדיקור:
        Critical: gel/acrylic/regular? nail art?
        Pedicure? waxing?
        Booking method, price range
        Website must have: services, gallery, prices, booking CTA
        
        SPA / ספא:
        Critical: massages types? facial treatments? packages?
        Medical or relaxation? couples?
        Membership options, gift vouchers?
        Website must have: treatments menu, packages, booking, gallery
        
        COSMETICS / קוסמטיקה:
        Critical: face/body/both? medical procedures? (botox, fillers)
        Licensed esthetician? before/after?
        Price range, packages
        Website must have: treatments, before/after gallery, credentials, booking

        ═══════════════════════════════════════
        PROFESSIONAL SERVICES / שירותים מקצועיים
        ═══════════════════════════════════════
        
        LAWYER / עורך דין:
        Critical: practice areas (family/criminal/real estate/labor/commercial)
        Years of experience, bar certified?
        Free initial consultation? remote/in-person?
        Service area (courts)
        Website must have: practice areas, credentials, about, contact form, NO prices
        
        ACCOUNTANT / רואה חשבון:
        Critical: individuals/businesses/both? specializations?
        (startups, nonprofits, international, VAT)
        Remote service available? languages?
        Website must have: services, credentials, about, contact, no prices
        
        FINANCIAL ADVISOR / יועץ פיננסי:
        Critical: investments/insurance/mortgages/all?
        Licensed (רישיון)? years of experience?
        Free consultation? remote?
        Website must have: services, license badge, about, contact
        
        ARCHITECT / אדריכל:
        Critical: residential/commercial/both? interior design too?
        New construction/renovations? urban planning?
        Portfolio, licensed?
        Website must have: portfolio, services, process, credentials, contact
        
        INTERIOR DESIGNER / מעצב פנים:
        Critical: residential/commercial/both? full design or consultation?
        Style specialty (modern/classic/industrial)?
        Budget range, service area
        Website must have: portfolio by project, style, process, contact
        
        REAL ESTATE AGENT / מתווך נדלן:
        Critical: buy/sell/rent/all? area specialization?
        Residential/commercial? new construction?
        Years of experience, licensed?
        Website must have: listings, area expertise, about, contact, testimonials

        ═══════════════════════════════════════
        HEALTH & MEDICINE / בריאות
        ═══════════════════════════════════════
        
        PHYSIOTHERAPIST / פיזיותרפיסט:
        Critical: orthopedic/neurological/pediatric/sports?
        Home visits? telehealth?
        Insurance accepted? licensed?
        Website must have: treatments, credentials, booking, location
        
        PSYCHOLOGIST / פסיכולוג:
        Critical: adults/children/couples/all? specializations?
        (anxiety/trauma/ADHD/eating disorders)
        In-person/online/both? insurance?
        Website must have: approach, specializations, booking, contact - NO photos of patients
        
        NUTRITIONIST / דיאטנית:
        Critical: weight loss/sports nutrition/medical/children?
        In-person/online? meal plans included?
        Insurance? packages?
        Website must have: approach, programs, credentials, booking
        
        DENTIST / רופא שיניים:
        Critical: general/specialist? (orthodontics/implants/cosmetic)
        Adults/children/both? insurance?
        Emergency appointments? location/parking
        Website must have: services, credentials, booking, location, before/after
        
        VETERINARIAN / וטרינר:
        Critical: small animals/large/exotic? emergency?
        House calls? surgery?
        Location, hours, parking
        Website must have: services, hours, emergency contact, location

        ═══════════════════════════════════════
        EDUCATION & TRAINING / חינוך
        ═══════════════════════════════════════
        
        PRIVATE TUTOR / מורה פרטי:
        Critical: subjects? age groups? (elementary/high school/university)
        In-person/online/both? group lessons?
        Location or home visits? price per hour?
        Website must have: subjects, age groups, method, booking, testimonials
        
        MUSIC TEACHER / מורה למוזיקה:
        Critical: instruments? singing? theory?
        Ages? beginner/advanced?
        In-person/online? location or home visits?
        Website must have: instruments, ages, about teacher, booking
        
        DRIVING SCHOOL / בית ספר לנהיגה:
        Critical: car/motorcycle/truck? automatic/manual?
        Theory lessons? test preparation?
        Area, pricing packages
        Website must have: packages, instructors, process, contact, area
        
        KINDERGARTEN / GAN / גן ילדים:
        Critical: ages? hours (full day/partial)?
        Licensed? staff qualifications?
        Special programs? kosher food?
        Location, capacity
        Website must have: about, staff, program, hours, contact, gallery
        
        YOGA / PILATES STUDIO:
        Critical: yoga types? (vinyasa/yin/aerial)
        Group/private/both? reformer pilates?
        Schedule, drop-in or membership?
        Website must have: schedule, teachers, pricing, booking

        ═══════════════════════════════════════
        CREATIVE & EVENTS / יצירה ואירועים
        ═══════════════════════════════════════
        
        PHOTOGRAPHER / צלם:
        Critical: wedding/events/portraits/commercial/newborn?
        Video too? drone?
        Package pricing, turnaround time
        Website must have: portfolio by category, packages, booking, testimonials
        
        VIDEOGRAPHER / צלם וידאו:
        Critical: weddings/corporate/social media/music videos?
        Drone? editing included?
        Packages, turnaround
        Website must have: portfolio (video reels), packages, booking
        
        EVENT PLANNER / מארגן אירועים:
        Critical: weddings/corporate/bar mitzvah/birthday?
        Full service or partial? vendors network?
        Budget range, area
        Website must have: portfolio, services, packages, testimonials, contact
        
        GRAPHIC DESIGNER / מעצב גרפי:
        Critical: branding/print/digital/social media?
        Logo design? web design?
        Freelance or studio? turnaround time
        Website must have: portfolio, services, process, contact
        
        ═══════════════════════════════════════
        AUTOMOTIVE / רכב
        ═══════════════════════════════════════
        
        GARAGE / מוסך:
        Critical: private cars/trucks/motorcycles? brands?
        Repairs/maintenance/bodywork? towing?
        Authorized dealer? location
        Website must have: services, brands, location, contact, hours
        
        CAR DETAILING / פחחות וצביעה:
        Critical: detailing/ceramic coating/scratch repair?
        Mobile or shop? brands?
        Pricing packages, turnaround
        Website must have: services, before/after gallery, packages, contact
        
        ═══════════════════════════════════════
        DIGITAL & TECH / דיגיטל וטכנולוגיה  
        ═══════════════════════════════════════
        
        WEB DEVELOPER / מפתח אתרים:
        Critical: frontend/backend/fullstack? CMS/custom?
        E-commerce? apps?
        Hourly/project based? portfolio
        Website must have: portfolio, services, tech stack, contact
        
        DIGITAL MARKETING / שיווק דיגיטלי:
        Critical: social media/SEO/ads/all? specific platforms?
        Monthly retainer or project? reporting?
        Website must have: services, case studies, packages, contact
        
        COMPUTER REPAIR / תיקון מחשבים:
        Critical: home/office/both? which devices?
        Remote support? data recovery?
        Location or house calls? turnaround
        Website must have: services, area, pricing, contact, hours

        ═══════════════════════════════════════
        OTHER COMMON BUSINESSES
        ═══════════════════════════════════════
        
        TRANSLATION / תרגום:
        Critical: language pairs? certified/sworn?
        Technical/legal/medical specialization?
        Turnaround, per-word pricing?
        Website must have: languages, specializations, process, contact
        
        TRAVEL AGENT / סוכן נסיעות:
        Critical: packages/custom/business travel?
        Specialization (honeymoon/family/adventure)?
        Licensed, 24/7 support?
        Website must have: destinations, packages, about, contact
        
        TOUR GUIDE / מדריך טיולים:
        Critical: Israel/abroad/both? group size?
        Languages? specialization (religious/historical/nature)?
        Custom tours?
        Website must have: tours, languages, about, booking, gallery

        ═══════════════════════════════════════
        UNIVERSAL QUESTIONS (ask EVERYONE)
        ═══════════════════════════════════════
        
        1. Phone/WhatsApp number
        2. City/area or "digital only"
        3. Years in business (builds trust)
        4. Do you have existing logo?
        5. Existing website/Google Business/Instagram? (for import)
        
        ═══════════════════════════════════════
        IMPORTANT RULES
        ═══════════════════════════════════════
        
        - All questions to users must be in perfect, natural Hebrew
        - Never ask more than 7 questions total
        - Always offer "skip" option
        - Questions must flow naturally like a conversation
        - Use the specific category knowledge above to generate ONLY relevant questions
        - If business doesn't match any category, use the closest match + ask one open question
        """;
    }
}
