# Verizon CX Workbench - Complete Application Documentation

**Version:** 2.0  
**Last Updated:** February 27, 2026  
**Status:** Static Demo – Conceptual Prototype  

---

## 1. Application Overview

### Purpose
Verizon CX Workbench is a static demo prototype designed for executive storytelling and showcasing next-generation analytics capabilities. The platform demonstrates an AI-powered approach to digital experience tagging, measurement, and validation within the Verizon ecosystem.

### Primary Users
- **Business Analysts (BAs):** Initiate analysis workflows, enrich Jira context, review AI recommendations
- **Product Managers:** Monitor journey performance, validate implementations, oversee tag governance
- **Developers:** Access generated artifacts, implement tracking code, validate against environments
- **Executive Stakeholders:** View high-level dashboards, journey status, and platform insights

### Core Business Objective
Accelerate the journey from business requirement to analytics implementation by leveraging AI to:
- Auto-detect customer journeys from various sources (Jira, Figma, System)
- Generate contextual tag recommendations with business justification
- Provide developer-ready artifacts (JSON, JavaScript, documentation)
- Validate implementations across multiple environments
- Establish a unified telemetry schema and governance framework

### Access
- **Password Protection:** `rdvr@9705`
- **Authentication:** LocalStorage-based session persistence
- **Demo Notice:** Modal warning on first load indicating conceptual/static demo status

---

## 2. Global Navigation Structure

### Main Navigation (Sidebar)
The application features a collapsible left sidebar with three primary navigation items:

1. **Dashboard** (`/playground`)
   - Label: "Dashboard"
   - Description: "Explore & Create"
   - Icon: Sparkles
   - Purpose: Central hub for platform insights, Jira assignments, journey discovery, and validation results

2. **Journeys** (`/journeys`)
   - Label: "Journeys"
   - Description: "Unified Repository"
   - Icon: Layers
   - Purpose: Comprehensive view of all journeys with filtering, search, and status-based organization

3. **Telemetry** (`/tag-manager`)
   - Label: "Telemetry"
   - Description: "Schema & Rules"
   - Icon: Database
   - Purpose: Global tag schema, data layer variable management, and business rule configuration

### Header Components
- **Product Branding:** "Verizon CX Workbench" with lightning bolt icon and red indicator dot
- **Page Title:** Dynamic based on current route (e.g., "Dashboard Overview", "Journey Details")
- **Theme Toggle:** Light/Dark mode switcher with sun/moon icons
- **User Profile:** Profile image with name "Abhinav Saxena" (static)
- **Collapse/Expand Toggle:** Sidebar width control (88px collapsed, 260px expanded)

### Persistent UI Elements
- **ChatBot:** Floating chat bubble (bottom-right) for conversational AI assistance
- **AI Panel:** Resizable, dockable panel (left/right) for advanced AI interactions with journey context awareness
- **Toast Notifications:** Top-center position for user feedback and action confirmations

### Routing Structure
```
/ → /playground (redirect)
/playground → PlaygroundLanding (Dashboard)
/journeys → ActiveJourneys (Journey Repository)
/tag-manager → TagManager (Telemetry Configuration)

/playground/journey/:journeyId/overview → JourneyOverview (Analysis & Recommendations)
/playground/journey/:journeyId/artifacts → DeveloperArtifacts (Generated Code)
/playground/journey/:journeyId/package → DeveloperPackage (Developer Handoff)
/playground/journey/:journeyId/validation → JourneyValidation (Multi-env Validation)

/jira/:ticketId/enrich → JiraContextEnrichment (BA Workflow)

Legacy redirects:
/dashboard → /playground
/history → /journeys
```

---

## 3. Module-wise Breakdown

This documentation provides comprehensive details on all modules, features, workflows, and data structures within the Verizon CX Workbench application. For detailed information on specific modules, please refer to the sections below.

### Available Modules
1. Dashboard (Playground Landing)
2. Journeys (Active Journeys Repository)
3. Journey Overview (Analysis & Recommendations)
4. Developer Artifacts
5. Developer Package
6. Journey Validation
7. Tag Manager (Telemetry Configuration)
8. Jira Context Enrichment (BA Workflow)
9. AI Panel (Advanced Conversational AI)
10. ChatBot (Quick AI Assistance)

---

## Note on Documentation Length

Due to the comprehensive nature of this application, the complete documentation exceeds standard file size limits. This file contains the overview and navigation structure. For detailed module documentation, workflow diagrams, data structures, and AI feature specifications, please refer to the following supplementary documents:

- `module-details.md` - Detailed breakdown of all 10 modules
- `workflows.md` - End-to-end user journeys and process flows
- `ai-features.md` - AI-driven automation and capabilities
- `data-structures.md` - Complete data models and schemas
- `ui-specifications.md` - UI/UX patterns and design system

---

## Quick Reference

### Key Features
- AI-powered journey detection and tag recommendation
- Multi-environment validation system
- Developer artifact generation (JSON, JavaScript, documentation)
- Jira context enrichment workflow
- Conversational AI assistance (ChatBot & AI Panel)
- Kanban and Grid view modes
- Real-time collaboration and feedback loops

### Technology Stack
- React + TypeScript
- Tailwind CSS
- React Router
- LottieFiles animations
- LocalStorage for state persistence

### Demo Credentials
- Password: `rdvr@9705`
- User: Abhinav Saxena (static)

---

For complete documentation, please access the supplementary files or contact the development team.
