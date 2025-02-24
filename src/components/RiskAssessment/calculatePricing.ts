
import { AssessmentData, Industry } from './types';

// Define pricing bands structure
interface PricingBand {
  range: {
    min: number;
    max: number;
  };
  midpoint: number;
}

interface BusinessSizePricing {
  standard: PricingBand;
  highCompliance: PricingBand;
}

const PRICING_BANDS: Record<string, BusinessSizePricing> = {
  '1-5': {
    standard: {
      range: { min: 600, max: 800 },
      midpoint: 700
    },
    highCompliance: {
      range: { min: 800, max: 1000 },
      midpoint: 900
    }
  },
  '6-20': {
    standard: {
      range: { min: 1000, max: 1500 },
      midpoint: 1250
    },
    highCompliance: {
      range: { min: 1500, max: 2000 },
      midpoint: 1750
    }
  },
  '21-50': {
    standard: {
      range: { min: 2000, max: 3000 },
      midpoint: 2500
    },
    highCompliance: {
      range: { min: 3000, max: 4000 },
      midpoint: 3500
    }
  },
  '51-100': {
    standard: {
      range: { min: 3500, max: 5000 },
      midpoint: 4250
    },
    highCompliance: {
      range: { min: 5000, max: 7000 },
      midpoint: 6000
    }
  },
  '100+': {
    standard: {
      range: { min: 5000, max: 7000 },
      midpoint: 6000
    },
    highCompliance: {
      range: { min: 7000, max: 9000 },
      midpoint: 8000
    }
  }
};

// Helper function to determine if an industry is high-compliance
const isHighComplianceIndustry = (industry: Industry): boolean => {
  const highComplianceIndustries: Industry[] = ['Legal', 'Finance', 'Healthcare', 'Accounting'];
  return highComplianceIndustries.includes(industry);
};

export const calculatePricing = (data: AssessmentData) => {
  // Step 1: Determine if the business is in a high-compliance industry
  const isHighCompliance = isHighComplianceIndustry(data.industry);
  console.log('Is High Compliance:', isHighCompliance);
  console.log('Industry:', data.industry);
  
  // Step 2: Get the appropriate pricing band based on business size
  const pricingBand = PRICING_BANDS[data.businessSize];
  console.log('Business Size:', data.businessSize);
  console.log('Pricing Band:', pricingBand);
  
  // Step 3: Select standard or high-compliance pricing
  const selectedBand = isHighCompliance ? pricingBand.highCompliance : pricingBand.standard;
  console.log('Selected Band:', selectedBand);
  
  // Step 4: Get the monthly price (midpoint)
  const monthlyPrice = selectedBand.midpoint;
  console.log('Monthly Price (Midpoint):', monthlyPrice);
  
  // Step 5: Calculate annual values
  const annualPrice = monthlyPrice * 12;
  const annualRange = {
    min: selectedBand.range.min * 12,
    max: selectedBand.range.max * 12
  };
  console.log('Annual Price:', annualPrice);
  console.log('Annual Range:', annualRange);

  return {
    totalPrice: monthlyPrice,
    annualPrice,
    basePackage: monthlyPrice,
    priceRange: selectedBand.range,
    annualRange,
    isHighCompliance
  };
};

// Export constants for testing or reference
export const PRICING_REFERENCE = {
  PRICING_BANDS
};
