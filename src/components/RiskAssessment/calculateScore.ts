
import { AssessmentData, RiskScore } from './types';

const RISK_WEIGHTS = {
  industry: {
    Accounting: 2,
    Legal: 2,
    Finance: 2,
    Retail: 1.5,
    Healthcare: 1.5,
    Other: 1,
  },
  businessSize: {
    '1-5': 1,
    '6-20': 1.2,
    '21-50': 1.5,
    '51-100': 1.8,
    '100+': 2,
  },
};

export function calculateRiskScore(data: AssessmentData): RiskScore {
  let totalScore = 0;
  const details = [];

  // Business Profile Risk
  let profileScore = 0;
  if (data.sensitiveData === 'Yes') profileScore += 5;
  if (data.internalIT === 'No') profileScore += 5;
  totalScore += profileScore * RISK_WEIGHTS.industry[data.industry];

  details.push({
    category: 'Business Profile',
    score: profileScore,
    recommendations: [
      data.sensitiveData === 'Yes' ? 'Implement enhanced data protection measures' : '',
      data.internalIT === 'No' ? 'Consider managed IT support for better security' : '',
    ].filter(Boolean),
  });

  // Security Risk
  let securityScore = 0;
  if (data.lastAudit === 'Never') securityScore += 10;
  if (data.mfaEnabled === 'No') securityScore += 7;
  if (data.backupFrequency === "We don't back up data") securityScore += 10;
  if (data.endpointProtection === 'No') securityScore += 7;
  totalScore += securityScore;

  details.push({
    category: 'Security',
    score: securityScore,
    recommendations: [
      data.lastAudit === 'Never' ? 'Schedule regular security audits' : '',
      data.mfaEnabled === 'No' ? 'Enable multi-factor authentication' : '',
      data.backupFrequency === "We don't back up data" ? 'Implement regular backup strategy' : '',
      data.endpointProtection === 'No' ? 'Deploy endpoint protection solutions' : '',
    ].filter(Boolean),
  });

  // Compliance Risk
  let complianceScore = 0;
  if (data.dataRegulations === 'Yes' || data.dataRegulations === 'Not Sure') complianceScore += 7;
  totalScore += complianceScore;

  details.push({
    category: 'Compliance',
    score: complianceScore,
    recommendations: [
      data.dataRegulations === 'Not Sure' ? 'Assess your regulatory requirements' : '',
      data.dataRegulations === 'Yes' ? 'Implement compliance monitoring' : '',
    ].filter(Boolean),
  });

  let riskLevel: 'Low' | 'Medium' | 'High';
  if (totalScore < 30) riskLevel = 'Low';
  else if (totalScore < 60) riskLevel = 'Medium';
  else riskLevel = 'High';

  return {
    total: totalScore,
    level: riskLevel,
    details,
  };
}
