# Feature Specification: Shopify Bookstore Website

**Feature Branch**: `001-shopify-bookstore`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "I am building a website for selling physical and e-books with shopify integration, I want to have a landing page and books overview page and a book detail page and a contact page and an about page."

## Clarifications

### Session 2026-06-01

- Q: Which pages are bilingual (English and Hungarian) vs single-language? → A: Bilingual EN/HU for landing, about, contact, and legal pages; books overview and book detail are Hungarian only.
- Q: Is age verification required? → A: Yes — popup to confirm the visitor is 18 years or older before book shopping access.
- Q: Which legal pages are in scope? → A: Standard legal set (privacy policy, terms & conditions, cookie policy) as bilingual generic pages, same language rules as other generic pages.
- Q: What happens if a visitor declines age verification? → A: (Inferred) They cannot access books overview, book detail, or checkout; bilingual generic pages remain available.
- Q: How is language chosen on bilingual pages? → A: (Inferred) Visitor-selectable EN/HU switcher on bilingual pages only; book pages display Hungarian with no switcher.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Confirm Age Before Shopping (Age Verification) (Priority: P1)

A first-time visitor must confirm they are at least 18 years old before they can browse the book catalog, open book details, or start checkout.

**Why this priority**: Age gating is a legal and trust requirement that must run before any commerce journey.

**Independent Test**: Visit the site as a new visitor; confirm the age popup appears; verify that declining blocks book pages and checkout while generic pages remain reachable.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on any page, **When** they have not yet confirmed their age, **Then** an age-verification popup is shown explaining that they must be 18 or older to shop for books.
2. **Given** the age-verification popup is shown, **When** the visitor confirms they are 18 or older, **Then** the popup closes and they can access books overview, book detail, and checkout flows.
3. **Given** the age-verification popup is shown, **When** the visitor declines or dismisses without confirming, **Then** they cannot access books overview, book detail, or checkout, but may still view bilingual generic pages (landing, about, contact, legal).
4. **Given** a visitor who previously confirmed their age, **When** they return in the same browser session, **Then** they are not asked again until the stored confirmation expires or is cleared.

---

### User Story 2 - Choose Site Language on Generic Pages (Priority: P1)

A visitor reads landing, about, contact, and legal content in English or Hungarian using a language control available only on those pages.

**Why this priority**: Language choice affects comprehension of trust, legal, and marketing content before purchase.

**Independent Test**: Open the landing page; switch EN ↔ HU; confirm content updates; navigate to books overview and confirm Hungarian-only presentation without a language switcher.

**Acceptance Scenarios**:

1. **Given** a visitor on a bilingual generic page, **When** the page loads, **Then** they can switch between English and Hungarian and see page content in the selected language.
2. **Given** a visitor selects Hungarian on a generic page, **When** they navigate to another bilingual generic page, **Then** that page opens in Hungarian unless they change language again.
3. **Given** a visitor on the books overview or a book detail page, **When** the page loads, **Then** all book-related labels and content are shown in Hungarian only and no language switcher is offered.
4. **Given** a visitor on a Hungarian-only book page, **When** they navigate to a bilingual generic page, **Then** the generic page respects their last selected bilingual language or a sensible default (Hungarian).

---

### User Story 3 - Discover the Bookstore (Landing Page) (Priority: P2)

A visitor arrives at the site and quickly understands what the bookstore offers, sees featured or promoted books, and can navigate to browse the full catalog or learn more about the shop—in their chosen language on this bilingual page.

**Why this priority**: The landing page is the primary entry point; without it, visitors lack orientation and a clear path to purchase.

**Independent Test**: Open the landing page in EN and HU; confirm value proposition, navigation, and path to books after age confirmation.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the landing page who has confirmed age, **When** the page loads in their selected language, **Then** they see the bookstore name, value proposition, and primary navigation to Books, About, Contact, and Legal in that language.
2. **Given** a visitor on the landing page, **When** they choose to explore books, **Then** they reach the Hungarian books overview page (after age verification if not yet done).
3. **Given** a visitor on the landing page, **When** they view featured content, **Then** they see at least one highlighted book or category that links to a book detail or the full catalog.

---

### User Story 4 - Browse the Catalog (Books Overview) (Priority: P3)

A visitor browses all available books in Hungarian, distinguishes physical copies from e-books, and opens a specific title for more information.

**Why this priority**: Browsing the catalog is the core shopping journey before purchase.

**Independent Test**: Navigate directly to the books overview after age confirmation; verify Hungarian UI and book list with format indication.

**Acceptance Scenarios**:

