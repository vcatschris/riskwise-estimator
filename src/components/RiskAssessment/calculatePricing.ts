
import { AssessmentData, BusinessSize, Industry, ResponseTime } from './types';

const BASE_PRICES: Record<BusinessSize, number> = {
  '1-5': 350,
  '6-20': 700,
  '21-50': 1200,
  '51-100': 2000,
  '100+': 3500
};

const INDUSTRY_MULTIPLIERS: Record<Industry, number> = {
  'Healthcare': 1.4,
  'Finance': 1.3,
  'Legal': 1.25,
  'Accounting': 1.2,
  'Retail': 1.15,
  'Other': 1.1
};

const RESPONSE_TIME_ADJUSTMENTS: Record<ResponseTime, number> = {
  'Within minutes': 0.25, // +25%
  'Within an hour': 0.15, // +15%
  'Same day': 0.05, // +5%
  'Within a few days': 0, // No adjustment
  'No urgency': -0.05 // -5%
};

interface PricingBreakdown {
  basePrice: number;
  industryAdjustedPrice: number;
  finalPrice: number;
  adjustments: {
    description: string;
    amount: number;
  }[];
}

export const calculatePricing = (data: AssessmentData): PricingBreakdown => {
  // Start with base price based on business size
  const basePrice = BASE_PRICES[data.businessSize];
  
  // Apply industry multiplier
  const industryMultiplier = INDUSTRY_MULTIPLIERS[data.industry];
  const industryAdjustedPrice = basePrice * industryMultiplier;
  
  const adjustments: { description: string; amount: number; }[] = [
    {
      description: `${data.industry} industry adjustment`,
      amount: industryAdjustedPrice - basePrice
    }
  ];

  let currentPrice = industryAdjustedPrice;
  
  // Additional factors
  if (data.sensitiveData === 'Yes') {
    const adjustment = currentPrice * 0.15;
    currentPrice += adjustment;
    adjustments.push({
      description: 'Sensitive data handling',
      amount: adjustment
    });
  }

  if (data.dataRegulations === 'Yes') {
    const adjustment = currentPrice * 0.15;
    currentPrice += adjustment;
    adjustments.push({
      description: 'Data regulation compliance',
      amount: adjustment
    });
  }

  if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
    const adjustment = currentPrice * 0.10;
    currentPrice += adjustment;
    adjustments.push({
      description: 'High frequency IT issues',
      amount: adjustment
    });
  }

  if (data.backupFrequency === "We don't back up data") {
    const adjustment = currentPrice * 0.10;
    currentPrice += adjustment;
    adjustments.push({
      description: 'No current backup system',
      amount: adjustment
    });
  }

  // Service level adjustment based on response time
  const responseTimeAdjustment = RESPONSE_TIME_ADJUSTMENTS[data.responseNeeded];
  if (responseTimeAdjustment !== 0) {
    const adjustment = currentPrice * responseTimeAdjustment;
    currentPrice += adjustment;
    adjustments.push({
      description: `Response time (${data.responseNeeded})`,
      amount: adjustment
    });
  }

  // Round to 2 decimal places
  const finalPrice = Math.round(currentPrice * 100) / 100;

  return {
    basePrice,
    industryAdjustedPrice,
    finalPrice,
    adjustments
  };
};
