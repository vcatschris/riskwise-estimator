
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, PoundSterling, Check, AlertTriangle, TrendingUp, Building2, Lightbulb, ChartBar, FileDown } from "lucide-react";
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { calculatePricing } from '../calculatePricing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactDialog } from './ContactDialog';

interface ResultsDisplayProps {
  formData: Partial<AssessmentData>;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ formData }) => {
  const [showEstimate, setShowEstimate] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const assessment = calculateRiskScore(formData as AssessmentData);
  const pricing = calculatePricing(formData as AssessmentData);

  const riskColor = assessment.level === 'Low' 
    ? 'text-green-500 bg-green-50 dark:bg-green-950/30' 
    : assessment.level === 'Medium' 
      ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' 
      : 'text-red-500 bg-red-50 dark:bg-red-950/30';

  const getCtaText = () => {
    switch (assessment.level) {
      case 'High':
        return "Urgent: Let's Talk About Your IT Protection Plan";
      case 'Medium':
        return "Want to Strengthen Your IT Security Today?";
      case 'Low':
        return "Can We Keep Your Business Protected?";
      default:
        return "Discuss Your IT Security";
    }
  };

  const getCtaDescription = () => {
    switch (assessment.level) {
      case 'High':
        return "Your business needs immediate attention - let's secure your systems";
      case 'Medium':
        return "Take proactive steps to enhance your security measures";
      case 'Low':
        return "Maintain and improve your strong security position";
      default:
        return "Learn more about protecting your business";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 px-4 sm:px-0">
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() => setShowDownloadDialog(true)}
            size="lg"
            variant="secondary"
            className="w-full flex items-center gap-2 text-base sm:text-lg py-4 sm:py-6 whitespace-normal text-center"
          >
            <FileDown className="w-5 h-5" />
            Download Your Detailed Security Report
          </Button>
          <p className="text-muted-foreground text-xs sm:text-sm text-center font-bold">
            Get a comprehensive PDF report
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() => setShowEstimate(true)}
            size="lg"
            className="w-full flex items-center gap-2 text-base sm:text-lg py-4 sm:py-6 whitespace-normal text-center"
          >
            <PoundSterling className="w-5 h-5" />
            What should this cost me?
          </Button>
          <p className="text-muted-foreground text-xs sm:text-sm text-center font-bold">
            View benchmark pricing
          </p>
        </div>
      </div>

      {showEstimate && (
        <Card className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                Industry Benchmark Estimate
              </div>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                <PoundSterling className="h-6 w-6" />
                <span>Recommended Investment Range</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 p-6 bg-gray-50 dark:bg-gray-950/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Monthly Investment</p>
                <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                  £{pricing.totalPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Range: £{pricing.priceRange.min.toLocaleString()} - £{pricing.priceRange.max.toLocaleString()}
                </p>
              </div>
              <div className="hidden sm:block w-px h-20 bg-gray-200 dark:bg-gray-800" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Annual Investment</p>
                <p className="text-3xl font-semibold text-purple-600 dark:text-purple-400">
                  £{pricing.annualPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Based on monthly rate</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mt-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <strong>Note:</strong> This is an industry benchmark estimate based on businesses of similar size and sector. 
              Actual pricing may vary based on specific requirements, infrastructure complexity, and custom solutions needed.
            </div>
          </motion.div>
        </Card>
      )}

      {/* Risk Assessment Results */}
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-xs text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 mx-auto">
                    <span>What's this?</span>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center space-y-3">
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        Value Score (0-100) indicates potential benefits from improvements
                      </p>
                      <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                        <li>Business Profile Value (33%)</li>
                        <li>Security Enhancement Value (33%)</li>
                        <li>Compliance & Support Value (34%)</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </motion.div>

        {/* Risk-based CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto pt-6"
        >
          <Button 
            size="lg"
            onClick={() => setShowContactDialog(true)}
            className="w-full sm:w-auto text-lg py-6 px-8"
          >
            {getCtaText()}
          </Button>
          <p className="text-muted-foreground text-sm mt-2">
            {getCtaDescription()}
          </p>
        </motion.div>
      </div>

      <ContactDialog 
        isOpen={showContactDialog}
        onOpenChange={setShowContactDialog}
        riskLevel={assessment.level}
        mode="consultation"
      />

      <ContactDialog 
        isOpen={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        riskLevel={assessment.level}
        mode="download"
      />

      {/* Executive Summary */}
      <Card className="p-6">
        <h4 className="text-xl font-semibold mb-4">Executive Summary</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-brand-orange flex items-center gap-2 mb-2">
              <ChartBar className="h-5 w-5" />
              Industry Insights
            </h5>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h6 className="text-sm font-medium text-brand-orange flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  Key Risks
                </h6>
                <ul className="list-disc pl-4 space-y-1">
                  {assessment.executiveSummary.industryInsights.risks.map((risk, index) => (
                    <li key={index} className="text-sm">{risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="text-sm font-medium text-brand-orange flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  Value Propositions
                </h6>
                <ul className="list-disc pl-4 space-y-1">
                  {assessment.executiveSummary.industryInsights.values.map((value, index) => (
                    <li key={index} className="text-sm">{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-brand-orange flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5" />
              Top Risks to Address
            </h5>
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
                <h5 className="font-medium mb-2 text-brand-orange flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Areas
                </h5>
                <ul className="list-disc pl-4 space-y-1">
                  {category.riskAreas.length > 0 ? (
                    category.riskAreas.map((risk, idx) => (
                      <li key={idx} className="text-sm">{risk}</li>
                    ))
                  ) : (
                    <li className="text-sm">Standard risk considerations apply</li>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-brand-orange flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Value Areas
                </h5>
                <ul className="list-disc pl-4 space-y-1">
                  {category.valueAreas.length > 0 ? (
                    category.valueAreas.map((value, idx) => (
                      <li key={idx} className="text-sm">{value}</li>
                    ))
                  ) : (
                    <li className="text-sm">Standard value improvements available</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h5 className="font-medium mb-2 text-brand-orange flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Industry-Specific Considerations
                </h5>
                <ul className="list-disc pl-4 space-y-1">
                  {category.insights.industrySpecific.length > 0 ? (
                    category.insights.industrySpecific.map((insight, idx) => (
                      <li key={idx} className="text-sm">{insight}</li>
                    ))
                  ) : (
                    <li className="text-sm">Standard industry considerations apply</li>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-brand-orange flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recommendations
                </h5>
                <ul className="list-disc pl-4 space-y-1">
                  {category.recommendations.length > 0 ? (
                    category.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))
                  ) : (
                    <li className="text-sm">Standard improvement recommendations apply</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
