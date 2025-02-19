
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { calculatePricing } from '../calculatePricing';
import { Card } from '@/components/ui/card';

interface ResultsDisplayProps {
  formData: Partial<AssessmentData>;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ formData }) => {
  const assessment = calculateRiskScore(formData as AssessmentData);
  const pricing = calculatePricing(formData as AssessmentData);

  const riskColor = assessment.level === 'Low' 
    ? 'text-green-500 bg-green-50 dark:bg-green-950/30' 
    : assessment.level === 'Medium' 
      ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' 
      : 'text-red-500 bg-red-50 dark:bg-red-950/30';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`score-section p-8 rounded-2xl shadow-lg ${riskColor}`}
        >
          <h3 className="text-3xl font-bold mb-2">Risk Assessment Results</h3>
          <p className="text-5xl font-bold mt-4">{assessment.level} Risk</p>
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold">{assessment.total} / {assessment.maxPossible}</p>
              <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-xs text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 mx-auto">
                    <span>What's this?</span>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center space-y-3">
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        Risk Score (0-100) measures potential vulnerabilities
                      </p>
                      <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                        <li>Business Profile (33%)</li>
                        <li>Security Measures (33%)</li>
                        <li>Compliance & Support (34%)</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{assessment.valueScore} / {assessment.maxValuePossible}</p>
              <p className="text-sm text-muted-foreground mb-1">Value Score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Executive Summary */}
      <Card className="p-6">
        <h4 className="text-xl font-semibold mb-4">Executive Summary</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-2">Industry Insights</h5>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h6 className="text-sm font-medium text-muted-foreground mb-2">Key Risks</h6>
                <ul className="list-disc pl-4 space-y-1">
                  {assessment.executiveSummary.industryInsights.risks.map((risk, index) => (
                    <li key={index} className="text-sm">{risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="text-sm font-medium text-muted-foreground mb-2">Value Propositions</h6>
                <ul className="list-disc pl-4 space-y-1">
                  {assessment.executiveSummary.industryInsights.values.map((value, index) => (
                    <li key={index} className="text-sm">{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-medium mb-2">Top Risks to Address</h5>
            <ul className="list-disc pl-4 space-y-1">
              {assessment.executiveSummary.topRisks.map((risk, index) => (
                <li key={index} className="text-sm">{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Category Details */}
      {assessment.details.map((category, index) => (
        <Card key={index} className="p-6">
          <h4 className="text-xl font-semibold mb-4">{category.category}</h4>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{category.insights.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h5 className="font-medium mb-2">Risk Areas</h5>
                <ul className="list-disc pl-4 space-y-1">
                  {category.riskAreas.map((risk, idx) => (
                    <li key={idx} className="text-sm">{risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Value Areas</h5>
                <ul className="list-disc pl-4 space-y-1">
                  {category.valueAreas.map((value, idx) => (
                    <li key={idx} className="text-sm">{value}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Industry-Specific Considerations</h5>
              <ul className="list-disc pl-4 space-y-1">
                {category.insights.industrySpecific.map((insight, idx) => (
                  <li key={idx} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium mb-2">Recommendations</h5>
              <ul className="list-disc pl-4 space-y-1">
                {category.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
