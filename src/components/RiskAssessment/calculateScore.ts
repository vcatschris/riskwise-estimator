
import { AssessmentData, RiskScore, CategoryDetail } from './types';
import { INDUSTRY_INSIGHTS } from './utils/industryInsights';
import { getCategoryInsights } from './utils/categoryInsights';
import { INDUSTRY_WEIGHTS, BUSINESS_SIZE_WEIGHTS, calculateMaxScores } from './utils/scoringWeights';

export const calculateRiskScore = (data: AssessmentData): RiskScore => {
  let totalRiskPoints = 0;
  let totalValuePoints = 0;
  const details: CategoryDetail[] = [];

  // Business Profile Risk (33% of total)
  let profileRiskScore = 0;
  let profileValueScore = 0;

  // IT Support Type scoring (increased weights)
  if (data.itSupportType === 'We do not have IT Support currently') {
    profileRiskScore += 25; // Higher risk for no IT support
    profileValueScore += 35; // Higher value potential
  } else if (data.itSupportType === 'An internal expert/team') {
    profileRiskScore += 10;
    profileValueScore += 20; // Increased value potential
  } else if (data.itSupportType === 'An external IT support partner') {
    profileRiskScore += 5;
    profileValueScore += 15; // Increased value potential
  } else if (data.itSupportType === 'Not sure') {
    profileRiskScore += 12;
    profileValueScore += 22; // Increased value potential
  }

  // Infrastructure scoring (increased weights)
  switch (data.infrastructure) {
    case 'Cloud-based systems':
      profileRiskScore += 10;
      profileValueScore += 25; // Increased for cloud
      break;
    case 'Internal servers':
      profileRiskScore += 15;
      profileValueScore += 22; // Increased for internal
      break;
    case 'Extensive IT network':
      profileRiskScore += 20;
      profileValueScore += 28; // Increased for complex network
      break;
    case 'Mixed environment':
      profileRiskScore += 12.5;
      profileValueScore += 24; // Increased for mixed
      break;
    case 'Not sure':
      profileRiskScore += 15;
      profileValueScore += 20; // Added value score
      break;
  }

  // Work location scoring (increased weights)
  switch (data.workLocation) {
    case 'Single site, no remote working':
      profileRiskScore += 5;
      profileValueScore += 15;
      break;
    case 'Multiple sites, no remote working':
      profileRiskScore += 10;
      profileValueScore += 20;
      break;
    case 'Single site, with remote working':
      profileRiskScore += 12.5;
      profileValueScore += 22;
      break;
    case 'Multiple sites, with remote working':
      profileRiskScore += 15;
      profileValueScore += 25;
      break;
    case 'Fully remote workforce':
      profileRiskScore += 20;
      profileValueScore += 28;
      break;
  }

  // Industry risk multiplier (3x for Legal/Finance/Accounting)
  const industryMultiplier = ['Legal', 'Finance', 'Accounting'].includes(data.industry) ? 3 : 1;
  profileRiskScore *= industryMultiplier;
  profileValueScore *= 1.5; // Additional value multiplier

  // Sensitive data handling (increased weight)
  if (data.sensitiveData === 'Yes') {
    profileRiskScore += 15;
    profileValueScore += 25;
  } else if (data.sensitiveData === 'Not Sure') {
    profileRiskScore += 10;
    profileValueScore += 20;
  }

  // Normalize profile scores
  profileRiskScore = (profileRiskScore / 100) * 33;
  profileValueScore = (profileValueScore / 100) * 33;
  
  totalRiskPoints += profileRiskScore;
  totalValuePoints += profileValueScore;

  // Add Business Profile category details
  details.push({
    category: 'Business Profile',
    riskScore: profileRiskScore,
    valueScore: profileValueScore,
    recommendations: [
      'Implement comprehensive IT management strategy',
      'Review and update data handling procedures',
      'Assess current IT support model effectiveness'
    ],
    insights: getCategoryInsights('Business Profile', data.industry, data.businessSize),
    riskAreas: [
      'Current IT support structure may need enhancement',
      'Data handling procedures require review',
      'Infrastructure complexity increases risk exposure'
    ],
    valueAreas: [
      'Opportunity for improved IT efficiency',
      'Enhanced data protection capabilities',
      'Streamlined IT support processes'
    ]
  });

  // Security Risk (33% of total)
  let securityRiskScore = 0;
  let securityValueScore = 0;

  // Last Audit (increased weight)
  if (data.lastAudit === 'Never') {
    securityRiskScore += 35;
    securityValueScore += 40;
  } else if (data.lastAudit === 'Over a year ago') {
    securityRiskScore += 25;
    securityValueScore += 35;
  }

  // MFA (increased weight)
  if (data.mfaEnabled === 'No') {
    securityRiskScore += 25;
    securityValueScore += 35;
  } else if (data.mfaEnabled === 'Not Sure') {
    securityRiskScore += 15;
    securityValueScore += 30;
  }

  // Backup frequency (increased weight)
  if (data.backupFrequency === "We don't back up data") {
    securityRiskScore += 35;
    securityValueScore += 40;
  } else if (data.backupFrequency === 'Monthly') {
    securityRiskScore += 20;
    securityValueScore += 35;
  }

  // Apply industry security multiplier (increased)
  const securityMultiplier = ['Legal', 'Finance', 'Healthcare'].includes(data.industry) ? 2 : 1;
  securityRiskScore *= securityMultiplier;
  securityValueScore *= 1.75; // Increased value multiplier

  // Normalize security scores
  securityRiskScore = (securityRiskScore / 100) * 33;
  securityValueScore = (securityValueScore / 100) * 33;

  totalRiskPoints += securityRiskScore;
  totalValuePoints += securityValueScore;

  // Add Security category details
  details.push({
    category: 'Security',
    riskScore: securityRiskScore,
    valueScore: securityValueScore,
    recommendations: [
      'Implement regular security audits',
      'Enable multi-factor authentication',
      'Establish robust backup procedures'
    ],
    insights: getCategoryInsights('Security', data.industry, data.businessSize),
    riskAreas: [
      'Security audit frequency needs improvement',
      'Authentication mechanisms require strengthening',
      'Data backup procedures need review'
    ],
    valueAreas: [
      'Enhanced security posture',
      'Improved data protection',
      'Better business continuity'
    ]
  });

  // Compliance & Support Risk (34% of total)
  let complianceRiskScore = 0;
  let complianceValueScore = 0;

  // Data regulations (increased weight)
  if (data.dataRegulations === 'Not Sure') {
    complianceRiskScore += 15;
    complianceValueScore += 35;
  }

  // IT Issues frequency (increased weight)
  if (data.itIssues === 'Daily') {
    complianceRiskScore += 35;
    complianceValueScore += 45;
  } else if (data.itIssues === 'Weekly') {
    complianceRiskScore += 25;
    complianceValueScore += 40;
  }

  // IT Criticality (increased weight)
  switch (data.itCriticality) {
    case 'IT downtime causes immediate operational issues':
      complianceRiskScore += 25;
      complianceValueScore += 45;
      break;
    case 'IT downtime impacts productivity but not critical operations':
      complianceRiskScore += 20;
      complianceValueScore += 35;
      break;
    case 'IT downtime is a minor inconvenience':
      complianceRiskScore += 15;
      complianceValueScore += 25;
      break;
  }

  // Normalize compliance scores
  complianceRiskScore = (complianceRiskScore / 100) * 34;
  complianceValueScore = (complianceValueScore / 100) * 34;

  totalRiskPoints += complianceRiskScore;
  totalValuePoints += complianceValueScore;

  // Round scores and ensure they don't exceed 100
  totalRiskPoints = Math.min(Math.round(totalRiskPoints), 100);
  totalValuePoints = Math.min(Math.round(totalValuePoints), 100);

  // New risk level thresholds
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (totalRiskPoints < 40) riskLevel = 'Low';
  else if (totalRiskPoints <= 70) riskLevel = 'Medium';
  else riskLevel = 'High';

  const getTopRisks = () => {
    const risks = [];
    if (data.sensitiveData === 'Yes') {
      risks.push("Handles sensitive data requiring enhanced protection");
    }
    if (data.lastAudit === 'Never' || data.lastAudit === 'Over a year ago') {
      risks.push("Overdue for security audit");
    }
    if (data.backupFrequency === "We don't back up data" || data.backupFrequency === 'Not Sure') {
      risks.push("Inadequate data backup procedures");
    }
    if (data.mfaEnabled === 'No') {
      risks.push("Missing multi-factor authentication");
    }
    if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
      risks.push("Frequent IT disruptions impacting business");
    }
    return risks.slice(0, 3);
  };

  const getValueProposition = () => {
    const values = [];
    if (data.sensitiveData === 'Yes') {
      values.push("Enhanced data protection and compliance support");
    }
    if (data.itSupportType === 'We do not have IT Support currently') {
      values.push("Professional IT management and support");
    }
    if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
      values.push("Reduced downtime and improved system reliability");
    }
    if (data.itCriticality === 'IT downtime causes immediate operational issues') {
      values.push("High-availability IT systems with priority support");
    }
    return values;
  };

  const executiveSummary = {
    industryInsights: INDUSTRY_INSIGHTS[data.industry] || INDUSTRY_INSIGHTS.Other,
    riskLevel: riskLevel,
    topRisks: getTopRisks(),
    recommendations: details.flatMap(d => d.recommendations),
    valueProposition: getValueProposition()
  };

  const { maxRiskPoints, maxValuePoints } = calculateMaxScores();

  return {
    total: totalRiskPoints,
    maxPossible: maxRiskPoints,
    valueScore: totalValuePoints,
    maxValuePossible: maxValuePoints,
    level: riskLevel,
    executiveSummary,
    details,
  };
}