1. **Given** a visitor who confirmed age, **When** they open the books overview, **Then** they see all sellable books with Hungarian labels and each book's title, cover image, format (physical, e-book, or both), and price.
2. **Given** multiple books in the catalog, **When** a visitor selects a book, **Then** they are taken to that book's Hungarian detail page.
3. **Given** a visitor who has not confirmed age, **When** they attempt to open the books overview, **Then** they are prompted to complete age verification first.

---

### User Story 5 - View and Purchase a Book (Book Detail) (Priority: P4)

A visitor reads full information about a chosen book in Hungarian and completes purchase of a physical or e-book through the store's commerce flow.

**Why this priority**: Detail pages convert interest into sales and must support both product types the business sells.

**Independent Test**: Open a single book detail URL after age confirmation; verify Hungarian content and checkout entry per format.

**Acceptance Scenarios**:

1. **Given** a visitor on a book detail page, **When** the page loads, **Then** they see title, author, description, cover image, price, and available format(s) in Hungarian.
2. **Given** a book offered as a physical copy, **When** the visitor chooses to buy the physical edition, **Then** they enter the store's checkout flow for that product.
3. **Given** a book offered as an e-book, **When** the visitor chooses to buy the digital edition, **Then** they enter the store's checkout flow for that product.
4. **Given** a book offered in both formats, **When** the visitor views the page, **Then** they can choose either format before starting checkout.

---

### User Story 6 - Learn About the Bookstore (About Page) (Priority: P5)

A visitor reads about the bookstore's mission, story, or team in English or Hungarian before buying or contacting.

**Why this priority**: About content supports credibility but is not required to complete a purchase.

**Independent Test**: Open the about page in both languages; confirm brand story and navigation.

**Acceptance Scenarios**:

1. **Given** a visitor on the about page, **When** they switch language, **Then** they see who runs the bookstore and why it exists in the selected language.
2. **Given** a visitor on the about page, **When** they want to shop, **Then** they can navigate to the Hungarian books overview (subject to age verification).

---

### User Story 7 - Get in Touch (Contact Page) (Priority: P6)

A visitor sends a message in English or Hungarian without completing a purchase.

**Why this priority**: Contact supports service and trust but is secondary to catalog and checkout journeys.

**Independent Test**: Open the contact page in EN and HU; submit valid and invalid inquiries.

**Acceptance Scenarios**:

1. **Given** a visitor on the contact page, **When** they complete all required fields with valid information and submit, **Then** they receive confirmation in the active page language.
2. **Given** a visitor on the contact page, **When** they submit with missing or invalid required fields, **Then** they see validation guidance in the active page language.
3. **Given** a visitor on the contact page, **When** they need to shop, **Then** they can reach the Hungarian books overview via navigation (subject to age verification).

---

### User Story 8 - Read Legal Information (Legal Pages) (Priority: P7)

A visitor reviews privacy, terms, and cookie information in English or Hungarian.

**Why this priority**: Legal transparency is required for trust and compliance but does not block core shopping once policies are published.

**Independent Test**: Open each legal page in EN and HU; confirm readable policy content and navigation back to main site areas.

**Acceptance Scenarios**:

1. **Given** a visitor on a legal page, **When** the page loads, **Then** they see the policy content in the selected bilingual language (privacy, terms, or cookies as applicable).
2. **Given** a visitor on any legal page, **When** they use site navigation, **Then** they can return to landing, about, or contact without dead ends.

---

### Edge Cases

