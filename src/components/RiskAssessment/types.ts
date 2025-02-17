
export type BusinessSize = '1-5' | '6-20' | '21-50' | '51-100' | '100+';
export type Industry = 'Accounting' | 'Legal' | 'Finance' | 'Retail' | 'Healthcare' | 'Other';
export type ITSupport = 'Yes' | 'No' | 'We outsource IT';
export type TimePeriod = 'Less than 6 months ago' | '6-12 months ago' | 'Over a year ago' | 'Never';
export type BackupFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Not Sure' | "We don't back up data";
export type DisruptionFrequency = 'Daily' | 'Weekly' | 'Occasionally' | 'Rarely' | 'Never';
export type ResponseTime = 'Within minutes' | 'Within an hour' | 'Same day' | 'Within a few days' | 'No urgency';
export type YesNoNotSure = 'Yes' | 'No' | 'Not Sure';

export interface AssessmentData {
  industry: Industry;
  businessSize: BusinessSize;
  sensitiveData: YesNoNotSure;
  internalIT: ITSupport;
  cloudServices: YesNoNotSure;
  lastAudit: TimePeriod;
  mfaEnabled: YesNoNotSure;
  backupFrequency: BackupFrequency;
  endpointProtection: YesNoNotSure;
  phishingAttempt: YesNoNotSure;
  dataRegulations: YesNoNotSure;
  itIssues: DisruptionFrequency;
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

export interface ExecutiveSummary {
  industryInsights: IndustryInsight;
  riskLevel: string;
  topRisks: string[];
  recommendations: string[];
  valueProposition: string[];
}

export interface RiskScore {
  total: number;
  maxPossible: number;
  valueScore: number;
  maxValuePossible: number;
  level: 'Low' | 'Medium' | 'High';
  executiveSummary: ExecutiveSummary;
  details: {
    category: string;
    riskScore: number;
    valueScore: number;
    recommendations: string[];
    insights: CategoryInsight;
  }[];
}
