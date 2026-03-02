import { JiraTicket } from './mockJourneys';

export const mockJiraTickets: JiraTicket[] = [
  {
    ticketId: 'CX-2401',
    journeyName: 'Premium Device Upgrade Flow',
    title: 'Implement Analytics for Premium Device Upgrade Experience',
    description: 'Stakeholders need comprehensive tracking for the new premium device upgrade flow launching in Q2. This includes all interaction points from landing page through checkout confirmation.',
    acceptanceCriteria: [
      'Track all CTA interactions on landing page',
      'Capture device selection events with SKU details',
      'Monitor add-on selection (insurance, accessories)',
      'Track checkout funnel progression and abandonment',
      'Measure time-to-complete for each stage'
    ],
    status: 'New',
    assignedTo: 'Abhinav Saxena',
    createdDate: '2026-02-08',
    dueDate: '2026-02-22',
    priority: 'High',
    platform: 'Web',
    category: 'Sales',
    environmentLink: 'https://vzw.com/upgrade/premium',
  },
  {
    ticketId: 'CX-2398',
    journeyName: '5G UW Upgrade Flow',
    title: 'Analytics Implementation for 5G Ultra Wideband Device Upgrade',
    description: 'End-to-end tracking for customers upgrading to Verizon\'s 5G Ultra Wideband network with device trade-in and premium plan selection. Critical for measuring conversion and identifying friction in the upgrade funnel.',
    acceptanceCriteria: [
      'Track 5G device discovery and comparison interactions',
      'Capture device selection events with trade-in eligibility',
      'Monitor plan upgrade selections (5G UW tiers)',
      'Track trade-in valuation and acceptance flow',
      'Measure checkout funnel progression and cart abandonment'
    ],
    status: 'Ready for Review',
    assignedTo: 'Abhinav Saxena',
    createdDate: '2026-02-06',
    dueDate: '2026-02-20',
    priority: 'High',
    platform: 'Hybrid',
    category: 'Revenue',
    contextNotes: 'AI analysis completed. Journey mapped with 38 interaction points.',
    analysisCompletedDate: '2026-02-12',
    aiConfidenceSummary: {
      high: 24,
      medium: 11,
      low: 3
    },
    tagCount: 38,
    linkedJourneyId: 'rev-1' // Links to the 5G UW Upgrade Flow journey
  },
  {
    ticketId: 'CX-2385',
    journeyName: 'Business Account Migration',
    title: 'Track Business Customer Self-Service Migration Flow',
    description: 'Enterprise customers migrating from legacy portal need tracking for the self-service migration wizard. Critical for measuring adoption and identifying friction points.',
    acceptanceCriteria: [
      'Migration wizard step progression',
      'Account verification events',
      'Data transfer confirmation tracking',
      'Error state monitoring',
      'Completion success metrics'
    ],
    status: 'Ready for Analysis',
    assignedTo: 'Abhinav Saxena',
    createdDate: '2026-02-04',
    dueDate: '2026-02-18',
    priority: 'Medium',
    platform: 'Web',
    category: 'Business',
    attachments: [
      { name: 'Stakeholder Meeting Notes - Feb 5.pdf', type: 'meeting_notes', url: '#' },
      { name: 'Migration Flow Mockups v3.fig', type: 'documentation', url: '#' }
    ],
    contextNotes: 'Stakeholder meeting completed 2/5. Product team confirmed final designs. Ready for AI analysis.',
  },
  {
    ticketId: 'CX-2372',
    journeyName: 'Trade-In Valuation Experience',
    title: 'Analytics for Device Trade-In Assessment Tool',
    description: 'New AI-powered trade-in tool requires comprehensive tracking. BA to define data layer for device condition assessment, valuation display, and offer acceptance.',
    acceptanceCriteria: [
      'Device model selection tracking',
      'Condition assessment interactions',
      'Photo upload events',
      'Valuation display tracking',
      'Offer acceptance/rejection metrics'
    ],
    status: 'In Review',
    assignedTo: 'Abhinav Saxena',
    createdDate: '2026-02-01',
    dueDate: '2026-02-15',
    priority: 'Medium',
    platform: 'Mobile',
    category: 'Sales',
    attachments: [
      { name: 'Trade-In Requirements Workshop.mp4', type: 'recording', url: '#' },
      { name: 'Product Spec - Trade-In v2.1.docx', type: 'documentation', url: '#' },
      { name: 'Competitor Analysis.pdf', type: 'documentation', url: '#' }
    ],
    contextNotes: 'Analysis complete. Recommendations ready for stakeholder review. Scheduled for Feb 12 presentation.',
  }
];