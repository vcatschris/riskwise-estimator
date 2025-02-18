
import React from 'react';
import { motion } from 'framer-motion';
import { RiskScore } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ExecutiveSummaryProps {
  assessment: RiskScore;
}

export function ExecutiveSummary({ assessment }: ExecutiveSummaryProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-2xl">Executive Summary</CardTitle>
        <CardDescription>Based on your industry profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="space-y-4">
            <h4 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Key Industry Risks
            </h4>
            <ul className="space-y-3">
              {assessment.executiveSummary.industryInsights.risks.map((risk, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-start gap-2 text-orange-700 dark:text-orange-300"
                >
                  <span className="mt-1">⚠️</span>
                  <span>{risk}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Your Top Risks
            </h4>
            <ul className="space-y-3">
              {assessment.executiveSummary.topRisks.map((risk, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-start gap-2 text-red-600 dark:text-red-400"
                >
                  <span className="mt-1">❌</span>
                  <span>{risk}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Value of Managed IT Services
          </h4>
          <ul className="grid md:grid-cols-2 gap-4">
            {assessment.executiveSummary.industryInsights.values.map((value, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="flex items-start gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
              >
                <span className="mt-1">✅</span>
                <span>{value}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
