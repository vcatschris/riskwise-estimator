
import React from 'react';
import { motion } from 'framer-motion';
import { RiskScore } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface CategoryDetailsProps {
  assessment: RiskScore;
}

export function CategoryDetails({ assessment }: CategoryDetailsProps) {
  const renderRiskAndValueList = (category: string) => {
    const categoryData = assessment.details.find(detail => detail.category === category);
    if (!categoryData) return null;

    return (
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Areas
          </h5>
          <ul className="space-y-2">
            {categoryData.riskAreas.map((risk, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <span className="mt-1">⚠️</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Value Opportunities
          </h5>
          <ul className="space-y-2">
            {categoryData.valueAreas.map((value, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
                <span className="mt-1">✅</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {assessment.details.map((detail, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + (index * 0.1) }}
        >
          <Card>
            <CardHeader className="border-b bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{detail.category}</CardTitle>
                <div className="flex gap