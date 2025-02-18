
import { AssessmentData } from './types';

const BASE_PRICES = {
  '1-5': 350,
  '6-20': 650,
  '21-50': 1100,
  '51-100': 1800,
  '100+': 3000
};

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

const getPerUserPrice = (userCount: number): number => {
  if (userCount <= 10) return PER_USER_PRICES['1-10'];
  if (userCount <= 25) return PER_USER_PRICES['11-25'];
  if (userCount <= 50) return PER_USER_PRICES['26-50'];
  if (userCount <= 100) return PER_USER_PRICES['51-100'];
  return PER_USER_PRICES['100+'];
};

export const calculatePricing = (data: AssessmentData) => {
  // Step 1: Calculate base package with industry multiplier
  const basePrice = BASE_PRICES[data.businessSize];
  const industryMultipliedBase = basePrice * INDUSTRY_MULTIPLIERS[data.industry];
  
  // Step 2: Calculate additional factors
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

  // Cap additional factors at 25% and calculate addition to base price
  const cappedAdditionalPercentage = Math.min(additionalFactorsPercentage, 0.25);
  const additionalAmount = basePrice * cappedAdditionalPercentage; // Applied to original base price
  
  // Step 3: Calculate final base package
  // Industry multiplier component + Additional factors component (based on original base)
  const finalBasePackage = industryMultipliedBase + additionalAmount;
  
  // Step 4: Calculate per-user cost
  const estimatedUsers = USER_COUNT_ESTIMATES[data.businessSize];
  const perUserPrice = getPerUserPrice(estimatedUsers);
  const perUserCost = perUserPrice * estimatedUsers;
  
  // Step 5: Calculate total monthly price
  const totalPrice = Math.round(finalBasePackage + perUserCost);
  
  // Calculate annual price
  const annualPrice = totalPrice * 12;

  return {
    totalPrice,
    annualPrice,
    basePackage: Math.round(finalBasePackage),
    perUserCost: Math.round(perUserCost),
    perUserPrice,
    estimatedUsers,
    industryMultipliedBase: Math.round(industryMultipliedBase),
    additionalAmount: Math.round(additionalAmount)
  };
};

export { BASE_PRICES, PER_USER_PRICES, USER_COUNT_ESTIMATES };
