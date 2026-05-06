export type EngagementStatus = 'Active' | 'Proposal' | 'Closed Won' | 'Closed Lost' | 'On Hold' | 'Inactive';
export type EngagementModel = 'Fixed Price' | 'T&M' | 'Staff Augmentation' | 'Managed Services';
export type PracticeArea = 'AI/ML' | 'Cloud' | 'Data Engineering' | 'Digital Transformation' | 'Cybersecurity' | 'Automation';
export type Priority = 'High' | 'Medium' | 'Low';
export type Stage = 'Prospecting' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Active Delivery' | 'Completed';

export interface Engagement {
  id: number;
  clientName: string;
  region: string;
  hqCity: string | null;
  accountExecutive: string | null;
  pocName: string | null;
  pocTitle: string | null;
  pocEmail: string | null;
  status: EngagementStatus;
  engagementModel: EngagementModel | null;
  dateLastContact: Date | null;
  nextSteps: string | null;
  nextFollowupDate: Date | null;
  contractValue: number;
  startDate: Date | null;
  endDate: Date | null;
  practiceArea: PracticeArea | null;
  teamSize: number;
  industryVertical: string | null;
  priority: Priority;
  stage: Stage;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const ENGAGEMENT_STATUSES: EngagementStatus[] = ['Active', 'Proposal', 'Closed Won', 'Closed Lost', 'On Hold', 'Inactive'];
export const ENGAGEMENT_MODELS: EngagementModel[] = ['Fixed Price', 'T&M', 'Staff Augmentation', 'Managed Services'];
export const PRACTICE_AREAS: PracticeArea[] = ['AI/ML', 'Cloud', 'Data Engineering', 'Digital Transformation', 'Cybersecurity', 'Automation'];
export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
export const STAGES: Stage[] = ['Prospecting', 'Discovery', 'Proposal', 'Negotiation', 'Active Delivery', 'Completed'];
export const REGIONS = ['Bay Area', 'Pacific Northwest', 'Southern California', 'Pacific Southwest', 'Mountain West', 'West USA'];
export const INDUSTRY_VERTICALS = ['Technology', 'Financial Services', 'Healthcare', 'Retail', 'Energy / Oil & Gas', 'Manufacturing', 'Government / Public Sector', 'Media & Entertainment', 'Telecommunications', 'Education', 'Other'];
