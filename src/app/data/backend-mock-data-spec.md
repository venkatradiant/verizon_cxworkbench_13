# Verizon CX Tagging & Measurement Fabric: Comprehensive System Intelligence

This document is the authoritative knowledge base for the Verizon CX Tagging & Measurement Fabric. It contains all metadata, journey structures, tagging logic, and implementation code used across the application. Use this for grounding LLM responses regarding system state, data standards, and workflow context.

---

## 1. System Metadata & Business Logic

### Core Platform Purpose
A unified dashboard for Verizon's Measurement & Analytics teams to automate the lifecycle of interaction tagging. It bridges Figma designs, Jira requirements, and production monitoring.

### Strategic Objectives (Tracking Focus)
- **Conversion**: Optimizing sales funnels and checkout paths.
- **Engagement**: Measuring feature adoption and user interaction depth.
- **Drop-off Reduction**: Identifying friction points in critical workflows.
- **Retention**: Monitoring loyalty program participation and upsell success.
- **Service**: Streamlining support and troubleshooting flows.

---

## 2. The Journey Catalog (Mock Data Registry)

The system manages three distinct tiers of journeys totaling 41 active records.

### Tier 1: The Flagship Demo (Add a Line)
- **ID**: `add-a-line`
- **Category**: Plan
- **Platform**: Web
- **Structure**: 24 Stages (End-to-end flow)
- **Tag Count**: 24 AI-Recommended Tags
- **Context**: Used for "Analyze & Create" storytelling. Features high-fidelity design blue-prints and production sync simulations.

### Tier 2: The "Discovery" Surface (20 Review Journeys)
These journeys originate from Figma/Jira and represent proposed work.
- **IDs**: `rev-1` through `rev-20`
- **Sources**: Figma Design, Jira Ticket
- **Examples**:
    - `5G UW Upgrade Flow` (ID: `rev-1`, 38 tags)
    - `Disney+ Activation` (ID: `rev-2`)
    - `Global Nav Refresh` (ID: `rev-3`)
    - `B2B Portal Login` (ID: `rev-4`)
    - `Apple Watch Setup` (ID: `rev-5`)

### Tier 3: The "Registry" Surface (20 Existing Journeys)
Production journeys currently monitored for measurement health.
- **IDs**: `ext-1` through `ext-20`
- **Source**: System (AEM + Analytics Discovery)
- **Examples**:
    - `Global Navigation` (ID: `ext-1`, Health: 98%)
    - `Homepage Search` (ID: `ext-2`)
    - `Support Chat Flow` (ID: `ext-3`)
    - `Bill Pay Lifecycle` (ID: `ext-4`)

---

## 3. Journey Stage Intelligence (Metadata & Logic)

The system uses a heuristic engine to determine stages based on journey names.

### Stage Generation Rules (`getContextualStepNames`)
- **Commerce/Hardware**: Landing → Selection → Config → Protection → Trade-in → Review → Success.
- **Identity/Security**: Login → MFA → Identity Verified → Dashboard.
- **Support**: Landing → Inquiry → Details → Interaction → Resolution.

### Screen Templates (`screenTemplate`)
| Template | Visual Context | Typical Components |
| :--- | :--- | :--- |
| `landing` | Entry points, banners | CTAs, Primary Links |
| `config` | Selection matrices, filters | Chips, Toggle Buttons, Cards |
| `form` | Data entry, login | Input Fields, Submit Buttons |
| `review` | Data summary | Edit Links, Confirmation Buttons |
| `success` | Receipts, confirmation | Success Badges, Home Links |

---

## 4. Tagging & Measurement Schema (VSDS v4.2)

### The Naming Blueprint
`vzw.cx.[journey].[step].[element_type].[index]`

**Meta-Data Fields for Tags:**
- **`approvalState`**: `Proposed`, `Approved`, `Rejected`, `Excluded`.
- **`eventType`**: `click`, `view`, `change`, `submit`, `interaction`.
- **`priority`**: `High`, `Medium`, `Low`.
- **`businessValue`**: e.g., "Conversion Driver", "Operational Insight".
- **`analyticsDestination`**: `Adobe Analytics`, `AEP`, or `Both`.

---

## 5. Visual Clues & Interaction Layer

### Highlighting System
The UI provides "Visual Clues" to map code to design.
- **Data Attribute**: `data-analytics-id="[componentId]"`
- **Interaction**: Selecting a tag in the sidebar highlights the corresponding element on the "Design Screen" or "Production Preview" using a crimson/coral bounding box.
- **Z-Index Strategy**: Highlight overlays sit at `z-50` to ensure visibility over complex UI components.

---

## 6. Implementation Artifacts (Code Registry)

### Measurement Bundle (`measurement-bundle.json`)
```json
{
  "stage": "Plan Selection",
  "namespace": "vzw.cx",
  "tags": [
    {
      "id": "c-xyz123",
      "name": "vzw.cx.add-a-line.plan.cta.1",
      "element": "Select Unlimited Plus",
      "type": "click",
      "level": "Component"
    }
  ]
}
```

### Event Mapping (`event-mapping.json`)
```json
[
  {
    "event": "vzw.cx.add-a-line.plan.cta.1",
    "trigger": "click",
    "element": "Select Unlimited Plus",
    "selector": "[data-analytics-id=\"c-xyz123\"]",
    "data": { "interaction_type": "Component", "business_value": "Conversion Driver" }
  }
]
```

### SDK Initialization (`sdk-init.js`)
```javascript
import { SignalsCX } from '@vzw/signals-cx-sdk';
const cx = new SignalsCX({
  journeyId: "add-a-line",
  environment: "staging",
  dataSchema: "v4.2"
});
cx.initializeTags();
```

---

## 7. Operational Workflow State

### Status Definitions
- **Not started**: Journey detected but no AI tagging has been reviewed.
- **In progress**: AI tags are being reviewed/edited by a Measurement Lead.
- **Artifact generated**: Approval completed; JSON/JS bundles available for dev.
- **Completed**: Journey is live in production with active telemetry.

### Governance Metrics
- **Tracking Health**: Matches between expected and actual data signals.
- **Tag Confidence**: AI's assessment of the recommendation's accuracy (90%+ typically).
- **Forecasted ROI**: Business impact of the measurement implementation.


