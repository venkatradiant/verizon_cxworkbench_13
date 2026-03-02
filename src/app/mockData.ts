export const mockData = {
  platform: {
    platformName: "Verizon CX Tagging & Measurement Fabric",
    platformSubtitle: "Executive Intelligence Platform",
    demoLabel: "Static Demo – Conceptual"
  },
  journeys: {
    activeJourneyName: "Fiber Optic Onboarding 2026",
    journeySteps: [
      "Initial Discovery",
      "Plan Selection",
      "Cart & Checkout",
      "Installation Scheduling",
      "Post-Install Activation"
    ]
  },
  metrics: {
    nps: 72,
    csat: 4.5,
    churn: "1.2%"
  },
  environments: [
    { id: "dev", name: "Dev" },
    { id: "qa", name: "QA" },
    { id: "stage", name: "Stage" },
    { id: "prod", name: "Production" }
  ],
  validationStates: {
    pass: { label: "Pass", color: "success" },
    warning: { label: "Warning", color: "warning" },
    issue: { label: "Issue", color: "error" }
  }
};
