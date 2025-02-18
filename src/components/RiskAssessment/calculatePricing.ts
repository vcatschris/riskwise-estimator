
import { AssessmentData } from './types';

const BASE_PRICES = {
  '1-5': 350,
  '6-20': 650,
  '21-50': 1100,
  '51-100': 1800,
  '100+': 3000
};

const PER_USER_PRICES = {
  '1-5': 45,
  '6-20': 40,
  '21-50': 35,
  '51-100': 30,
  '100+': 25
};

const USER_COUNT_ESTIMATES = {
  '1-5': 5,
  '6-20': 20,
  '21-50': 50,
  '51-100': 100,
  '100+': 150
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
  // Calculate base package with modifiers
  let basePackage = BASE_PRICES[data.businessSize];
  
  // Apply industry multiplier to base package only
  basePackage *= INDUSTRY_MULTIPLIERS[data.industry];

  // Calculate additional factor increases (capped at 25%)
  let additionalIncrease = 0;

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

  // Apply the capped additional increase to base package
  basePackage *= (1 + additionalIncrease);

  // Calculate per-user costs separately
  const perUserCost = PER_USER_PRICES[data.businessSize] * USER_COUNT_ESTIMATES[data.businessSize];

  // Final price is base package plus per-user costs
  const totalPrice = Math.round(basePackage + perUserCost);

  return {
    totalPrice,
    basePackage: Math.round(basePackage),
    perUserCost: Math.round(perUserCost),
    perUserPrice: PER_USER_PRICES[data.businessSize],
    estimatedUsers: USER_COUNT_ESTIMATES[data.businessSize]
  };
};

export { BASE_PRICES, PER_USER_PRICES, USER_COUNT_ESTIMATES }; // Export for use in other components
