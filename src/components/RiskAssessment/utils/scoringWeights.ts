
import { Industry, BusinessSize } from '../types';

export const INDUSTRY_WEIGHTS = {
  Accounting: { risk: 4.0, rp: 10, vp: 25 },
  Legal: { risk: 4.0, rp: 10, vp: 25 },
  Finance: { risk: 4.0, rp: 10, vp: 25 },
  Healthcare: { risk: 4.0, rp: 9, vp: 22 },
  Retail: { risk: 3.5, rp: 8, vp: 20 },
  Other: { risk: 3.0, rp: 7, vp: 18 },
};

export const BUSINESS_SIZE_WEIGHTS = {
  '1-5': { rp: 3, vp: 12, weight: 1.5 },
  '6-20': { rp: 4, vp: 15, weight: 2.0 },
  '21-50': { rp: 5, vp: 18, weight: 2.5 },
  '51-100': { rp: 6, vp: 22, weight: 3.0 },
  '100+': { rp: 7, vp: 25, weight: 3.5 },
};

export const calculateMaxScores = () => {
  return { maxRiskPoints: 100, maxValuePoints: 100 };
};

