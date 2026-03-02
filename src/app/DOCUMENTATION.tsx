/**
 * ============================================================================
 * VERIZON CX WORKBENCH - COMPLETE APPLICATION DOCUMENTATION
 * ============================================================================
 * Version: Latest (as of February 24, 2026)
 * Author: Product Analysis & UX Documentation
 * Classification: Internal - Executive Storytelling Demo
 * ============================================================================
 *
 *
 * ============================================================================
 * 1. APPLICATION OVERVIEW
 * ============================================================================
 *
 * 1.1 PURPOSE
 * -----------
 * Verizon CX Workbench is a comprehensive, static desktop web application
 * prototype designed for executive storytelling and stakeholder demonstration.
 * It simulates an end-to-end customer experience (CX) analytics measurement
 * platform that enables Business Analysts (BAs) to analyze, review, approve,
 * and ship analytics tagging recommendations powered by AI. The prototype
 * showcases a complete workflow from journey discovery through developer
 * handoff and post-deployment validation.
 *
 * 1.2 PRIMARY USERS
 * -----------------
 * - Business Analysts (BAs): Primary users who review AI-generated tagging
 *   recommendations, approve/reject/edit tags, enrich Jira ticket context,
 *   and ship approved artifacts to development.
 * - Lead Architects / Product Owners: Users who configure telemetry rules,
 *   manage data layer schemas, and oversee platform-wide analytics governance.
 * - Executives / Stakeholders: Viewers of the demo for strategic alignment,
 *   investment decisions, and platform capability understanding.
 * - Developers (Consumers): Recipients of developer packages containing
 *   approved tag specifications for implementation.
 *
 * 1.3 CORE BUSINESS OBJECTIVE
 * ---------------------------
 * To demonstrate the vision for an AI-powered CX measurement fabric that:
 * - Automates analytics tag discovery and recommendation from multiple sources
 *   (Figma designs, Jira tickets, existing data layer, analytics sync)
 * - Provides BA-initiated AI analysis workflows with human-in-the-loop
 *   approval for all recommendations
 * - Enables structured developer handoff with full tag specifications
 * - Validates deployed implementations against approved specifications
 * - Captures BA feedback to continuously improve AI recommendation quality
 * - Provides comprehensive telemetry governance (business rules, data layer
 *   schema, AI feedback logs, observability dashboards)
 *
 * 1.4 TECHNOLOGY STACK
 * --------------------
 * - Framework: React 18+ with TypeScript
 * - Styling: Tailwind CSS v4.0 with custom design tokens
 * - Routing: React Router (BrowserRouter with Routes/Route pattern)
 * - State Management: React Context API (ThemeContext, ChatContext)
 * - Animation: Motion (formerly Framer Motion), Lottie (lottie-react)
 * - UI Components: Custom component library + shadcn/ui primitives
 * - Carousels: react-slick with slick-carousel
 * - Resizable Panels: re-resizable
 * - Notifications: Sonner toast library
 * - Icons: lucide-react
 *
 * 1.5 COLOR PALETTE & DESIGN SYSTEM
 * ----------------------------------
 * - Primary Accent: Coral/Crimson (#EE0000 - Verizon Red)
 * - Dark Accent: Black/Zinc-900
 * - Background: White (light) / Dark zinc (dark mode)
 * - Surface layers: surface-primary, surface-secondary, surface-tertiary
 * - Status colors: Emerald (success), Amber (warning), Rose (error), Slate (neutral)
 * - Typography: Inter font family
 * - Border Radius: Rounded-2xl (cards), Rounded-xl (buttons), Rounded-full (badges)
 * - Light/Dark mode with full theme toggle support
 *
 *
 * ============================================================================
 * 2. GLOBAL NAVIGATION STRUCTURE
 * ============================================================================
 *
 * 2.1 APPLICATION SHELL LAYOUT
 * ----------------------------
 * The application uses a persistent three-zone layout:
 * - LEFT: Collapsible Sidebar (88px collapsed / 260px expanded)
 * - CENTER: Main Content Area (Header + Scrollable Content + ChatBot FAB)
 * - RIGHT: AI Fabric Panel (dockable left/right/float, resizable)
 *
 * 2.2 LEFT SIDEBAR (Persistent)
 * -----------------------------
 * Location: /src/app/components/Sidebar.tsx
 *
 * Navigation Items:
 * +-------+-------------+-------------------+-----------------------------+
 * | Order | Label       | Description       | Route                       |
 * +-------+-------------+-------------------+-----------------------------+
 * |   1   | Dashboard   | Explore & Create  | /playground                 |
 * |   2   | Journeys    | Unified Repository| /journeys                   |
 * |   3   | Telemetry   | Schema & Rules    | /tag-manager                |
 * +-------+-------------+-------------------+-----------------------------+
 *
 * Sidebar Features:
 * - Product branding: Verizon CX Workbench logo with Zap icon + red status dot
 * - Collapse/Expand toggle button with chevron icon
 * - Active route indicator: Left accent bar + highlighted background
 * - Theme Toggle (Light Mode / Dark Mode) in bottom section
 * - User Profile card: Shows "Abhinav Saxena" with "Lead Architect" role,
 *   profile image imported from figma:asset
 * - NavLink-based routing with pathname-based active state detection
 *
 * 2.3 GLOBAL HEADER (Persistent, Context-Sensitive)
 * --------------------------------------------------
 * Location: /src/app/components/Header.tsx
 *
 * The header renders THREE distinct variants based on the current route:
 *
 * A) Dashboard/Listing/TagManager Header (isDashboardRoute)
 *    Routes: /playground, /journeys, /tag-manager
 *    Contents:
 *    - Search bar: Full-width rounded search input with ESC key hint
 *      Placeholder: "Search journeys, tag namespaces, or registry..."
 *    - Right actions: Help button (tooltip), Notification bell (with red dot)
 *    - Height: 80px fixed
 *
 * B) Journey Details Header (journey routes)
 *    Routes: /playground/journey/:journeyId/*
 *    Contents:
 *    - LEFT: Back button (ChevronLeft) navigating to /playground,
 *      Journey name (h1), Status badge, Last updated timestamp
 *    - CENTER: Mode toggle pill with two options:
 *      * "Analyze" -> /playground/journey/:journeyId/overview
 *      * "Validate" -> /playground/journey/:journeyId/validation
 *      (Validate is disabled until validateEnabled flag is set in sessionStorage)
 *    - RIGHT: Review Progress counter (X / Y tags), progress bar,
 *      "Ship to Development" button (enabled when all tags reviewed)
 *    - Clicking "Ship to Development" opens ShippingConfirmationModal
 *
 * C) Fallback Header (non-journey, non-dashboard pages)
 *    Minimal header with 80px height
 *
 * 2.4 ROUTE MAP (Complete)
 * ------------------------
 * +-----------------------------------------------------+-----------------------------------+
 * | Route Pattern                                       | Component                          |
 * +-----------------------------------------------------+-----------------------------------+
 * | /                                                   | Redirect -> /playground            |
 * | /playground                                         | PlaygroundLanding                   |
 * | /journeys                                           | ActiveJourneys                      |
 * | /tag-manager                                        | TagManager                          |
 * | /playground/journey/:journeyId/overview             | JourneyOverview                     |
 * | /playground/journey/:journeyId/tagging              | Redirect -> ../overview             |
 * | /playground/journey/:journeyId/recommendations      | Redirect -> ../overview             |
 * | /playground/journey/:journeyId/artifacts            | DeveloperArtifacts                  |
 * | /playground/journey/:journeyId/package              | DeveloperPackage                    |
 * | /playground/journey/:journeyId/validation           | JourneyValidation                   |
 * | /jira/:ticketId/enrich                              | JiraContextEnrichment               |
 * | /playground/developer-artifacts                     | DeveloperArtifacts (standalone)      |
 * | /playground/developer-package                       | DeveloperPackage (standalone)        |
 * | /playground/jira-context-enrichment                 | JiraContextEnrichment (standalone)  |
 * | /dashboard                                          | Redirect -> /playground (legacy)    |
 * | /history                                            | Redirect -> /journeys (legacy)      |
 * +-----------------------------------------------------+-----------------------------------+
 *
 * 2.5 NAVIGATION UPDATES (Latest)
 * --------------------------------
 * - Legacy routes /dashboard and /history redirect to /playground and /journeys respectively
 * - Tagging and Recommendations routes redirect to Overview (consolidated)
 * - Developer Package removed from header mode toggle (was 3 tabs: Analyze/Dev/Validate,
 *   now 2 tabs: Analyze/Validate)
 * - Jira context enrichment accessible via /jira/:ticketId/enrich
 *
 *
 * ============================================================================
 * 3. MODULE-WISE BREAKDOWN
 * ============================================================================
 *
 * ============================================================================
 * MODULE 3.1: PLAYGROUND LANDING (Dashboard)
 * ============================================================================
 * File: /src/app/pages/PlaygroundLanding.tsx
 * Route: /playground
 *
 * PURPOSE:
 * Central hub and primary dashboard for the BA user. Provides a bird's-eye
 * view of all active work, assignments, and journey health across the platform.
 *
 * KEY FEATURES:
 * 1. Personalized welcome header with user name
 * 2. Grid/Kanban view toggle in header area
 * 3. Platform filter dropdown (All, Verizon Consumer, Verizon Business, Visible)
 * 4. "Start new journey" button (opens DemoNoticeModal)
 * 5. Quick Platform Insights (4 metric cards)
 * 6. My Jira Assignments carousel
 * 7. New Journeys Ready for Analysis carousel
 * 8. Implementation Validation Results carousel
 * 9. Existing Journeys carousel
 * 10. Recently Working On carousel
 * 11. Full Kanban board view (alternative to grid)
 *
 * USER ACTIONS:
 * - Toggle between Grid View and Kanban View
 * - Filter all data by platform (All / Verizon Consumer / Verizon Business / Visible)
 * - Click "Start new journey" to trigger demo notice modal
 * - Click on any Jira ticket card -> navigates to /jira/:ticketId/enrich
 * - Click on any journey card -> navigates to /playground/journey/:journeyId/overview
 * - Click on validation journey card -> navigates to /playground/journey/:journeyId/validation
 * - Click "View all" on any section -> navigates to /journeys with appropriate tab filter
 *
 * DATA DISPLAYED:
 *
 * A) Quick Platform Insights (4 Metric Cards):
 *    +------------------------+------------------+----------------------------+
 *    | Metric                 | Value Source      | Description                |
 *    +------------------------+------------------+----------------------------+
 *    | Active Journeys        | stats.total       | Total connected narratives |
 *    | Journeys In Progress   | stats.inProgress  | Currently being optimized  |
 *    | Tracking Coverage      | Static: 94.2%     | Across connected domains   |
 *    | Recent Activity        | Static: 3         | Updated in last 24 hrs     |
 *    +------------------------+------------------+----------------------------+
 *    Trend badge: Tracking Coverage shows "+0.4%"
 *
 * B) My Jira Assignments (JiraTicketCard carousel):
 *    Source: mockJiraTickets from /src/app/data/mockJiraTickets.ts
 *    Card displays: Ticket ID, Journey Name, Title, Platform badge,
 *    Priority badge (High/Medium/Low with color coding), Attachment count,
 *    Status badge, Due date, CTA text (Enrich Context / Begin Analysis / View Progress)
 *    Styled with blue gradient background and border
 *
 * C) New Journeys Ready For Analysis (JourneyCard carousel):
 *    Filter: mockJourneys where sourceType === 'Figma' || sourceType === 'Jira'
 *    Card displays: Screen preview thumbnail (scaled JourneyScreenGenerator),
 *    "Needs Review" overlay badge, Journey name, Goal description,
 *    Platform + Tracking Focus chips, Tag recommendation count, "Review journey" CTA
 *
 * D) Implementation Validation Results (JourneyCard carousel):
 *    Filter: Journeys with recommendations, proposed tags, and Jira/Figma source
 *    Card displays: Same as above but with "Ready to Validate" badge,
 *    emerald-colored "Begin validation" CTA
 *
 * E) Existing Journeys (JourneyCard carousel):
 *    Filter: mockJourneys where sourceType !== 'Figma' && sourceType !== 'Jira'
 *    Additional platform filter applied
 *    Card displays: Icon, Source label, Status badge, Journey name,
 *    Goal, Platform + Tracking Focus chips, Tag count, chevron CTA
 *
 * F) Recently Working On (JourneyCard carousel):
 *    Source: Top 4 existing journeys sorted by lastUpdated (descending)
 *    Card displays: Same as Existing but with "Updated X" timestamp instead of goal
 *
 * FILTERS / CONTROLS:
 * - Platform Dropdown: All | Verizon Consumer (vzw.com) | Verizon Business | Visible
 * - View Toggle: Grid View | Kanban View
 *
 * KANBAN VIEW:
 * Four-column Kanban board with color-coded headers:
 * +------------------+--------+--------------------------------+
 * | Column           | Color  | Data Source                     |
 * +------------------+--------+--------------------------------+
 * | To Do            | Blue   | mockJiraTickets (all)           |
 * | Ready for Analysis| Amber | newJourneysToReview             |
 * | Validation       | Emerald| readyForValidationJourneys      |
 * | Completed        | Slate  | Empty (placeholder)             |
 * +------------------+--------+--------------------------------+
 *
 * Kanban Card Types:
 * - KanbanTicketCard: Compact Jira card (priority dot, ticket ID, journey name,
 *   platform, due date)
 * - KanbanJourneyCard: Compact journey card (icon, review/validate badge,
 *   journey name, platform + tracking focus chips, tag count)
 *
 * STATUS WORKFLOWS:
 * - Jira Tickets: New -> Needs Context -> Ready for Analysis -> Analyzing -> In Review -> Completed
 * - Journeys: Not started -> In progress -> Completed -> Artifact generated
 * - Processing simulation: After Jira enrichment redirect, 5-second AI analysis
 *   simulation with toast notification on completion
 *
 * CAROUSEL CONFIGURATION:
 * - react-slick with custom NextArrow/PrevArrow components
 * - 4 slides visible at default, responsive: 3.2 at 1400px, 2.2 at 1100px, 1.2 at 768px
 * - Infinite: false, Speed: 500ms
 *
 *
 * ============================================================================
 * MODULE 3.2: JOURNEYS (Active Journeys / Unified Repository)
 * ============================================================================
 * File: /src/app/pages/ActiveJourneys.tsx
 * Route: /journeys
 *
 * PURPOSE:
 * Unified repository of all journeys detected across Analytics, Data Layer,
 * Figma designs, and Jira tickets. Serves as the master listing with
 * comprehensive filtering and dual view modes (List/Kanban).
 *
 * KEY FEATURES:
 * 1. Tab-based categorization (All, Existing Journeys, New Journeys to Review, Created)
 * 2. Context-aware multi-dimensional filtering
 * 3. Full-text search across journey names and goals
 * 4. List View with sortable table
 * 5. Kanban View with 4-column status board
 * 6. Per-tab metric cards
 * 7. "Create New Journey" button (opens DemoNoticeModal)
 * 8. Empty state for "Created Journeys" tab
 *
 * USER ACTIONS:
 * - Switch between tabs: All | Existing Journeys | New Journeys to Review | Created Journeys
 * - Apply filters: Platform, Channel, Status, Source, Business Area, Owner
 * - Search journeys by name, platform, or domain
 * - Toggle between List View and Kanban View
 * - Click any journey row/card to navigate to overview
 * - Clear all filters
 * - Create new journey (demo modal)
 *
 * DATA DISPLAYED:
 *
 * A) Tab Navigation:
 *    +----------+---------------------------+------------------------------------+
 *    | Tab ID   | Label                     | Filter Logic                        |
 *    +----------+---------------------------+------------------------------------+
 *    | All      | All                       | All mockJourneys                   |
 *    | Existing | Existing Journeys         | sourceType === 'System' or null    |
 *    | Review   | New Journeys to Review    | sourceType === 'Figma' or 'Jira'  |
 *    | Created  | Created Journeys          | sourceType === 'Manual'            |
 *    +----------+---------------------------+------------------------------------+
 *    (Note: initialTab can be set via navigation state from PlaygroundLanding)
 *
 * B) Filter Dropdowns (Context-Aware):
 *    +---------------+-------------------------------------------+--------------------+
 *    | Filter        | Options                                   | Available on Tabs  |
 *    +---------------+-------------------------------------------+--------------------+
 *    | Platform      | vzw.com, Verizon Business, Visible        | All tabs           |
 *    | Channel       | Web, Mobile, Hybrid                       | All, Existing, Review|
 *    | Status        | Not started, In progress, Completed, etc  | All, Existing, Created|
 *    | Source        | Figma Design, Jira Ticket, Analytics Sync,| All, Existing      |
 *    |               | Data Layer Discovery                      |                    |
 *    | Business Area | Sales, Growth, Service, Retention, etc    | All, Existing, Review|
 *    | Owner         | Abhinav Saxena, Sarah Chen, etc           | Created            |
 *    +---------------+-------------------------------------------+--------------------+
 *
 * C) Metric Cards (3):
 *    - Total Journeys (filtered count)
 *    - Journeys In Progress (status === 'In progress')
 *    - Completed / Optimized (status === 'Completed' or 'Artifact generated')
 *
 * D) List View Table Columns:
 *    Journey (icon + name + source) | Status | Platform | Channel | Domain | Last Updated | Arrow
 *
 * E) Kanban View Columns:
 *    +--------------------+----------------------------+-----------------------+
 *    | Column             | Statuses Included          | Color                 |
 *    +--------------------+----------------------------+-----------------------+
 *    | Ready for Analysis | Not started                | Amber (border-t)      |
 *    | In Progress        | In progress                | Blue (border-t)       |
 *    | Sent to Dev        | Artifact generated         | Purple (border-t)     |
 *    | Completed          | Completed                  | Emerald (border-t)    |
 *    +--------------------+----------------------------+-----------------------+
 *    Kanban cards show: icon, name, source, platform, channel, domain, timestamps
 *
 * FILTERS / CONTROLS:
 * - All filter dropdowns are <FilterDropdown> components with search and highlight
 * - "Clear Filters" button appears when any filter is active
 * - Filtered results count shown: "Showing X of Y Results"
 * - View toggle: List View (LayoutList) | Kanban View (LayoutGrid)
 *
 *
 * ============================================================================
 * MODULE 3.3: JOURNEY OVERVIEW (Analyze Mode)
 * ============================================================================
 * File: /src/app/pages/JourneyOverview.tsx
 * Route: /playground/journey/:journeyId/overview
 *
 * PURPOSE:
 * The primary workspace for Business Analysts to review AI-generated tagging
 * recommendations for a specific journey. Features a three-panel layout with
 * visual screen preview, tag management, and data inspection capabilities.
 *
 * KEY FEATURES:
 * 1. Loading screen with LottieFiles animation (4-step progression)
 * 2. Three-panel collapsible layout (Left: Journey Context | Center: Screen Preview | Right: Tag Review)
 * 3. Step-by-step journey navigation
 * 4. Visual screen preview with interactive tag hotspots
 * 5. Tag approval workflow (Accept / Reject / Edit per tag)
 * 6. Rejection reason modal with AI feedback loop
 * 7. Data Layer tab with full CRUD operations
 * 8. User Interactions tab
 * 9. System Events tab with full CRUD operations
 * 10. AI Context Sources panel
 * 11. Manual tagging mode (click on screen to place tags)
 * 12. Editable journey goal
 * 13. Dynamic canvas scaling based on container width
 * 14. Filter tags by approval status
 *
 * USER ACTIONS:
 * - Navigate between journey steps using step navigation
 * - Click tag hotspots on screen preview to open TagTooltip
 * - Accept tag recommendation (toggles Approved state)
 * - Reject tag recommendation (opens RejectionReasonModal)
 * - Edit tag recommendation (inline editing in SidebarTagCard)
 * - Edit data layer key-value pairs (inline CRUD)
 * - Add new fields to Data Layer sections (Page Attributes, Journey Context, User Context)
 * - Delete data layer fields
 * - Edit System Events fields (inline CRUD)
 * - Add/Delete System Events fields
 * - Toggle left/right panel visibility
 * - Toggle AI Context Sources panel
 * - Enter manual tagging mode (click screen to place new tags)
 * - Edit journey goal inline
 * - Filter tags by status: All | Approved | Rejected | Proposed
 * - Collapse/expand journey details panel
 *
 * DATA DISPLAYED:
 *
 * A) Loading Screen (First Visit):
 *    - LottieLoader animation (TECHNICAL variant, 180px)
 *    - 4-step progress messages with animated dots:
 *      1. "Gathering journey signals"
 *      2. "Generating optimization goal"
 *      3. "Mapping journey sequence"
 *      4. "Preparing recommendations"
 *    - Stored in sessionStorage to skip on revisit
 *
 * B) Left Panel - Journey Context:
 *    - Journey details (name, status, category, platform)
 *    - Optimization goal (editable textarea)
 *    - Step navigation (step cards with active highlighting)
 *    - Journey metadata (environment link, tracking focus, source)
 *    - AI Context Sources toggle
 *
 * C) Center Panel - Screen Preview Canvas:
 *    - JourneyScreenGenerator renders mock UI based on journey and step data
 *    - Tag hotspot markers overlay on the screen preview
 *    - Dynamic scaling (ResizeObserver) to fit container width
 *    - Manual tagging mode: crosshair cursor, click to place tag
 *    - Manually placed tag indicators
 *
 * D) Right Panel - Tag Review & Data Inspection:
 *    Three tabs using shadcn Tabs component:
 *
 *    D.1) Data Layer Tab:
 *         - Enhanced enterprise-scale data layer viewer
 *         - Key-value pairs organized in sections:
 *           * Page Attributes (page_name, page_url, page_category)
 *           * Journey Context (journey_name, journey_stage, step_number, step_total)
 *           * User Context (platform)
 *         - Full CRUD operations:
 *           * Edit: Click value cell -> inline text input -> Enter to save
 *           * Add: "Add Field" button per section -> adds field within that section
 *           * Delete: Trash icon per row (confirmation not required)
 *         - Custom fields added inline within their respective sections
 *         - Field validation (no duplicate keys)
 *         - Section headers with field counts
 *
 *    D.2) User Interactions Tab (EnhancedUserInteractionsInfo):
 *         - Tag review cards (SidebarTagCard components)
 *         - Per-tag approval/rejection/editing
 *         - Priority badges (High/Medium)
 *         - Event type, level, context metadata
 *         - Data layer key-value preview table (top 8 keys)
 *         - Rejection feedback indicator with AI submission confirmation
 *         - Filter by approval status
 *
 *    D.3) System Events Tab (EnhancedSystemEventsInfo):
 *         - System event cards with expandable details
 *         - Full CRUD operations on event fields
 *         - Edit: Click key or value -> inline editing
 *         - Add: "Add Field" button on expanded card
 *         - Delete: Trash icon per field row
 *         - Event types: pageLoad, bannerDisplayed, promoImpression, etc.
 *
 * AI CAPABILITIES:
 * - AI-generated tag recommendations with confidence levels (High/Medium/Low)
 * - AI-recommended tag names, event types, levels, and context
 * - AI-generated business value descriptions per tag
 * - AI Context Sources panel showing sources used for analysis:
 *   * Slack messages, Email threads, Meeting recordings, Figma files,
 *     Jira tickets, External documents
 *   * Each source: toggle include/exclude, preview content, metadata
 * - Rejection reason feedback loop to improve AI:
 *   * 7 predefined reasons + "Other"
 *   * Scope selection: local (this journey only) or global (future journeys)
 *   * Additional context text field
 *   * Feedback indicator on rejected tags shows "Feedback submitted to AI"
 *
 * STATUS WORKFLOWS:
 * - Tag States: Proposed -> Approved | Rejected
 * - Rejected tags show: strikethrough text, purple "Feedback submitted to AI" badge
 * - Progress tracked in sessionStorage and reflected in header progress bar
 * - When all tags reviewed (accepted + rejected), "Ship to Development" enables
 *
 *
 * ============================================================================
 * MODULE 3.4: DEVELOPER ARTIFACTS
 * ============================================================================
 * File: /src/app/pages/DeveloperArtifacts.tsx
 * Route: /playground/journey/:journeyId/artifacts
 *
 * PURPOSE:
 * Generates and displays developer-ready implementation artifacts based on
 * approved tag recommendations. Provides code snippets, journey maps,
 * and implementation checklists for the development team.
 *
 * KEY FEATURES:
 * 1. Loading screen with LottieFiles animation
 * 2. Collapsible three-panel layout
 * 3. Step-by-step artifact generation
 * 4. Code snippet viewer with copy functionality
 * 5. JSON schema export
 * 6. Journey stepper navigation (Analyze -> Developer Package -> Validate)
 * 7. Implementation checklist
 * 8. Tag acceptance tracking synced with JourneyOverview
 *
 * USER ACTIONS:
 * - Navigate between journey steps
 * - View code snippets for each approved tag
 * - Copy code to clipboard
 * - Download artifacts
 * - Navigate to validation
 *
 *
 * ============================================================================
 * MODULE 3.5: DEVELOPER PACKAGE
 * ============================================================================
 * File: /src/app/pages/DeveloperPackage.tsx
 * Route: /playground/journey/:journeyId/package
 *
 * PURPOSE:
 * Packages all approved analytics specifications into a structured
 * developer handoff document. Summarizes data layer tags, user interactions,
 * and system events approved during the Analyze phase.
 *
 * KEY FEATURES:
 * 1. Package summary with categorized tag counts
 * 2. Expandable package contents viewer
 * 3. "Send to Development" workflow with confirmation modal
 * 4. Post-send success state
 * 5. Categories:
 *    - Data Layer Tags (page-level events)
 *    - User Interactions (click/submit/change events)
 *    - System Events (remaining events)
 *
 * USER ACTIONS:
 * - Expand/collapse package contents
 * - Review categorized approved tags
 * - Click "Send to Development" -> Confirmation modal
 * - Confirm sending -> Success state with navigation options
 *
 * DATA DISPLAYED:
 * - Package summary counts per category
 * - Individual tag names per category
 * - BA comment count
 * - Journey metadata (name, ID)
 *
 *
 * ============================================================================
 * MODULE 3.6: JOURNEY VALIDATION
 * ============================================================================
 * File: /src/app/pages/JourneyValidation.tsx
 * Route: /playground/journey/:journeyId/validation
 *
 * PURPOSE:
 * Post-deployment validation dashboard that runs automated agents to verify
 * implemented analytics tags match approved specifications. Simulates
 * multi-environment validation (Dev/QA/Stage).
 *
 * KEY FEATURES:
 * 1. Loading screen with LottieFiles animation
 * 2. Multi-agent validation system (5 agents)
 * 3. Environment selector (Dev / QA / Stage)
 * 4. Per-tag validation results with pass/warning/fail status
 * 5. Collapsible panel layout
 * 6. Validation summary statistics
 *
 * VALIDATION AGENTS:
 * +---+------------------------+-------------------------------+----------+
 * | # | Agent Name             | Description                   | Status   |
 * +---+------------------------+-------------------------------+----------+
 * | 1 | Tag Presence Agent     | DOM element verification      | Pass     |
 * | 2 | Event Consistency Agent| Schema name matching          | Warning  |
 * | 3 | Data Payload Agent     | Key-value structure validation| Pass     |
 * | 4 | Sequencing Agent       | Event order verification      | Pass     |
 * | 5 | Coverage Agent         | Missing tag detection         | Warning  |
 * +---+------------------------+-------------------------------+----------+
 *
 * USER ACTIONS:
 * - Switch between environments (Dev / QA / Stage)
 * - View agent-level validation results
 * - Expand/collapse validation detail cards
 * - View per-tag pass/warning/fail indicators
 * - Download validation report
 * - Toggle left/right panels
 *
 *
 * ============================================================================
 * MODULE 3.7: JIRA CONTEXT ENRICHMENT
 * ============================================================================
 * File: /src/app/pages/JiraContextEnrichment.tsx
 * Route: /jira/:ticketId/enrich
 *
 * PURPOSE:
 * BA-initiated workflow for enriching Jira ticket context before AI analysis.
 * The BA reviews AI-auto-detected sources (Slack, Email, Figma, Meeting
 * recordings, documents) and can toggle which sources to include in the
 * analysis, preview source content, and add manual context.
 *
 * KEY FEATURES:
 * 1. Ticket metadata header (ID, journey name, title, description)
 * 2. Acceptance criteria list from Jira ticket
 * 3. AI-detected context sources with toggle controls
 * 4. Source preview panel (Figma frames, email content, meeting transcripts)
 * 5. Figma screenshot integration (6 imported Figma frame assets)
 * 6. "Begin AI Analysis" CTA triggering analysis workflow
 * 7. Manual source upload capability
 * 8. Source type badges (AUTO / MANUAL)
 *
 * AI-DETECTED SOURCE TYPES:
 * - Figma: Designer files with frame thumbnails
 * - Slack: Channel messages with thread context
 * - Email: Thread summaries with sender/date metadata
 * - Meeting Recording: Video with transcript and attendee list
 * - Jira: Linked tickets with acceptance criteria
 * - External Document: PRDs, specs, requirements docs
 *
 * USER ACTIONS:
 * - Review ticket metadata and acceptance criteria
 * - Toggle AI-detected sources on/off for analysis inclusion
 * - Preview source content (inline expansion)
 * - View Figma frame thumbnails
 * - Read email/Slack content
 * - Watch meeting recording preview with transcript
 * - Add manual sources
 * - Click "Begin AI Analysis" -> redirects to /playground with processing state
 * - Navigate back to dashboard
 *
 * DATA DISPLAYED:
 * - Jira ticket: ticketId, journeyName, title, description, acceptanceCriteria,
 *   status, assignedTo, createdDate, dueDate, priority, platform, category
 * - AI sources: type, title, summary, addedBy, dateDetected, enabled flag,
 *   metadata (fileName, lastUpdated, owner, subject, sender, date, duration, attendees),
 *   fullContent, transcript, figmaFrames
 * - 6 imported Figma screenshot assets (support landing, inquiry category,
 *   account access, agent interaction, resolution summary, customer survey)
 *
 *
 * ============================================================================
 * MODULE 3.8: TELEMETRY (Tag Manager)
 * ============================================================================
 * File: /src/app/pages/TagManager.tsx
 * Route: /tag-manager
 *
 * PURPOSE:
 * Platform-wide telemetry governance module for managing business rules,
 * data layer variable schemas, AI feedback logs, and system observability.
 *
 * KEY FEATURES:
 * 1. Four-tab interface: Business Rules | Data Layer | AI Feedback | Observability
 * 2. Full CRUD operations on business rules and data layer variables
 * 3. Advanced filtering and search per tab
 * 4. Pagination for data layer variables
 * 5. Bulk selection with checkbox support
 * 6. AI Feedback Log with rejection history
 * 7. Observability dashboard with analysis metrics
 *
 * TAB BREAKDOWN:
 *
 * A) Business Rules Tab:
 *    - Table of rules governing AI tagging behavior
 *    - 20 predefined rules (e.g., Button Click Priority, Page View Requirement, etc.)
 *    - Columns: Name, Description, Status (Active/Inactive), Source (System/User-defined), Last Modified
 *    - CRUD operations:
 *      * Add: "Add Rule" button -> BusinessRuleModal (name, description, status, source)
 *      * Edit: Click rule -> EditRuleModal
 *      * Toggle status: Active <-> Inactive
 *      * Delete: Delete confirmation
 *    - Filters: Search, Status (all/Active/Inactive), Source (all/System/User-defined)
 *    - Pagination support
 *
 * B) Data Layer Tab:
 *    - Schema registry for data layer variables
 *    - 6 predefined variables (page_name, page_category, user_segment, journey_stage, device_type, ab_test_variant)
 *    - Columns: Variable Name, Description, Acceptable Values, Type, Scope, Required, Source
 *    - CRUD operations:
 *      * Add: "Add Variable" button -> DataLayerVariableModal
 *      * Edit: Click variable -> EditDataLayerVariableModal
 *      * Delete: Individual or bulk delete
 *      * Bulk select with "Select All" checkbox
 *    - Filters: Search, Type (string/enum/number/boolean/array/object),
 *      Scope (page/session), Source (AI-suggested/User-added), Required-only toggle
 *    - Pagination: Configurable rows per page (25 default)
 *    - Bulk actions: Delete selected, Export selected
 *
 * C) AI Feedback Tab:
 *    Component: AIFeedbackLog (/src/app/components/AIFeedbackLog.tsx)
 *    - Historical log of all BA rejection feedback submitted to AI
 *    - Entries: Journey ID, Journey Name, Recommendation Type, Recommendation Name,
 *      Rejection Reason, Additional Context, Applied Scope, Status, Date, BA Name
 *    - Statuses: training_applied | pending | processed
 *    - Filter by recommendation type, status
 *    - Search functionality
 *    - Integration with AI Panel for context
 *
 * D) Observability Tab:
 *    Component: Observability (/src/app/components/Observability.tsx)
 *    - AI analysis metrics and performance monitoring
 *    - Analysis details: journey-level confidence scores, agent performance
 *    - Trending data (accuracy improvement over time)
 *    - Context source breakdown
 *    - Integration with AI Panel for drill-down
 *
 * FILTERS / CONTROLS (Tab-specific):
 * - Business Rules: Search, Status dropdown, Source dropdown
 * - Data Layer: Search, Type dropdown, Scope dropdown, Source dropdown,
 *   Required-only toggle, Rows per page selector
 * - AI Feedback: Search, Type filter, Status filter, Export
 * - Observability: Time range, Analysis ID filter
 *
 *
 * ============================================================================
 * 4. DASHBOARD DETAILS
 * ============================================================================
 *
 * 4.1 WIDGETS
 * -----------
 * MetricCard (Reused across PlaygroundLanding, ActiveJourneys, TagManager):
 * - Icon (left, 40x40 rounded-lg background)
 * - Label (11px uppercase tracking-widest)
 * - Value (24-28px bold)
 * - Subtext (12px muted)
 * - Optional trend badge (emerald for positive)
 * - Hover shadow elevation
 *
 * 4.2 KPIs
 * --------
 * PlaygroundLanding:
 * - Active Journeys: Dynamic count from filtered journey list
 * - Journeys In Progress: Filtered by status 'In progress'
 * - Tracking Coverage: Static 94.2% with +0.4% trend
 * - Recent Activity: Static 3 (updated in last 24 hrs)
 *
 * ActiveJourneys:
 * - Total Journeys: Filtered by active tab + filters
 * - Journeys In Progress: Count of 'In progress' status
 * - Completed / Optimized: Count of 'Completed' or 'Artifact generated'
 *
 * 4.3 CHARTS
 * ----------
 * No dedicated chart widgets (recharts not currently used). Visual metrics
 * are displayed through:
 * - Progress bars (header review progress, validation agents)
 * - Numeric counters with trend badges
 * - Status distribution in Kanban columns
 *
 * 4.4 DATA CARDS
 * --------------
 * JourneyCard: Multi-purpose card with screen preview, metadata, tags, CTA
 * JiraTicketCard: Jira-styled card with ticket ID, priority, status, due date
 * KanbanTicketCard: Compact Jira card for Kanban view
 * KanbanJourneyCard: Compact journey card for Kanban view
 * SidebarTagCard: Tag review card with approval actions and data layer preview
 *
 * 4.5 KANBAN VIEWS
 * ----------------
 * Two independent Kanban implementations:
 *
 * A) PlaygroundLanding Kanban (viewMode === 'kanban'):
 *    - 4 columns: To Do | Ready for Analysis | Validation | Completed
 *    - Mixed card types (JiraTicketCard, JourneyCard)
 *    - Color-coded column headers (blue, amber, emerald, slate)
 *    - Empty state message for Completed column
 *    - Min-width 300px per column, horizontal scroll
 *
 * B) ActiveJourneys Kanban (viewMode === 'kanban'):
 *    - 4 columns: Ready for Analysis | In Progress | Sent to Dev | Completed
 *    - All journey cards (same card type)
 *    - Color-coded top border (amber, blue, purple, emerald)
 *    - Empty state placeholder per column
 *    - Filtered by active tab + search + filters
 *
 * 4.6 INTERACTION PATTERNS
 * ------------------------
 * - Hover: Border accent color, shadow elevation, scale transforms
 * - Click: Navigate to detail page, expand card, toggle state
 * - Keyboard: Enter/Space activate buttons, Escape cancels modes
 * - Focus: ring-2 ring-accent for accessibility
 * - Active states: Scale-95 on active:scale-95 buttons
 * - Transitions: 200-300ms for colors, 300-500ms for layout changes
 *
 *
 * ============================================================================
 * 5. WORKFLOW FLOWS
 * ============================================================================
 *
 * 5.1 END-TO-END USER JOURNEY (Primary Flow)
 * -------------------------------------------
 *
 * FLOW A: Jira-Initiated Journey (BA receives ticket)
 *
 * Step 1: BA lands on Dashboard (/playground)
 *         -> Views "My Jira Assignments" carousel
 *         -> Clicks on Jira ticket card
 *
 * Step 2: Jira Context Enrichment (/jira/:ticketId/enrich)
 *         -> Reviews ticket metadata and acceptance criteria
 *         -> Reviews AI-auto-detected context sources (Slack, Figma, Email, etc.)
 *         -> Toggles sources on/off for inclusion
 *         -> Previews source content
 *         -> Clicks "Begin AI Analysis"
 *
 * Step 3: Redirect to Dashboard with processing state
 *         -> Processing animation on ticket card (5 seconds)
 *         -> Toast notification: "AI Analysis Complete"
 *         -> Ticket status updates to "Ready for Review"
 *
 * Step 4: BA clicks on completed journey -> Journey Overview (/playground/journey/:id/overview)
 *         -> Loading animation (4-step Lottie, first visit only)
 *         -> Three-panel workspace opens
 *
 * Step 5: Tag Review in Journey Overview
 *         -> BA navigates through journey steps
 *         -> Reviews AI-recommended tags on screen preview
 *         -> For each tag: Accept, Reject (with reason), or Edit
 *         -> Reviews/Edits Data Layer tab values
 *         -> Reviews System Events
 *         -> Progress tracked in header (X/Y tags reviewed)
 *
 * Step 6: Ship to Development (Header button enables when all tags reviewed)
 *         -> Clicks "Ship to Development"
 *         -> ShippingConfirmationModal opens
 *         -> Reviews package summary (Data Layer, User Interactions, System Events)
 *         -> Confirms shipment
 *         -> Navigates to Developer Package or Validation
 *
 * Step 7: Validation (/playground/journey/:id/validation)
 *         -> 5 validation agents run automatically
 *         -> Results displayed per-tag with pass/warning/fail
 *         -> Environment selector (Dev/QA/Stage)
 *         -> Download validation report
 *
 * FLOW B: Figma-Initiated Journey (Auto-detected from design)
 *
 * Step 1: BA lands on Dashboard
 *         -> Views "New Journeys Ready for Analysis" carousel
 *         -> Clicks journey card with "Needs Review" badge
 *
 * Step 2-7: Same as Flow A Steps 4-7
 *
 * FLOW C: Existing Journey Review
 *
 * Step 1: BA lands on Dashboard or Journeys page
 *         -> Selects existing journey from carousel or list
 *         -> Navigates directly to Journey Overview
 *
 * Step 2-7: Same as Flow A Steps 4-7
 *
 * 5.2 STATE TRANSITIONS
 * ----------------------
 * Tag Review States:
 *   Proposed  ----[Accept]----> Approved
 *   Proposed  ----[Reject]----> Modal -> Rejected (with feedback)
 *   Approved  ----[Toggle]----> Proposed (re-opens for review)
 *   Rejected  ----[Toggle]----> Proposed (re-opens for review)
 *
 * Journey Processing States:
 *   New Ticket -> Context Enrichment -> AI Processing (5s) -> Ready for Review
 *   Ready for Review -> In Analysis (tag review) -> Artifact Generated (all reviewed)
 *   Artifact Generated -> Validation -> Completed
 *
 * Session Storage Keys:
 *   vzw-seen-journey-{journeyId}     : Skip loading screen on revisit
 *   vzw-journey-stats-{journeyId}    : { accepted, total } for header progress
 *   vzw-artifacts-enabled-{journeyId}: Enable developer artifacts navigation
 *   vzw-validation-enabled-{journeyId}: Enable validation navigation
 *   vzw-context-opened-analyze       : Auto-expand context panel on first visit
 *
 * 5.3 CONDITIONAL LOGIC
 * ---------------------
 * - "Ship to Development" enabled only when: accepted === total && total > 0
 * - "Validate" tab enabled only when: sessionStorage flag set or already on validation page
 * - Platform filter applies to: Existing Journeys, Recently Working On, Metric calculations
 * - Tab-specific filters appear/disappear based on active tab in Journeys page
 * - Loading screen skipped on subsequent visits (sessionStorage check)
 * - Processing ticket simulation only triggers when coming from Jira enrichment page
 *
 *
 * ============================================================================
 * 6. DATA LAYER CHANGES
 * ============================================================================
 *
 * 6.1 DATA LAYER SCHEMA (Journey Overview - Data Layer Tab)
 * ---------------------------------------------------------
 *
 * Section: Page Attributes
 * +---------------+------------------------------------------+-----------+
 * | Field         | Default Value                            | Editable  |
 * +---------------+------------------------------------------+-----------+
 * | page_name     | Current step name                        | Yes       |
 * | page_url      | Auto-generated from journey/step names   | Yes       |
 * | page_category | Journey category                         | Yes       |
 * +---------------+------------------------------------------+-----------+
 *
 * Section: Journey Context
 * +---------------+------------------------------------------+-----------+
 * | Field         | Default Value                            | Editable  |
 * +---------------+------------------------------------------+-----------+
 * | journey_name  | Journey name                             | Yes       |
 * | journey_stage | Step screen template                     | Yes       |
 * | step_number   | Current step index + 1                   | Yes       |
 * | step_total    | Total steps count                        | Yes       |
 * +---------------+------------------------------------------+-----------+
 *
 * Section: User Context
 * +---------------+------------------------------------------+-----------+
 * | Field         | Default Value                            | Editable  |
 * +---------------+------------------------------------------+-----------+
 * | platform      | Journey platform (Web/Mobile/Hybrid)     | Yes       |
 * +---------------+------------------------------------------+-----------+
 *
 * 6.2 FIELD OPERATIONS (CRUD)
 * ---------------------------
 * - ADD: "Add Field" button appears within each section header.
 *   New fields are inserted directly into their parent section
 *   (Page Attributes, Journey Context, or User Context).
 *   Each custom field gets a unique ID and is tracked in customFields state
 *   with a `section` property indicating which section it belongs to.
 *
 * - EDIT: Click on any value cell to enter inline edit mode.
 *   Press Enter to save, Escape to cancel.
 *   Edited values update the editableDataLayer state.
 *
 * - DELETE: Click trash icon on any row (including custom fields).
 *   Deleted standard fields tracked in deletedKeys Set.
 *   Custom fields removed from customFields array.
 *
 * - VALIDATION: Duplicate key names are prevented with error messages.
 *
 * 6.3 SYSTEM EVENTS CRUD
 * -----------------------
 * - Events displayed as expandable cards
 * - Each event has key-value fields
 * - ADD: "Add Field" button on expanded event card
 * - EDIT: Click key or value -> inline text input
 * - DELETE: Trash icon per field row
 * - Tracked in editableSystemEvents and deletedEventKeys state
 *
 * 6.4 TELEMETRY DATA LAYER VARIABLES (Tag Manager)
 * -------------------------------------------------
 * +------------------+--------------------------------------------+----------+----------+----------+
 * | Variable         | Description                                | Type     | Scope    | Source   |
 * +------------------+--------------------------------------------+----------+----------+----------+
 * | page_name        | Human-readable page identifier             | string   | page     | AI       |
 * | page_category    | Top-level site section                     | enum     | page     | AI       |
 * | user_segment     | Customer classification                   | enum     | session  | AI       |
 * | journey_stage    | Current funnel position                    | enum     | page     | User     |
 * | device_type      | User device classification                 | enum     | session  | AI       |
 * | ab_test_variant  | Active experiment variant                  | enum     | session  | User     |
 * +------------------+--------------------------------------------+----------+----------+----------+
 *
 * 6.5 BUSINESS LOGIC UPDATES
 * --------------------------
 * - Custom fields now insert into their respective parent section rather than
 *   a separate "Custom Fields" section (which was removed)
 * - Field section assignment tracked via `section` property in customFields state
 * - Data layer values auto-initialize when step changes (page_name, page_url update)
 * - Session storage persists review progress across navigation
 *
 *
 * ============================================================================
 * 7. ROLE-BASED ACCESS
 * ============================================================================
 *
 * 7.1 PASSWORD PROTECTION
 * -----------------------
 * Component: PasswordGate (/src/app/components/PasswordGate.tsx)
 * - Wraps entire application
 * - Password: "rdvr@9705"
 * - Stored in localStorage (key: verizon_cx_workbench_auth)
 * - Branded login page with Verizon gradient (coral/crimson)
 * - Show/hide password toggle
 * - Error state for incorrect password
 * - Loading spinner while checking auth status
 *
 * 7.2 USER IDENTITY
 * -----------------
 * - Static user: "Abhinav Saxena" with role "Lead Architect"
 * - Profile image imported from Figma asset
 * - Displayed in sidebar user card and welcome message
 *
 * 7.3 ROLE IMPLICATIONS (Static Demo)
 * ------------------------------------
 * The prototype does not implement dynamic role-based access control.
 * All features are accessible to the authenticated user. The BA role is
 * implied through the workflow design (review, approve, reject, ship).
 *
 *
 * ============================================================================
 * 8. TERMINOLOGY UPDATES
 * ============================================================================
 *
 * +-------------------------------+-----------------------------------+
 * | Previous Term                 | Current Term                      |
 * +-------------------------------+-----------------------------------+
 * | Dashboard                     | Playground Landing                |
 * | History                       | Journeys (Unified Repository)     |
 * | Tag Manager                   | Telemetry (Schema & Rules)        |
 * | Custom Fields (section)       | REMOVED - fields added in-section |
 * | Developer Package (tab)       | REMOVED from header mode toggle   |
 * | Tagging (route)               | Redirects to Overview             |
 * | Recommendations (route)       | Redirects to Overview             |
 * | Framer Motion                 | Motion                            |
 * | AI Copilot / Chatbot          | AI Fabric Panel / CX Workbench AI |
 * | Tag Namespace Registry        | Telemetry - Business Rules        |
 * +-------------------------------+-----------------------------------+
 *
 *
 * ============================================================================
 * 9. NEWLY ADDED FEATURES
 * ============================================================================
 *
 * 9.1 KANBAN VIEW ON PLAYGROUND LANDING (Latest)
 * -----------------------------------------------
 * - Grid/Kanban toggle button in dashboard header (ViewToggle component)
 * - Four-column Kanban board with color-coded headers
 * - Column mapping:
 *   * To Do (Blue): Jira Assignments from mockJiraTickets
 *   * Ready for Analysis (Amber): New journeys from Figma/Jira sources
 *   * Validation (Emerald): Journeys ready for validation
 *   * Completed (Slate): Empty with placeholder message
 * - Compact card components: KanbanTicketCard, KanbanJourneyCard
 * - KanbanColumn component with count badge, empty state support
 * - Seamless toggle between Grid and Kanban views
 * - State persists during session (React state, not persisted across sessions)
 *
 * 9.2 KANBAN VIEW ON JOURNEYS PAGE
 * ---------------------------------
 * - List/Kanban toggle on Active Journeys page
 * - 4 columns: Ready for Analysis | In Progress | Sent to Dev | Completed
 * - Color-coded top borders (amber, blue, purple, emerald)
 * - Cards include icon, name, source, platform, channel, domain, timestamps
 * - Filtered by active tab and all filter dropdowns
 *
 * 9.3 DATA LAYER "ADD FIELD" IN-SECTION INSERTION
 * -------------------------------------------------
 * - "Add Field" button appears in each section header (Page Attributes,
 *   Journey Context, User Context)
 * - New fields are added directly inside their respective sections
 * - Custom fields tracked with `section` property for correct placement
 * - Removed separate "Custom Fields" section entirely
 *
 * 9.4 FULL CRUD ON DATA LAYER TAB
 * --------------------------------
 * - Inline editing of key-value pairs
 * - Add new fields per section
 * - Delete fields with trash icon
 * - Field validation (duplicate key prevention)
 *
 * 9.5 FULL CRUD ON SYSTEM EVENTS TAB
 * -----------------------------------
 * - Expandable event cards
 * - Inline editing of event field keys and values
 * - Add new fields to events
 * - Delete event fields
 * - Tracked via editableSystemEvents and deletedEventKeys state
 *
 * 9.6 SHIPPING CONFIRMATION MODAL
 * --------------------------------
 * Component: ShippingConfirmationModal
 * - Triggered from "Ship to Development" button
 * - Shows package summary: Data Layer Variables, User Interactions, System Events
 * - Change type indicators: Unchanged, Updated, New
 * - Source indicators: System, User Edited, AI Generated
 * - Expandable section views
 * - Confirm/Cancel actions
 *
 * 9.7 REJECTION REASON MODAL WITH AI FEEDBACK LOOP
 * --------------------------------------------------
 * Component: RejectionReasonModal
 * - 7 predefined rejection reasons + "Other"
 * - Scope selection: Local (this journey only) / Global (future journeys)
 * - Additional context textarea
 * - Validation: reason required, context required for "Other"
 * - On submit: tags show "Feedback submitted to AI" indicator
 * - Rejection metadata stored on tag: rejectionReason, rejectionReasonLabel,
 *   rejectionContext, rejectionScope, rejectionDate
 *
 * 9.8 AI FABRIC PANEL (Conversational AI)
 * -----------------------------------------
 * Component: AIPanel (/src/app/components/AIPanel.tsx)
 * - Dockable panel (left/right/float) using re-resizable
 * - Conversational chat interface with message history
 * - Context-aware: reads current journey, step, and tag data
 * - Message types: text, journey-list, stage-list, code-snippet,
 *   tag-triage, rule-correction, analysis-running
 * - Quick action suggestions
 * - Code snippet viewer with copy functionality
 * - Profile images for user and bot messages
 * - Dock mode toggle (left/right/float)
 *
 * 9.9 CHATBOT FAB (Floating Action Button)
 * -----------------------------------------
 * Component: ChatBot (/src/app/components/ChatBot.tsx)
 * - Fixed bottom-right floating button
 * - MessageCircle icon with Sparkles badge
 * - "Ask CX Workbench AI" tooltip on hover
 * - Opens AI Panel on click
 * - Hidden when AI Panel is already open
 * - Spring animation on mount/unmount
 *
 * 9.10 SHIMMER LOADING EFFECTS
 * ----------------------------
 * Component: PageLoader (/src/app/components/PageLoader.tsx)
 * - Route-change triggered shimmer loading screen
 * - 1.5-second duration per navigation
 * - Shimmer areas: Header block, 4 stat cards, table rows
 * - Custom @keyframes shimmer animation
 * - Fade in/out transitions with AnimatePresence
 *
 * 9.11 LOTTIE INTEGRATION
 * -----------------------
 * Component: LottieLoader (/src/app/components/LottieLoader.tsx)
 * - Three variants: TECHNICAL, SCAN, PULSE
 * - Local Lottie JSON (no external URL dependencies for demo reliability)
 * - Used in: JourneyOverview loading, DeveloperArtifacts loading,
 *   JourneyValidation loading, JiraContextEnrichment processing
 *
 * 9.12 LIGHT/DARK MODE
 * ---------------------
 * Context: ThemeContext (/src/app/context/ThemeContext.tsx)
 * Toggle: ThemeToggle (/src/app/components/ThemeToggle.tsx)
 * - System preference detection on first load
 * - localStorage persistence
 * - CSS class-based switching (html.light / html.dark)
 * - Custom design tokens adapt per theme in theme.css
 * - All components use CSS custom properties for theming
 *
 * 9.13 DEMO NOTICE MODAL
 * ----------------------
 * Component: DemoNoticeModal
 * - Triggered when "Start new journey" or "Create New Journey" is clicked
 * - Informs user this is a static demo
 * - Verizon-branded header with gradient
 * - Sparkles icon with pulse animation
 *
 * 9.14 AI CONTEXT SOURCES PANEL
 * ------------------------------
 * Component: AIContextSourcesPanel (/src/app/components/AIContextSourcesPanel.tsx)
 * - Slide-out panel showing sources used by AI for analysis
 * - Source types: Slack, Email, Meeting Recording, Transcript, Jira, External Document
 * - Per-source: include/exclude toggle, preview, metadata
 * - Video player simulation for meeting recordings
 * - Transcript viewer with timestamped entries
 *
 * 9.15 MANUAL TAGGING MODE
 * -------------------------
 * In JourneyOverview:
 * - "Add Tag" button enters tagging mode
 * - Crosshair cursor on screen preview
 * - Click to place tag at coordinates
 * - Modal to fill tag name, event type, level
 * - Tags saved with position, event type, level, timestamp, source: 'manual'
 * - ESC key exits tagging mode
 *
 *
 * ============================================================================
 * 10. REMOVED OR DEPRECATED FEATURES
 * ============================================================================
 *
 * 10.1 REMOVED: Custom Fields Section (Data Layer Tab)
 * ----------------------------------------------------
 * Previously, new fields added via "Add Field" went into a separate
 * "Custom Fields" section at the bottom of the Data Layer tab. This section
 * has been entirely removed. New fields now insert directly into their
 * parent section (Page Attributes, Journey Context, or User Context).
 *
 * 10.2 REMOVED: Developer Package from Header Mode Toggle
 * --------------------------------------------------------
 * The header mode toggle previously had three tabs: Analyze | Developer Package | Validate.
 * "Developer Package" has been removed from the toggle. The header now shows only
 * Analyze | Validate. Developer Package is still accessible via direct route
 * (/playground/journey/:journeyId/package) and through the ShippingConfirmationModal flow.
 *
 * 10.3 DEPRECATED: /dashboard Route
 * ----------------------------------
 * Redirects to /playground. The "Dashboard" naming is preserved only in the
 * sidebar label for familiarity.
 *
 * 10.4 DEPRECATED: /history Route
 * --------------------------------
 * Redirects to /journeys.
 *
 * 10.5 DEPRECATED: /playground/journey/:journeyId/tagging
 * --------------------------------------------------------
 * Redirects to ../overview. Tagging functionality consolidated into Overview.
 *
 * 10.6 DEPRECATED: /playground/journey/:journeyId/recommendations
 * ----------------------------------------------------------------
 * Redirects to ../overview. Recommendations consolidated into Overview.
 *
 *
 * ============================================================================
 * 11. AI-DRIVEN FEATURES AND AUTOMATION
 * ============================================================================
 *
 * 11.1 AI TAG RECOMMENDATIONS
 * ---------------------------
 * - Generated for each journey step automatically
 * - Per tag: aiRecommendedTag, eventType, priority, recommendationReason,
 *   businessValue, confidence, level, analyticsDestination
 * - Data model: TagComponent interface with full data layer key-value pairs
 * - Priority: High | Medium | Low (color-coded badges)
 * - Confidence: High | Medium | Low
 * - Analytics Destination: Adobe Analytics | AEP | Both
 *
 * 11.2 AI CONTEXT DETECTION
 * -------------------------
 * - Auto-detects context sources from Jira tickets
 * - Source types: Figma files, Slack threads, Email chains,
 *   Meeting recordings, Jira linked tickets, External documents
 * - Each source marked as AUTO or MANUAL
 * - BA can toggle inclusion/exclusion before analysis
 *
 * 11.3 AI ANALYSIS WORKFLOW (Simulated)
 * --------------------------------------
 * - Triggered from JiraContextEnrichment "Begin AI Analysis" button
 * - 5-second simulation timer on Dashboard
 * - Processing indicators on ticket cards
 * - Toast notification on completion
 * - Status transitions handled via React state and sessionStorage
 *
 * 11.4 AI FEEDBACK LOOP
 * ---------------------
 * - BA rejection reasons feed back into AI model (simulated)
 * - 7 predefined rejection categories:
 *   1. Incorrect business rule applied
 *   2. Misinterpreted Figma mockup
 *   3. Wrong data source used
 *   4. Incorrect key/value format
 *   5. Duplicate tracking
 *   6. Not relevant to this journey
 *   7. Other (requires explanation)
 * - Scope: local (this journey) or global (all future journeys)
 * - Feedback logged in AI Feedback Log (TagManager -> AI Feedback tab)
 * - Rejection metadata attached to tag: reason, label, context, scope, date
 *
 * 11.5 AI FABRIC PANEL (Conversational)
 * --------------------------------------
 * - Context-aware AI assistant
 * - Journey-specific conversation context
 * - Supports message types: text, journey-list, stage-list,
 *   code-snippet, tag-triage, rule-correction, analysis-running
 * - Quick action suggestions based on current context
 * - Code snippet generation and display
 * - Dockable (left/right/float) and resizable
 *
 * 11.6 AI METADATA (Hidden Observability)
 * ----------------------------------------
 * Per-tag hidden metadata (aiMetadata on TagComponent):
 * - contextSourceIds: Which sources informed this recommendation
 * - businessRulesApplied: Which rules were applied
 * - confidenceScore: Numeric confidence value
 * - feedbackHistory: Array of previous feedback entries
 * - modelVersion: AI model version string
 * - analysisRunId: Unique analysis run identifier
 *
 *
 * ============================================================================
 * 12. UI ENHANCEMENTS
 * ============================================================================
 *
 * 12.1 LAYOUT CHANGES
 * -------------------
 * - Three-panel collapsible layout in JourneyOverview and JourneyValidation:
 *   Left panel (journey context), Center (screen preview), Right (tag review)
 * - Each panel independently collapsible with toggle buttons
 * - AI Panel dockable to left/right/float with re-resizable handles
 * - Sidebar collapse from 260px to 88px with smooth transition
 * - Dynamic canvas scaling in screen preview (ResizeObserver)
 *
 * 12.2 INTERACTION IMPROVEMENTS
 * -----------------------------
 * - Inline editing for Data Layer values (click-to-edit pattern)
 * - Inline editing for System Events fields
 * - Tag review with Accept/Reject/Edit actions directly on card
 * - Tag hotspot interaction on screen preview (click marker -> tooltip)
 * - Manual tagging mode with click-to-place interaction
 * - Drag-and-drop not used; interactions are click-based
 * - Keyboard shortcuts: ESC to cancel tagging mode, Enter to save edits
 * - Focus management with focus-visible:ring-2
 *
 * 12.3 USABILITY ENHANCEMENTS
 * ---------------------------
 * - Shimmer loading effects for smooth route transitions (1.5s)
 * - LottieFiles animations for analysis loading states
 * - Animated step progression in loading screens (Motion/AnimatePresence)
 * - Toast notifications (Sonner) for success/error/info messages
 * - Progress bar in header tracks review completion in real-time
 * - Session-based state persistence (loading screens, review progress,
 *   validation enablement, artifacts enablement)
 * - Responsive carousel (4/3.2/2.2/1.2 slides at breakpoints)
 * - Context-aware header adapts content based on current route
 * - Filter state indicated visually (accent ring on active filters)
 * - "Clear Filters" button appears only when filters are active
 * - Scroll-to-active behavior for tag cards in sidebar
 * - Copy-to-clipboard for code snippets with visual feedback
 * - Expandable/collapsible sections throughout the app
 * - Auto-expand context panel on first visit only
 *
 * 12.4 THEMING
 * ------------
 * - Full light/dark mode with CSS custom property system
 * - Theme persisted in localStorage
 * - System preference detection as default
 * - Smooth 300ms transition on theme change
 * - All status colors, surfaces, and borders adapt per theme
 * - Dark mode uses zinc-900/950 backgrounds with adjusted contrast
 *
 * 12.5 ACCESSIBILITY
 * ------------------
 * - Keyboard navigation support (tabIndex, onKeyDown handlers)
 * - Focus-visible ring indicators
 * - ARIA labels on interactive elements (role="button", aria-label)
 * - Screen reader text for icon-only buttons
 * - Color contrast maintained in both light and dark modes
 * - ESC key handlers for modals and modes
 *
 *
 * ============================================================================
 * APPENDIX A: MOCK DATA SOURCES
 * ============================================================================
 *
 * A.1 /src/app/data/mockJourneys.ts
 * - Exports: TagComponent, JourneyStep, Journey interfaces + mockJourneys array
 * - Contains comprehensive journey data with steps, components, tags, data layers
 * - Source types: System, Figma, Jira, Manual
 * - Categories: Sales, Growth, Service, Retention, Security, Plan, etc.
 * - Platforms: Web, Mobile, Hybrid
 *
 * A.2 /src/app/data/mockJiraTickets.ts
 * - Exports: mockJiraTickets array (JiraTicket type from mockJourneys)
 * - Contains 3+ Jira tickets with full metadata
 * - Statuses: New, Needs Context, Ready for Analysis, In Review, Analyzing
 * - Priorities: High, Medium, Low
 * - Optional: contextNotes, analysisCompletedDate, aiConfidenceSummary,
 *   tagCount, linkedJourneyId, attachments
 *
 * A.3 /src/app/mockData.ts
 * - Legacy mock data with platform info, journey steps, metrics, environments
 * - Platform: "Verizon CX Tagging & Measurement Fabric"
 * - Metrics: NPS (72), CSAT (4.5), Churn (1.2%)
 * - Environments: Dev, QA, Stage, Production
 *
 * A.4 /src/app/data/backend-mock-data-spec.md
 * - Specification document for mock data structures
 *
 *
 * ============================================================================
 * APPENDIX B: COMPONENT INVENTORY
 * ============================================================================
 *
 * PAGES (8):
 * - PlaygroundLanding.tsx      - Dashboard/Home
 * - ActiveJourneys.tsx         - Unified Journey Repository
 * - JourneyOverview.tsx        - Tag Analysis Workspace
 * - DeveloperArtifacts.tsx     - Developer Code Generation
 * - DeveloperPackage.tsx       - Developer Handoff Package
 * - JourneyValidation.tsx      - Post-Deployment Validation
 * - JiraContextEnrichment.tsx  - Jira Context Enrichment
 * - TagManager.tsx             - Telemetry Configuration
 *
 * LAYOUT COMPONENTS (5):
 * - Header.tsx                 - Global header (context-sensitive)
 * - Sidebar.tsx                - Left navigation sidebar
 * - Footer.tsx                 - Footer component
 * - PageLayout.tsx             - Page layout wrapper
 * - PageLoader.tsx             - Shimmer loading transition
 *
 * AI COMPONENTS (5):
 * - AIPanel.tsx                - Conversational AI panel
 * - ChatBot.tsx                - FAB trigger for AI panel
 * - AIContextSourcesPanel.tsx  - Context sources viewer
 * - AIFeedbackLog.tsx          - AI rejection feedback log
 * - Observability.tsx          - AI performance observability
 *
 * JOURNEY COMPONENTS (4):
 * - JourneyScreenGenerator.tsx - Dynamic screen mock renderer
 * - JourneyStepper.tsx         - Multi-step progress indicator
 * - JourneyVisuals.tsx         - Visual elements for journeys
 * - StepProgression.tsx        - Step progression component
 *
 * MODAL COMPONENTS (5):
 * - DemoNoticeModal.tsx        - Static demo notice
 * - RejectionReasonModal.tsx   - Tag rejection with reasons
 * - ShippingConfirmationModal.tsx - Ship to development confirmation
 * - EditModals.tsx             - Business rule edit modal
 * - DataLayerVariableModal.tsx - Data layer variable add/edit modal
 *
 * UTILITY COMPONENTS (7):
 * - Foundation.tsx             - StatusBadge, CardContainer, PageSection
 * - EnhancedInspectionTabs.tsx - Data Layer, User Interactions, System Events tabs
 * - LottieLoader.tsx           - Lottie animation wrapper
 * - MockScreenVisualization.tsx- Screen visualization helpers
 * - PasswordGate.tsx           - Password protection wrapper
 * - SourcePreviewComponents.tsx- Source preview renderers
 * - StatusBadge.tsx            - Status badge component
 * - ThemeToggle.tsx            - Light/Dark mode toggle
 * - WorkflowActionBar.tsx      - Workflow navigation bar
 *
 * CONTEXT PROVIDERS (2):
 * - ThemeContext.tsx            - Light/Dark mode state
 * - ChatContext.tsx             - AI panel open/close, dock mode state
 *
 * UI PRIMITIVES (47 shadcn/ui components):
 * - accordion, alert, alert-dialog, aspect-ratio, avatar, badge,
 *   breadcrumb, button, calendar, card, carousel, chart, checkbox,
 *   collapsible, command, context-menu, dialog, drawer, dropdown-menu,
 *   form, hover-card, input-otp, input, label, menubar, navigation-menu,
 *   pagination, popover, progress, radio-group, resizable, scroll-area,
 *   select, separator, sheet, sidebar, skeleton, slider, sonner, switch,
 *   table, tabs, textarea, toggle, toggle-group, tooltip, use-mobile
 *
 *
 * ============================================================================
 * END OF DOCUMENTATION
 * ============================================================================
 */

// This file serves as documentation only and does not export any runtime code.
export {};