- What happens when the commerce platform is temporarily unavailable and a visitor tries to buy a book?
- How does the site behave when the catalog has no books yet?
- What happens when a book is listed but one format (physical or e-book) is out of stock or unavailable?
- How are duplicate or very long book titles displayed in the overview without breaking layout?
- What happens if a visitor submits the contact form with an invalid email address or empty message?
- How does navigation behave on small screens when all primary pages must remain reachable?
- What happens if a visitor clears browser storage—are age confirmation and language preference reset?
- What happens when a visitor deep-links directly to a book detail URL without prior age confirmation?
- What happens when bilingual content is missing for one language on a generic page (fallback behavior)?
- How does the age popup interact with screen readers and keyboard-only navigation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a dedicated landing page as the default entry experience, available in English and Hungarian.
- **FR-002**: The site MUST provide a books overview page listing all sellable books, in Hungarian only.
- **FR-003**: The site MUST provide a book detail page for each sellable book, reachable from the overview, in Hungarian only.
- **FR-004**: The site MUST provide dedicated About and Contact pages, each available in English and Hungarian.
- **FR-005**: The site MUST provide legal pages (privacy policy, terms & conditions, cookie policy), each available in English and Hungarian.
- **FR-006**: Bilingual pages (landing, about, contact, legal) MUST offer a visitor-controlled English/Hungarian language switch; book pages MUST NOT offer a language switch.
- **FR-007**: All pages MUST share consistent primary navigation appropriate to page type (including Legal where applicable).
- **FR-008**: The site MUST show an age-verification popup requiring confirmation of age 18+ before allowing access to books overview, book detail, or checkout.
- **FR-009**: If a visitor declines age verification, the site MUST block books overview, book detail, and checkout while still allowing access to bilingual generic pages.
- **FR-010**: Age confirmation MUST persist for the visitor across page views until cleared (browser storage/session policy defined in planning).
- **FR-011**: Each book listing MUST show at minimum: title, cover image, price, and format availability (physical, e-book, or both), with Hungarian presentation.
- **FR-012**: Each book detail MUST show at minimum: title, author, description, cover image, price, and format availability, with Hungarian presentation.
- **FR-013**: Visitors MUST be able to start purchase of a physical book from its detail page when that format is offered.
- **FR-014**: Visitors MUST be able to start purchase of an e-book from its detail page when that format is offered.
- **FR-015**: Purchases MUST be fulfilled through integrated store commerce (Shopify) so payment, tax, and order handling follow the platform's standard checkout.
- **FR-016**: Book catalog content MUST stay consistent with the integrated commerce catalog—visitors MUST NOT see buy options for products that are not actually for sale.
- **FR-017**: The contact page MUST collect visitor name, email, and message as required fields, with labels and validation messages in the active bilingual language.
- **FR-018**: The contact page MUST validate required fields before accepting a submission and MUST confirm successful submission in the active language.
- **FR-019**: The about page MUST present bookstore identity content in the active bilingual language.
- **FR-020**: The landing page MUST expose at least one path to the Hungarian books overview and highlight bookstore positioning in the active bilingual language.

### Key Entities

- **Book**: A sellable title; attributes include title, author, description, cover image, price, and format(s) offered (physical copy, e-book, or both). Presented in Hungarian on overview and detail pages.
- **Catalog**: The complete set of books on the Hungarian overview and detail pages; synchronized with the commerce platform.
- **Contact inquiry**: A message from a visitor; attributes include name, email, message body, and submission timestamp.
- **Legal page**: A policy document (privacy, terms, cookies) with English and Hungarian content variants.
- **Bilingual page**: Landing, About, Contact, or Legal—supports EN/HU via language switch.
- **Hungarian-only page**: Books overview or Book detail—no language switch; Hungarian UI and book content.
- **Age verification record**: Visitor confirmation of 18+ eligibility and timestamp/expiry of that confirmation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new visitor can switch landing page language (EN ↔ HU) in one action and see content update without reload errors.
- **SC-002**: A visitor who has not confirmed age cannot reach books overview or book detail without completing verification (0 successful bypasses in test scenarios).
- **SC-003**: A visitor who confirmed age can reach the books overview from the landing page in no more than two actions.
- **SC-004**: A visitor can open any listed book's detail page from the overview in no more than two actions.
- **SC-005**: A visitor can start checkout for a chosen format from the detail page in no more than two actions after landing on that page.
- **SC-006**: At least 90% of test participants correctly identify physical vs digital format on Hungarian book pages without leaving overview or detail.
- **SC-007**: A visitor can submit a complete contact inquiry in either language and see confirmation within 30 seconds under normal conditions.
- **SC-008**: All page types (landing, books overview, book detail, about, contact, each legal page) are reachable via navigation without dead ends, respecting age and language rules.
- **SC-009**: When the commerce platform is available, displayed prices on Hungarian book pages match checkout prices for that product.
- **SC-010**: Each legal page is readable in both English and Hungarian with content appropriate to the policy type.

## Assumptions

- Shopify is the commerce platform for catalog, cart, and checkout; visitors complete payment on Shopify's hosted or embedded checkout experience.
- The site owner already has (or will create) Shopify products for physical and e-book variants; bilingual marketing copy and Hungarian book copy are provided by the owner or content workflow.
- Book metadata on Hungarian pages is sourced from or kept in sync with the Shopify product catalog; Shopify checkout may follow Shopify's locale settings for payment flows.
- Age verification is self-declared (not ID-document verified) unless legal counsel requires stricter proof later.
- Age confirmation persistence uses browser storage for a reasonable session or duration (exact retention defined in planning).
- Default bilingual language for first-time visitors is Hungarian unless analytics show otherwise—planning may adjust.
- Visitor accounts on the marketing site are not required.
- Contact inquiries are delivered to the store owner; FAQ portal is out of scope for v1.
- Constitution note for planning: static-site delivery applies to marketing pages; Shopify integration and bilingual content structure must be justified in Complexity Tracking.
