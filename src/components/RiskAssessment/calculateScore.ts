
import { AssessmentData, RiskScore } from './types';

const INDUSTRY_WEIGHTS = {
  Accounting: { risk: 2, rp: 5, vp: 5 },
  Legal: { risk: 2, rp: 5, vp: 5 },
  Finance: { risk: 2, rp: 5, vp: 5 },
  Retail: { risk: 1.5, rp: 3, vp: 4 },
  Healthcare: { risk: 1.5, rp: 3, vp: 4 },
  Other: { risk: 1, rp: 1, vp: 2 },
};

const BUSINESS_SIZE_WEIGHTS = {
  '1-5': { rp: 1, vp: 1, weight: 1 },
  '6-20': { rp: 2, vp: 3, weight: 1 },
  '21-50': { rp: 3, vp: 5, weight: 1.5 },
  '51-100': { rp: 4, vp: 7, weight: 2 },
  '100+': { rp: 5, vp: 10, weight: 2.5 },
};

export function calculateRiskScore(data: AssessmentData): RiskScore {
  let totalRiskPoints = 0;
  let totalValuePoints = 0;
  const details = [];

  // Business Profile Risk
  let profileRiskScore = 0;
  let profileValueScore = 0;

  // Business Size
  const sizeWeights = BUSINESS_SIZE_WEIGHTS[data.businessSize];
  profileRiskScore += sizeWeights.rp * sizeWeights.weight;
  profileValueScore += sizeWeights.vp;

  // Sensitive Data
  if (data.sensitiveData === 'Yes') {
    profileRiskScore += 5 * 2; // 2x weighting
    profileValueScore += 5;
  } else if (data.sensitiveData === 'No') {
    profileValueScore += 2;
  }

  // Internal IT
  if (data.internalIT === 'Yes') {
    profileRiskScore -= 3;
    profileValueScore += 3;
  } else if (data.internalIT === 'No') {
    profileRiskScore += 5 * 1.5;
    profileValueScore += 7;
  } else {
    profileRiskScore += 2;
    profileValueScore += 5;
  }

  // Apply industry modifier to profile risk score
  profileRiskScore *= INDUSTRY_WEIGHTS[data.industry].risk;
  totalRiskPoints += profileRiskScore;
  totalValuePoints += profileValueScore;

  details.push({
    category: 'Business Profile',
    riskScore: profileRiskScore,
    valueScore: profileValueScore,
    recommendations: [
      data.sensitiveData === 'Yes' ? 'Implement enhanced data protection measures' : '',
      data.internalIT === 'No' ? 'Consider managed IT support for better security' : '',
    ].filter(Boolean),
  });

  // Security Risk
  let securityRiskScore = 0;
  let securityValueScore = 0;

  // Last Audit
  if (data.lastAudit === 'Never') {
    securityRiskScore += 10 * 3;
    securityValueScore += 10;
  } else if (data.lastAudit === 'Over a year ago') {
    securityRiskScore += 5 * 2;
    securityValueScore += 5;
  } else if (data.lastAudit === '6-12 months ago') {
    securityRiskScore += 2 * 1.5;
    securityValueScore += 3;
  } else {
    securityValueScore += 2;
  }

  // MFA
  if (data.mfaEnabled === 'No') {
    securityRiskScore += 7 * 2.5;
    securityValueScore += 7;
  } else if (data.mfaEnabled === 'Not Sure') {
    securityRiskScore += 5 * 2;
    securityValueScore += 5;
  } else {
    securityValueScore += 2;
  }

  // Backup Frequency
  if (data.backupFrequency === "We don't back up data") {
    securityRiskScore += 10 * 3;
    securityValueScore += 10;
  } else if (data.backupFrequency === 'Monthly') {
    securityRiskScore += 5 * 2;
    securityValueScore += 5;
  } else if (data.backupFrequency === 'Weekly') {
    securityRiskScore += 2 * 1.5;
    securityValueScore += 3;
  } else if (data.backupFrequency === 'Daily') {
    securityValueScore += 2;
  }

  totalRiskPoints += securityRiskScore;
  totalValuePoints += securityValueScore;

  details.push({
    category: 'Security',
    riskScore: securityRiskScore,
    valueScore: securityValueScore,
    recommendations: [
      data.lastAudit === 'Never' ? 'Schedule regular security audits' : '',
      data.mfaEnabled === 'No' ? 'Enable multi-factor authentication' : '',
      data.backupFrequency === "We don't back up data" ? 'Implement regular backup strategy' : '',
      data.endpointProtection === 'No' ? 'Deploy endpoint protection solutions' : '',
    ].filter(Boolean),
  });

  // Compliance & Support Risk
  let complianceRiskScore = 0;
  let complianceValueScore = 0;

  // Data Regulations
  if (data.dataRegulations === 'Yes') {
    complianceRiskScore += 7 * 2;
    complianceValueScore += 7;
  } else if (data.dataRegulations === 'Not Sure') {
    complianceRiskScore += 5 * 1.5;
    complianceValueScore += 5;
  } else {
    complianceValueScore += 2;
  }

  // IT Issues Frequency
  if (data.itIssues === 'Daily') {
    complianceRiskScore += 10 * 3;
    complianceValueScore += 10;
  } else if (data.itIssues === 'Weekly') {
    complianceRiskScore += 7 * 2;
    complianceValueScore += 7;
  } else if (data.itIssues === 'Occasionally') {
    complianceRiskScore += 3;
    complianceValueScore += 3;
  } else if (data.itIssues === 'Rarely') {
    complianceRiskScore += 1;
    complianceValueScore += 1;
  }

  // Response Time Needed
  if (data.responseNeeded === 'Within minutes') {
    complianceRiskScore += 7 * 3;
    complianceValueScore += 10;
  } else if (data.responseNeeded === 'Within an hour') {
    complianceRiskScore += 5 * 2;
    complianceValueScore += 7;
  } else if (data.responseNeeded === 'Same day') {
    complianceRiskScore += 2 * 1.5;
    complianceValueScore += 5;
  } else {
    complianceValueScore += 2;
  }

  totalRiskPoints += complianceRiskScore;
  totalValuePoints += complianceValueScore;

  details.push({
    category: 'Compliance & Support',
    riskScore: complianceRiskScore,
    valueScore: complianceValueScore,
    recommendations: [
      data.dataRegulations === 'Not Sure' ? 'Assess your regulatory requirements' : '',
      data.dataRegulations === 'Yes' ? 'Implement compliance monitoring' : '',
      data.itIssues === 'Daily' || data.itIssues === 'Weekly' ? 'Consider proactive IT monitoring' : '',
    ].filter(Boolean),
  });

  let riskLevel: 'Low' | 'Medium' | 'High';
  if (totalRiskPoints < 30) riskLevel = 'Low';
  else if (totalRiskPoints < 60) riskLevel = 'Medium';
  else riskLevel = 'High';

  return {
    total: totalRiskPoints,
    valueScore: totalValuePoints,
    level: riskLevel,
    details,
  };
}
