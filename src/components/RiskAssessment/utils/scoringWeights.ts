
import { Industry, BusinessSize } from '../types';

export const INDUSTRY_WEIGHTS = {
  Accounting: { risk: 4.0, rp: 10, vp: 15 },
  Legal: { risk: 4.0, rp: 10, vp: 15 },
  Finance: { risk: 4.0, rp: 10, vp: 15 },
  Healthcare: { risk: 4.0, rp: 9, vp: 14 },
  Retail: { risk: 3.5, rp: 8, vp: 12 },
  Other: { risk: 3.0, rp: 7, vp: 11 },
};

export const BUSINESS_SIZE_WEIGHTS = {
  '1-5': { rp: 3, vp: 6, weight: 1.5 },
  '6-20': { rp: 4, vp: 8, weight: 2.0 },
  '21-50': { rp: 5, vp: 10, weight: 2.5 },
  '51-100': { rp: 6, vp: 12, weight: 3.0 },
  '100+': { rp: 7, vp: 14, weight: 3.5 },
};

export const calculateMaxScores = () => {
  return { maxRiskPoints: 100, maxValuePoints: 100 };
};
