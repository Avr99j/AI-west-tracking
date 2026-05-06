import { z } from 'zod';

export const engagementSchema = z.object({
  clientName:        z.string().min(1, 'Client name is required'),
  region:            z.string().min(1, 'Region is required'),
  hqCity:            z.string().optional(),
  accountExecutive:  z.string().optional(),
  pocName:           z.string().optional(),
  pocTitle:          z.string().optional(),
  pocEmail:          z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  status:            z.enum(['Active', 'Proposal', 'Closed Won', 'Closed Lost', 'On Hold', 'Inactive']),
  engagementModel:   z.enum(['Fixed Price', 'T&M', 'Staff Augmentation', 'Managed Services']).optional(),
  dateLastContact:   z.string().optional(),
  nextSteps:         z.string().optional(),
  nextFollowupDate:  z.string().optional(),
  contractValue:     z.coerce.number().min(0).default(0),
  startDate:         z.string().optional(),
  endDate:           z.string().optional(),
  practiceArea:      z.enum(['AI/ML', 'Cloud', 'Data Engineering', 'Digital Transformation', 'Cybersecurity', 'Automation']).optional(),
  teamSize:          z.coerce.number().int().min(0).default(0),
  industryVertical:  z.string().optional(),
  priority:          z.enum(['High', 'Medium', 'Low']).default('Medium'),
  stage:             z.enum(['Prospecting', 'Discovery', 'Proposal', 'Negotiation', 'Active Delivery', 'Completed']).default('Prospecting'),
  notes:             z.string().optional(),
});

export type EngagementFormValues = z.infer<typeof engagementSchema>;
export type EngagementFormInput = z.input<typeof engagementSchema>;
