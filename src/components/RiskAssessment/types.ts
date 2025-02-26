
export type BusinessSize = '1-5' | '6-20' | '21-50' | '51-100' | '100+';
export type Industry = 'Accounting' | 'Legal' | 'Finance' | 'Retail' | 'Healthcare' | 'Other';
export type ITSupport = 'We do not have IT Support currently' | 'An internal expert/team' | 'An external IT support partner' | 'Not sure';
export type Infrastructure = 'Cloud-based systems' | 'Internal servers' | 'Extensive IT network' | 'Mixed environment' | 'Not sure';
export type WorkLocation = 'Single site, no remote working' | 'Multiple sites, no remote working' | 'Single site, with remote working' | 'Multiple sites, with remote working' | 'Fully remote workforce';
export type TimePeriod = 'Less than 6 months ago' | '6-12 months ago' | 'Over a year ago' | 'Never';
export type BackupFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Not Sure' | "We don't back up data";
export type DisruptionFrequency = 'Daily' | 'Weekly' | 'Occasionally' | 'Rarely' | 'Never';
export type ITCriticality = 'IT downtime causes immediate operational issues' | 'IT downtime impacts productivity but not critical operations' | 'IT downtime is a minor inconvenience' | 'IT is not critical to daily operations';
export type YesNoNotSure = 'Yes' | 'No' | 'Not Sure';
export type CloudProvider = 'Microsoft' | 'Google' | 'Other' | "Don't Know";
export type SupportDuration = 'Less than 1 year' | '1-2 years' | '3-5 years' | 'More than 5 years' | 'No current provider';
export type ResponseTime = 'Within minutes' | 'Within an hour' | 'Within a day' | 'No specific requirement';

export interface AssessmentData {
  // Personal Info
  name: string;
  email: string;
  businessName: string;
  newsletter: boolean;
  
  // IT Provider Info
  currentProvider: boolean;
  providerDuration: SupportDuration;
  cloudProvider: CloudProvider;
  
  // Business Profile fields
  industry: Industry;
  businessSize: BusinessSize;
  sensitiveData: YesNoNotSure;
  itSupportType: ITSupport;
  infrastructure: Infrastructure;
  workLocation: WorkLocation;
  
  // Security fields
  lastAudit: TimePeriod;
  mfaEnabled: YesNoNotSure;
  backupFrequency: BackupFrequency;
  endpointProtection: YesNoNotSure;
  phishingAttempt: YesNoNotSure;
  
  // Compliance & Support fields
  dataRegulations: YesNoNotSure;
  itIssues: DisruptionFrequency;
  itCriticality: ITCriticality;
  responseNeeded: ResponseTime;
}

export interface IndustryInsight {
  risks: string[];
  values: string[];
}

export interface CategoryInsight {
  description: string;
  industrySpecific: string[];
  sizeSpecific: string[];
}

export interface CategoryDetail {
  category: string;
  riskScore: number;
  valueScore: number;
  recommendations: string[];
  insights: CategoryInsight;
  riskAreas: string[];
  valueAreas: string[];
}

export interface ExecutiveSummary {
  industryInsights: IndustryInsight;
  riskLevel: string;
  topRisks: string[];
  recommendations: string[];
  valueProposition: string[];
  narrative?: string; // Added the narrative property as optional
}

export interface RiskScore {
  total: number;
  maxPossible: number;
  valueScore: number;
  maxValuePossible: number;
  level: 'Low' | 'Medium' | 'High';
  executiveSummary: ExecutiveSummary;
  details: CategoryDetail[];
}
