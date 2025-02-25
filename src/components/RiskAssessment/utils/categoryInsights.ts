
import { Industry, BusinessSize, CategoryInsight } from '../types';
import { BUSINESS_PROFILE_INSIGHTS } from './categories/businessProfileInsights';
import { SECURITY_INSIGHTS } from './categories/securityInsights';
import { COMPLIANCE_INSIGHTS } from './categories/complianceInsights';

export const CATEGORY_INSIGHTS = {
  'Business Profile': BUSINESS_PROFILE_INSIGHTS,
  'Security': SECURITY_INSIGHTS,
  'Compliance & Support': COMPLIANCE_INSIGHTS
};

export function getCategoryInsights(category: string, industry: Industry, businessSize: BusinessSize): CategoryInsight {
  const categoryData = CATEGORY_INSIGHTS[category as keyof typeof CATEGORY_INSIGHTS]?.[industry];
  
  if (!categoryData) {
    return {
      description: "General business IT requirements apply.",
      industrySpecific: ["Standard industry practices apply"],
      sizeSpecific: ["Size-appropriate solutions recommended"]
    };
  }

  const sizeCategory = 
    businessSize === '1-5' || businessSize === '6-20' ? 'small' :
    businessSize === '21-50' ? 'medium' : 'large';

  return {
    description: categoryData.description,
    industrySpecific: categoryData.industrySpecific,
    sizeSpecific: categoryData.sizeSpecific[sizeCategory]
  };
}
