
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentData } from '../../types';
import { formatCurrency } from '@/lib/utils';

interface CostEstimateProps {
  costs: {
    totalPrice: number;
    annualPrice: number;
    basePackage: number;
    priceRange: {
      min: number;
      max: number;
    };
    isHighCompliance: boolean;
  };
  formData: Partial<AssessmentData>;
}

export function CostEstimate({ costs, formData }: CostEstimateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardTitle className="text-xl">Monthly Investment Estimate</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(costs.totalPrice)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                per month (estimated)
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800">
                <p className="font-medium mb-2">Investment Range</p>
                <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                  {formatCurrency(costs.priceRange.min)} - {formatCurrency(costs.priceRange.max)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  monthly investment range for your business size
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800">
                <p className="font-medium mb-2">Annual Investment</p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(costs.annualPrice)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  total annual investment (12 months)
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">This estimate is based on:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Business Size: {formData.businessSize} users</li>
                <li>Industry: {formData.industry}</li>
                <li>
                  {costs.isHighCompliance
                    ? "Includes enhanced compliance & security measures"
                    : "Standard security & support package"}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
