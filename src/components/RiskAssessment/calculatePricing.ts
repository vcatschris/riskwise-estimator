
import { AssessmentData } from './types';

const BASE_PRICES = {
  '1-5': 350,
  '6-20': 650,
  '21-50': 1100,
  '51-100': 1800,
  '100+': 3000
};

const INDUSTRY_MULTIPLIERS = {
  'Healthcare': 1.3,
  'Finance': 1.2,
  'Legal': 1.15,
  'Accounting': 1.15,
  'Retail': 1.1,
  'Other': 1.05
};

export const calculatePricing = (data: AssessmentData) => {
  // Start with base price for business size
  let basePrice = BASE_PRICES[data.businessSize];

  // Apply industry multiplier
  basePrice *= INDUSTRY_MULTIPLIERS[data.industry];

  // Initialize total percentage increase for additional factors
  let additionalIncrease = 0;

  // Add percentages for each applicable factor
  if (data.sensitiveData === 'Yes') {
    additionalIncrease += 0.10; // +10%
  }

  if (data.responseNeeded === 'Within minutes' || data.responseNeeded === 'Within an hour') {
    additionalIncrease += 0.15; // +15%
  }

  if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
    additionalIncrease += 0.05; // +5%
  }

  if (data.dataRegulations === 'Yes') {
    additionalIncrease += 0.10; // +10%
  }

  if (data.backupFrequency === "We don't back up data") {
    additionalIncrease += 0.05; // +5%
  }

  // Cap the total additional increase at 25%
  additionalIncrease = Math.min(additionalIncrease, 0.25);

  // Apply the capped additional increase
  basePrice *= (1 + additionalIncrease);

  return Math.round(basePrice); // Round to nearest pound
};

export { BASE_PRICES }; // Export for use in other components
