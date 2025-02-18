
import { AssessmentData, PricingData, BusinessSize } from './types';

const BASE_PACKAGE_PRICING = {
  'Small': 350,  // 1-10 employees
  'Medium': 700, // 11-50 employees
  'Large': 1200  // 51+ employees
} as const;

const PER_USER_PRICING = [
  { maxUsers: 10, price: 50 },   // 1-10 users
  { maxUsers: 25, price: 45 },   // 11-25 users
  { maxUsers: 50, price: 40 },   // 26-50 users
  { maxUsers: 100, price: 35 },  // 51-100 users
  { maxUsers: Infinity, price: 30 } // 100+ users
] as const;

const REGULATED_INDUSTRIES = ['Legal', 'Finance', 'Healthcare', 'Accounting'] as const;

const getBusinessSizeCategory = (businessSize: BusinessSize): 'Small' | 'Medium' | 'Large' => {
  switch(businessSize) {
    case '1-5':
    case '6-20':
      return 'Small';
    case '21-50':
      return 'Medium';
    case '51-100':
    case '100+':
      return 'Large';
    default:
      return 'Small';
  }
};

const getUserCount = (businessSize: BusinessSize): number => {
  switch(businessSize) {
    case '1-5':
      return 5;
    case '6-20':
      return 20;
    case '21-50':
      return 50;
    case '51-100':
      return 100;
    case '100+':
      return 150; // Assumption for calculation purposes
    default:
      return 5;
  }
};

export const calculatePricing = (data: AssessmentData): PricingData => {
  // Determine business size category and user count
  const businessSizeCategory = getBusinessSizeCategory(data.businessSize);
  const userCount = getUserCount(data.businessSize);

  // Get base package price
  const basePrice = BASE_PACKAGE_PRICING[businessSizeCategory];

  // Calculate per-user price based on user count
  const perUserPrice = PER_USER_PRICING.find(tier => userCount <= tier.maxUsers)?.price || 30;

  // Determine industry multiplier
  const industryMultiplier = REGULATED_INDUSTRIES.includes(data.industry as any) ? 1.25 : 1;

  // Calculate monthly total with multiplier
  const baseMonthly = basePrice + (userCount * perUserPrice * industryMultiplier);

  // Add additional costs based on requirements
  let additionalCosts = 0;

  // Security and compliance additions
  if (data.sensitiveData === 'Yes') additionalCosts += 150;
  if (data.mfaEnabled === 'No') additionalCosts += 100;
  if (data.backupFrequency === 'Daily') additionalCosts += 100;

  // Response time premium
  switch(data.responseNeeded) {
    case 'Within minutes':
      additionalCosts += 500;
      break;
    case 'Within an hour':
      additionalCosts += 300;
      break;
    case 'Same day':
      additionalCosts += 200;
      break;
  }

  const monthlyTotal = Math.round(baseMonthly + additionalCosts);
  const annualTotal = monthlyTotal * 12;

  return {
    basePrice,
    perUserPrice,
    userCount,
    industryMultiplier,
    monthlyTotal,
    annualTotal
  };
};
