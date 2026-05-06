import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.engagement.deleteMany();

  await prisma.engagement.createMany({
    data: [
      {
        clientName:       'Adobe Systems',
        region:           'Bay Area',
        hqCity:           'San Jose, CA',
        accountExecutive: 'Marcus Chen',
        pocName:          'Jennifer Walsh',
        pocTitle:         'VP of Engineering',
        pocEmail:         'j.walsh@adobe.com',
        status:           'Active',
        engagementModel:  'T&M',
        dateLastContact:  new Date('2026-04-28'),
        nextSteps:        'Deliver Phase 2 architecture review; schedule sprint demo',
        nextFollowupDate: new Date('2026-05-15'),
        contractValue:    875000,
        startDate:        new Date('2026-01-06'),
        endDate:          new Date('2026-12-31'),
        practiceArea:     'AI/ML',
        teamSize:         6,
        industryVertical: 'Technology',
        priority:         'High',
        stage:            'Active Delivery',
        notes:            'GenAI document intelligence POC expanding to production. Strong exec sponsorship from CTO office.',
      },
      {
        clientName:       'Chevron',
        region:           'Bay Area',
        hqCity:           'San Ramon, CA',
        accountExecutive: 'Sarah Okonkwo',
        pocName:          'Robert Tanaka',
        pocTitle:         'Director, Digital Innovation',
        pocEmail:         'r.tanaka@chevron.com',
        status:           'Proposal',
        engagementModel:  'Fixed Price',
        dateLastContact:  new Date('2026-04-15'),
        nextSteps:        'Revise SOW to include MLOps platform scope. Legal review pending.',
        nextFollowupDate: new Date('2026-05-08'),
        contractValue:    1200000,
        practiceArea:     'Data Engineering',
        teamSize:         8,
        industryVertical: 'Energy / Oil & Gas',
        priority:         'High',
        stage:            'Negotiation',
        notes:            'Predictive maintenance ML pipeline for upstream operations. Competing with Accenture.',
      },
      {
        clientName:       'Nordstrom',
        region:           'Pacific Northwest',
        hqCity:           'Seattle, WA',
        accountExecutive: 'Diana Reyes',
        pocName:          'Kevin Park',
        pocTitle:         'Senior Manager, Cloud Architecture',
        pocEmail:         'k.park@nordstrom.com',
        status:           'Active',
        engagementModel:  'Staff Augmentation',
        dateLastContact:  new Date('2026-05-01'),
        nextSteps:        'Onboard two additional ML engineers by May 20. Align on Q3 roadmap.',
        nextFollowupDate: new Date('2026-05-20'),
        contractValue:    540000,
        startDate:        new Date('2026-03-01'),
        endDate:          new Date('2026-08-31'),
        practiceArea:     'Cloud',
        teamSize:         4,
        industryVertical: 'Retail',
        priority:         'Medium',
        stage:            'Active Delivery',
        notes:            'AWS migration + personalization recommendation engine. Renewing quarterly.',
      },
      {
        clientName:       'City of Los Angeles — LAWA',
        region:           'Southern California',
        hqCity:           'Los Angeles, CA',
        accountExecutive: 'Marcus Chen',
        pocName:          'Patricia Gomez',
        pocTitle:         'Chief Information Officer',
        pocEmail:         'p.gomez@lawa.org',
        status:           'Proposal',
        engagementModel:  'Managed Services',
        dateLastContact:  new Date('2026-04-20'),
        nextSteps:        'Respond to RFP by May 30. Schedule orals presentation for June.',
        nextFollowupDate: new Date('2026-05-12'),
        contractValue:    2100000,
        practiceArea:     'AI/ML',
        teamSize:         12,
        industryVertical: 'Government / Public Sector',
        priority:         'High',
        stage:            'Proposal',
        notes:            'AI-powered passenger flow optimization and security analytics for LAX expansion. Multi-year contract opportunity.',
      },
    ],
  });

  console.log('Seeded 4 West USA engagements.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
