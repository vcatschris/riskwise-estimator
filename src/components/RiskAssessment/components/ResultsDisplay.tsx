import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, PoundSterling, Check, AlertTriangle, TrendingUp, Building2, Lightbulb, ChartBar, FileDown, ListChecks } from "lucide-react";
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

  const getCtaText = () => {
    switch (assessment.level) {
      case 'High':
        return 'Get Urgent Security Support';
      case 'Medium':
        return 'Discuss Security Improvements';
      case 'Low':
        return 'Review Security Options';
      default:
        return 'Contact Support';
    }
  };

  const getCtaDescription = () => {
    switch (assessment.level) {
      case 'High':
        return 'Critical security issues require immediate attention';
      case 'Medium':
        return 'Address security gaps to protect your business';
      case 'Low':
        return 'Maintain and enhance your security posture';
      default:
        return 'Learn more about our security solutions';
    }
  };

  useEffect(() => {
    const handleDialogClose = () => {
      const reportElement = document.getElementById('risk-report');
      if (reportElement) {
        reportElement.style.visibility = 'visible';
        reportElement.style.display = 'block';
      }
    };

    if (!showDownloadDialog) {
      handleDialogClose();
    }
  }, [showDownloadDialog]);

  const riskColor = assessment.level === 'Low' 
    ? 'text-green-500 bg-green-50 dark:bg-green-950/30' 
    : assessment.level === 'Medium' 
      ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' 
      : 'text-red-500 bg-red-50 dark:bg-red-950/30';

  const getBadgeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 40) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800';
    if (percentage < 70) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800';
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
                <p className="text-sm text-muted-foreground mt-2">
                  Annual Range: £{pricing.annualRange.min.toLocaleString()} - £{pricing.annualRange.max.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  Based On Your Profile
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>Business Size: {formData.businessSize} users</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>Industry: {formData.industry}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>{pricing.isHighCompliance ? "Enhanced compliance & security measures" : "Standard security package"}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-purple-500" />
                  Included Services
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>24/7 Monitoring & Support</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>Security Incident Response</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>Regular Security Updates</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                    <span>Data Backup & Recovery</span>
                  </li>
                  {pricing.isHighCompliance && (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                        <span>Compliance Reporting & Auditing</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                        <span>Enhanced Security Controls</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mt-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-1 text-blue-500 shrink-0" />
                <div>
                  <strong className="block mb-1">Industry Benchmark Note:</strong>
                  This estimate is based on typical investment levels for businesses of your size and sector. 
                  Actual pricing may vary based on your specific infrastructure requirements, compliance needs, 
                  and desired service level.
                </div>
              </div>
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
              <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getBadgeColor(assessment.total, assessment.maxPossible)}`}>
                <span className="text-2xl font-semibold">{assessment.total}</span>
                <span className="text-sm ml-1">/ {assessment.maxPossible}</span>
              </div>
              <p className="text-sm font-bold text-[#9b87f5] mb-1 mt-2">Risk Score</p>
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
              <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getBadgeColor(assessment.valueScore, assessment.maxValuePossible)}`}>
                <span className="text-2xl font-semibold">{assessment.valueScore}</span>
                <span className="text-sm ml-1">/ {assessment.maxValuePossible}</span>
              </div>
              <p className="text-sm font-bold text-[#9b87f5] mb-1 mt-2">Value Score</p>
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

      <div id="risk-report" className="space-y-8">
        {/* Report Header */}
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <img 
              src="/lovable-uploads/65ea08b9-e4ef-469c-8686-72c7a98fc3ed.png" 
              alt="Support Stack" 
              className="h-16"
            />
            <p className="text-lg text-muted-foreground">
              IT Security Assessment Report
            </p>
            <p className="text-sm text-muted-foreground">
              Prepared by Support Stack
            </p>
          </div>
        </Card>

        {/* Risk Assessment Summary */}
        <Card className="p-6">
          <h4 className="text-xl font-semibold mb-4">Risk Assessment Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="font-medium text-lg">Overall Risk Level</p>
                <p className={`text-2xl font-bold ${riskColor}`}>{assessment.level} Risk</p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="font-semibold">{assessment.total} / {assessment.maxPossible}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Value Score</p>
                    <p className="font-semibold">{assessment.valueScore} / {assessment.maxValuePossible}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

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

        {/* Detailed Category Reports */}
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
    </div>
  );
};
