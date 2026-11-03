# Aura Organic — Herbal Teas, Superfoods & Wellness Tinctures Storefront

Aura Organic is a boutique digital apothecary and direct-to-consumer storefront dedicated to certified organic herbal infusions, adaptogenic superfoods, and artisanal botanical tinctures. Crafted with a warm terracotta and sun-drenched earth tone palette, it provides an intuitive, sensory shopping experience with ritual-based filtering, interactive wellness quiz, transparent sourcing glossary, and flexible subscription replenishment.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and aesthetic choices were confirmed during Phase 1 clarification:
> - **Product Domain**: Certified organic herbal teas, adaptogenic superfoods, and wildcrafted botanical wellness tinctures.
> - **Feature Scope**: Interactive cart drawer with checkout, multi-factor filterable catalog with quick-view modal, 3-step wellness ritual finder quiz with custom bundle builder, "Subscribe & Save" cadence toggles (30/45/60 days), and an interactive botanical ingredient sourcing glossary.
> - **Visual Direction**: Sun-drenched warm terracotta (`#C86D51`), raw linen/warm clay neutral surfaces (`#FAF7F2`, `#F4EFEA`), deep espresso slate typography (`#231E1B`), and muted botanical sage accents (`#6F7D67`).

- **Confirmed Decision 1**: Storefront catalog will showcase 9 artisanal SKUs across three primary product categories (Herbal Infusions, Botanical Tinctures, Adaptogen Superfood Powders).
- **Confirmed Decision 2**: Local reactive storage will manage cart items, subscription cadences, quiz recommendations, and active filters with zero lag and immediate visual feedback.

---

### 1. Overview & Core Concept

