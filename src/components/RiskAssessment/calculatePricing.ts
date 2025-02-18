
import { AssessmentData } from './types';

const BASE_PRICES = {
  '1-5': 350,
  '6-20': 650,
  '21-50': 1100,
  '51-100': 1800,
  '100+': 3000
};

// Updated per-user pricing tiers based on actual user count
const PER_USER_PRICES = {
  '1-10': 45,
  '11-25': 42,
  '26-50': 38,
  '51-100': 34,
  '100+': 30
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

// Helper function to determine per-user price based on user count
const getPerUserPrice = (userCount: number): number => {
  if (userCount <= 10) return PER_USER_PRICES['1-10'];
  if (userCount <= 25) return PER_USER_PRICES['11-25'];
  if (userCount <= 50) return PER_USER_PRICES['26-50'];
  if (userCount <= 100) return PER_USER_PRICES['51-100'];
  return PER_USER_PRICES['100+'];
};

export const calculatePricing = (data: AssessmentData) => {
  const basePrice = BASE_PRICES[data.businessSize];
  const estimatedUsers = USER_COUNT_ESTIMATES[data.businessSize];
  
  // 1. Calculate industry multiplier component
  const industryComponent = basePrice * INDUSTRY_MULTIPLIERS[data.industry];
  
  // 2. Calculate additional factors (capped at 25%)
  let additionalFactorsPercentage = 0;

  if (data.sensitiveData === 'Yes') {
    additionalFactorsPercentage += 0.10; // +10%
  }

  if (data.responseNeeded === 'Within minutes' || data.responseNeeded === 'Within an hour') {
    additionalFactorsPercentage += 0.15; // +15%
  }

  if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
    additionalFactorsPercentage += 0.05; // +5%
  }

  if (data.dataRegulations === 'Yes') {
    additionalFactorsPercentage += 0.10; // +10%
  }

  if (data.backupFrequency === "We don't back up data") {
    additionalFactorsPercentage += 0.05; // +5%
  }

  // Cap additional factors at 25%
  additionalFactorsPercentage = Math.min(additionalFactorsPercentage, 0.25);
  
  // Calculate additional factors component
  const additionalFactorsComponent = basePrice * additionalFactorsPercentage;
  
  // 3. Calculate final base package (industry + additional factors applied separately)
  const finalBasePackage = industryComponent + additionalFactorsComponent;
  
  // 4. Calculate per-user cost using new tiered pricing
  const perUserPrice = getPerUserPrice(estimatedUsers);
  const perUserCost = perUserPrice * estimatedUsers;
  
  // 5. Calculate total price
  const totalPrice = Math.round(finalBasePackage + perUserCost);

  return {
    totalPrice,
    basePackage: Math.round(finalBasePackage),
    perUserCost: Math.round(perUserCost),
    perUserPrice,
    estimatedUsers,
    industryComponent: Math.round(industryComponent),
    additionalFactorsComponent: Math.round(additionalFactorsComponent)
  };
};

export { BASE_PRICES, PER_USER_PRICES, USER_COUNT_ESTIMATES };
