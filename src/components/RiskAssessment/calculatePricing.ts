
import { AssessmentData } from './types';

export const BASE_PRICES = {
  '1-5': 350,
  '6-20': 700,
  '21-50': 1200,
  '51-100': 2000,
  '100+': 3500
};

const INDUSTRY_MULTIPLIERS = {
  'Healthcare': 1.4,
  'Finance': 1.3,
  'Legal': 1.25,
  'Accounting': 1.2,
  'Retail': 1.15,
  'Other': 1.1
};

const RESPONSE_TIME_ADJUSTMENTS = {
  'Within minutes': 0.25, // +25%
  'Within an hour': 0.15, // +15%
  'Same day': 0.05, // +5%
  'Within a few days': 0, // No adjustment
  'No urgency': -0.05 // -5%
};

export const calculatePricing = (data: AssessmentData) => {
  // Start with base price for business size
  let basePrice = BASE_PRICES[data.businessSize];

  // Apply industry multiplier
  basePrice *= INDUSTRY_MULTIPLIERS[data.industry];

  // Additional factors
  if (data.sensitiveData === 'Yes') {
    basePrice *= 1.15; // +15%
  }

  if (data.responseNeeded === 'Within minutes' || data.responseNeeded === 'Within an hour') {
    basePrice *= 1.20; // +20% for rapid response need
  }

  if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
    basePrice *= 1.10; // +10% for high frequency of issues
  }

  if (data.dataRegulations === 'Yes') {
    basePrice *= 1.15; // +15%
  }

  if (data.backupFrequency === "We don't back up data") {
    basePrice *= 1.10; // +10%
  }

  // Apply response time adjustment
  basePrice *= (1 + RESPONSE_TIME_ADJUSTMENTS[data.responseNeeded]);

  return Math.round(basePrice); // Round to nearest pound
};