- **What It Does**: Provides a complete, responsive e-commerce web application where customers explore organic herbal remedies, take a personalized ritual quiz to discover targeted botanicals, examine certified organic sourcing and farm origins in a botanical glossary, configure one-time or recurring subscriptions, and complete order checkout.
- **Target Audience / Persona**: Mindful consumers, herbalists, wellness enthusiasts, and individuals seeking clean, single-origin botanicals for calm, sleep, stress adaptation, immune resilience, and daily vitality.
- **Key Value**: Bridges sensory apothecary heritage with modern digital commerce—eliminating overwhelming wellness jargon through clear benefit filters, ingredient traceability, and tailored wellness routines.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Catalog Exploration & Filtering**: Users browse products by category (`All`, `Herbal Teas`, `Tinctures`, `Superfoods`) or by target ritual (`Calm & Sleep`, `Focus & Energy`, `Digestive Harmony`, `Immune Defense`), with real-time search and sorting by popularity or price.
2. **Product Detail & Quick-View**: Clicking any product opens an expansive quick-view modal with high-resolution botanical imagery, tasting/aroma profiles, brewing/dosage rituals, full ingredient origins, and a subscription selector (`One-time` vs `Subscribe & Save 15%`).
3. **Wellness Ritual Finder Quiz**: A dedicated interactive 3-step modal/view asks for the user's primary wellness intention, preferred ritual time (morning, afternoon, dusk), and format preference. It calculates a customized 3-product bundle with a 15% bundle discount and a 1-click "Add Ritual Bundle to Cart" action.
4. **Botanical Sourcing Glossary**: An interactive drawer/section spotlighting key organic botanicals (Ashwagandha, Chamomile Flower, Reishi Mushroom, Lion's Mane, Holy Basil / Tulsi, Saffron, Lemon Balm), their harvest regions, extraction methods, and certified clinical benefits.
5. **Cart Drawer & Checkout Simulation**: Slide-over cart displaying itemized products, subscription cadence badges, delivery cadence selectors, free shipping progress bar, promo code validation, and a realistic multi-step checkout modal (Shipping, Payment options including Card/COD, Order Confirmation receipt).

#### Visual Identity & Theme
- **Aesthetic Direction**: Sun-drenched terracotta apothecary, tactile editorial elegance, warm organic paper textures, and generous spatial rhythm.
- **Color Palette**:
  - `Canvas / Background`: Sunlit Linen `#FAF7F2` and Warm Biscuit `#F4EFEA`
  - `Primary Terracotta Accent`: Rich Terracotta `#C86D51`, Deep Sienna `#B3563B`
  - `Botanical Sage Secondary`: Sun-dried Olive / Sage `#6F7D67`
  - `Text & Contrast`: Deep Roast Espresso `#231E1B`, Warm Sand Muted `#7A7067`
  - `Surface Hairlines`: Delicate Clay Border `rgba(180, 140, 120, 0.2)`
- **Typography & Scale**:
  - `Display / Headlines`: *Playfair Display* / *Fraunces* serif style for campaign titles and product titles (`clamp(2rem, 3.5vw, 3.25rem)`).
  - `Body & UI`: *Plus Jakarta Sans* / *DM Sans* geometric readability for descriptions, prices, tabs, and forms (15px–16px, 1.6 line height).
  - `Tabular Numbers`: `font-mono tabular-nums` for prices, cart counts, and dosages.
- **Top Bar Contract**:
  - Strict 3-zone layout: `Aura Organic` wordmark (left) — `[Shop Catalog, Ritual Quiz, Botanical Glossary, Sourcing]` (center) — `[Cart Drawer trigger with live badge count]` (right).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Client-Side Cart & Persistent State**:
  - *Chosen Approach*: React state synchronized with `localStorage` for cart items, active subscription preferences, and saved quiz results.
  - *Why*: Instantaneous cart animations, zero API latency, persistent across browser reloads, ideal for preview and client interaction.
  - *Alternatives Considered*: Server session cart (adds unnecessary server complexity and latency for a direct front-end showcase).
- **Decision 2: High-Quality Parallel Asset Generation**:
  - *Chosen Approach*: Generate 4 distinct, cohesive studio product photographs (amber dropper bottles, loose-leaf herbal blend tins, adaptogen powder jars, and a sunlit apothecary banner) via `generate_image` in a single parallel batch.
  - *Why*: Adheres to anti-slop guidelines and eliminates broken external Unsplash links with authentic terracotta and botanical textures.
- **Decision 3: Zero-Pill Metric Discipline & Anti-AI Slop**:
  - *Chosen Approach*: Clean unboxed metadata with `·` separators (e.g., `Organic · Single Origin · 50g`), clean segmented buttons for interactive filters, and avoidance of decorative pulsing badges or floating marketing tickers.

---

### 4. Technical Architecture & Data Strategy

#### System & Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App State                                 │
│  - cart (items, qty, cadence, subscribeMode)                           │
│  - filterCategory & filterBenefit & searchQuery                        │
│  - quickViewProduct (modal open/closed)                                │
│  - isCartOpen (drawer open/closed)                                     │
│  - isQuizOpen (quiz state, step 1..3, recommendation)                  │
│  - isGlossaryOpen / activeBotanical                                    │
│  - isCheckoutOpen / checkoutStep                                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼───────────────────────────┐
      ▼                            ▼                           ▼
┌──────────────┐          ┌───────────────────┐       ┌─────────────────┐
│ TopNav (3Z)  │          │   Hero Section    │       │ Sourcing Ribbon │
│ - Brand Link │          │ - Campaign Visual │       │ - Eco-harvested │
│ - Nav Links  │          │ - Value Prop      │       │ - 100% Organic  │
│ - Cart Button│          │ - Direct CTA      │       │ - Third-party   │
└──────────────┘          └───────────────────┘       └─────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────────┐
                   │        Shop Catalog Section       │
                   │ - Category Tabs & Benefit Filters │
                   │ - Live Search & Sorting           │
                   │ - Product Grid (3-col responsive) │
                   │   • Image & Origin Badge          │
                   │   • Title, Category, Rating       │
                   │   • Price & "Add to Cart" / Quick │
                   └───────────────────────────────────┘
                                   │
      ┌────────────────────────────┼───────────────────────────┐
      ▼                            ▼                           ▼
┌──────────────────┐      ┌──────────────────┐        ┌─────────────────┐
│ Ritual Quiz View │      │ Ingredient Modal │        │   Cart Drawer   │
│ - 3-Step Wizard  │      │ - Botanical Origin│       │ - Slide-over    │
│ - Bundle Builder │      │ - Extraction Spec │       │ - Subscribe Qty │
│ - 1-Click Add    │      │ - Clinical Benefit│       │ - Checkout Flow │
└──────────────────┘      └──────────────────┘        └─────────────────┘
```

#### Data Model Entities
- **Product**: `id`, `name`, `category`, `subCategory`, `price`, `subscriptionDiscountPrice`, `image`, `description`, `benefits` (array), `tastingNotes`, `volumeOrWeight`, `ingredients` (array), `brewingRitual`, `origin`, `rating`, `reviewsCount`.
- **CartItem**: `product`, `quantity`, `isSubscription`, `cadenceWeeks` (4, 6, or 8 weeks).
- **BotanicalIngredient**: `name`, `latinName`, `sourcingRegion`, `harvestMethod`, `clinicalEffects`, `featuredInProductIds`.
- **QuizOption**: `step`, `question`, `options` (label, icon, benefitTag).

---

### 5. Verification Plan

- **Compilation Check**: Run `compile_applet` to verify clean TypeScript compilation and zero bundle errors.
- **Interactive Smoke Tests**:
  1. Add products to cart (both one-time and subscription cadence); verify subtotal updates and badge counts adjust.
  2. Filter by Category (`Herbal Teas`, `Tinctures`, `Superfoods`) and Benefit tags (`Calm & Sleep`, `Focus`); verify product card updates smoothly.
  3. Open Quick View modal; inspect details, ingredients, dosage, and add directly to cart.
  4. Complete the 3-step Ritual Quiz; verify dynamic bundle generation and "Add Bundle" button.
  5. Open Botanical Glossary; verify modal details for herbs and origin maps.
  6. Execute checkout simulation flow; verify form validation and order receipt summary.
