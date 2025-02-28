
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, PoundSterling, Check, AlertTriangle, TrendingUp, Building2, Lightbulb, ChartBar, FileDown, ListChecks, Globe, Mail, Phone } from "lucide-react";
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { calculatePricing } from '../calculatePricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactDialog } from './ContactDialog';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResultsDisplayProps {
  formData: Partial<AssessmentData>;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ formData }) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const assessment = calculateRiskScore(formData as AssessmentData);
  const pricing = calculatePricing(formData as AssessmentData);

  const getCtaText = () => {
    switch (assessment.level) {
      case 'High':
        return 'Get Urgent Security Support';
      case 'Medium':
        return 'Discuss Potential Security Improvements';
      case 'Low':
        return 'Review My IT Security Options';
      default:
        return 'Contact Support';
    }
  };

  const getCtaDescription = () => {
    switch (assessment.level) {
      case 'High':
        return 'Receive a detailed security assessment and mitigation plan';
      case 'Medium':
        return 'Review potential security enhancements for your business';
      case 'Low':
        return 'Explore opportunities to maintain your security posture';
      default:
        return 'Learn more about security solutions for your business';
    }
  };

  const isEligibleForTrial = () => {
    const size = formData.businessSize;
    if (!size) return false;
    
    const sizeNumber = parseInt(size);
    return sizeNumber > 5;
  };

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const NextStepsSection = () => (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
          <div className="col-span-1">
            <Button 
              size="lg"
              onClick={() => setShowContactDialog(true)}
              className="w-full text-base sm:text-lg py-4 sm:py-6 px-4 sm:px-8"
            >
              {getCtaText()}
            </Button>
            <div className="space-y-2 mt-3">
              <p className="text-muted-foreground text-sm text-center px-2">
                {getCtaDescription()}
              </p>
              {isEligibleForTrial() && (
                <p className="text-brand-orange text-sm font-medium text-center px-2">
                  ✨ Based on your answers, your business is eligible for a no-obligation 30-day free trial ✨
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl pt-6 sm:pt-8 border-t">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <a 
              href="https://supportstack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-brand-orange hover:text-brand-orange/80 transition-colors text-sm sm:text-base"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>supportstack.com</span>
            </a>
            <a 
              href="mailto:hello@supportstack.com"
              className="flex items-center justify-center gap-2 text-brand-orange hover:text-brand-orange/80 transition-colors text-sm sm:text-base"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>hello@supportstack.com</span>
            </a>
            <a 
              href="tel:03300552771"
              className="flex items-center justify-center gap-2 text-brand-orange hover:text-brand-orange/80 transition-colors text-sm sm:text-base"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>0330 0552 771</span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );

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

  // New function to get the appropriate text color based on risk score
  const getRiskScoreTextColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 40) return 'text-green-600 dark:text-green-400';
    if (percentage < 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  // New function to get the appropriate text color based on value score
  const getValueScoreTextColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400';
    if (percentage < 40) return 'text-green-600 dark:text-green-400';
    if (percentage < 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div id="risk-report" className="space-y-6 sm:space-y-8">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
            <img 
              src="/lovable-uploads/65ea08b9-e4ef-469c-8686-72c7a98fc3ed.png" 
              alt="Support Stack" 
              className="h-12 sm:h-16"
            />
            <p className="text-base sm:text-lg text-muted-foreground">
              IT Security Assessment Report
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Prepared by Support Stack
            </p>
          </div>
        </Card>

        {/* Download button at the top - centered */}
        <div className="flex justify-center">
          <Button
            onClick={handleDownloadClick}
            variant="secondary"
            size="lg"
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download PDF Report
          </Button>
        </div>

        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`score-section p-4 sm:p-8 rounded-2xl shadow-lg ${riskColor}`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Risk Assessment Results</h3>
            <p className="text-4xl sm:text-5xl font-bold mt-3 sm:mt-4">{assessment.level} Risk</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-4 sm:mt-6">
              <div className="text-center">
                <div className="py-2">
                  <span className={`text-xl sm:text-2xl font-semibold ${getRiskScoreTextColor(assessment.total, assessment.maxPossible)}`}>
                    {assessment.total}
                  </span>
                  <span className="text-xs sm:text-sm ml-1 text-gray-500 dark:text-gray-400">
                    / {assessment.maxPossible}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#9b87f5] mb-1 mt-2">Risk Score</p>
                <p className="text-xs font-medium px-4 mt-1">
                  <strong>Your Risk Score reflects the potential risks of not reviewing your IT services, with 100 indicating a high risk.</strong>
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 mx-auto mt-1">
                      <span>What's this?</span>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">
                          Risk Score (0-100) measures potential vulnerabilities
                        </p>
                        <ul className="space-y-1 sm:space-y-2 text-purple-800 dark:text-purple-200">
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
                <div className="py-2">
                  <span className={`text-xl sm:text-2xl font-semibold ${getValueScoreTextColor(assessment.valueScore, assessment.maxValuePossible)}`}>
                    {assessment.valueScore}
                  </span>
                  <span className="text-xs sm:text-sm ml-1 text-gray-500 dark:text-gray-400">
                    / {assessment.maxValuePossible}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#9b87f5] mb-1 mt-2">Value Score</p>
                <p className="text-xs font-medium px-4 mt-1">
                  <strong>Your Value Score highlights the potential benefits and opportunities of making strategic changes, with 100 representing maximum value.</strong>
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 mx-auto mt-1">
                      <span>What's this?</span>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">
                          Value Score (0-100) indicates potential benefits from improvements
                        </p>
                        <ul className="space-y-1 sm:space-y-2 text-purple-800 dark:text-purple-200">
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
        </div>

        <Card className="p-4 sm:p-6">
          <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Executive Summary</h4>
          <div className="space-y-4">
            {assessment.executiveSummary.narrative && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {assessment.executiveSummary.narrative}
                </p>
              </div>
            )}

            <div>
              <h5 className="font-medium text-brand-orange flex items-center gap-2 mb-2 text-base sm:text-lg">
                <ChartBar className="h-4 w-4 sm:h-5 sm:w-5" />
                Industry Insights
              </h5>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h6 className="text-xs sm:text-sm font-medium text-brand-orange flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Key Risks
                  </h6>
                  <ul className="list-disc pl-4 space-y-1">
                    {assessment.executiveSummary.industryInsights.risks.map((risk, index) => (
                      <li key={index} className="text-xs sm:text-sm">{risk}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 sm:mt-0">
                  <h6 className="text-xs sm:text-sm font-medium text-brand-orange flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Value Propositions
                  </h6>
                  <ul className="list-disc pl-4 space-y-1">
                    {assessment.executiveSummary.industryInsights.values.map((value, index) => (
                      <li key={index} className="text-xs sm:text-sm">{value}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-medium text-brand-orange flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                Top Risks to Address
              </h5>
              <ul className="list-disc pl-4 space-y-1">
                {assessment.executiveSummary.topRisks.map((risk, index) => (
                  <li key={index} className="text-xs sm:text-sm">{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {assessment.details.map((category, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {category.insights.description}
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <h5 className="font-medium mb-2 sm:mb-3 text-brand-orange flex items-center gap-2 text-sm sm:text-base">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Risk Areas
                  </h5>
                  <ul className="list-disc pl-4 space-y-2">
                    {category.riskAreas.map((risk, idx) => (
                      <li key={idx} className="text-xs sm:text-sm">{risk}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 sm:mt-0">
                  <h5 className="font-medium mb-2 sm:mb-3 text-brand-orange flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Value Areas
                  </h5>
                  <ul className="list-disc pl-4 space-y-2">
                    {category.valueAreas.map((value, idx) => (
                      <li key={idx} className="text-xs sm:text-sm">{value}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2 sm:mb-3 text-brand-orange flex items-center gap-2 text-sm sm:text-base">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Industry-Specific Considerations
                </h5>
                <ul className="list-disc pl-4 space-y-2">
                  {category.insights.industrySpecific.map((insight, idx) => (
                    <li key={idx} className="text-xs sm:text-sm">{insight}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2 sm:mb-3 text-brand-orange flex items-center gap-2 text-sm sm:text-base">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                  Recommendations
                </h5>
                <ul className="list-disc pl-4 space-y-2">
                  {category.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs sm:text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Investment Range Card - Moved after the assessment details */}
        <Card id="investment-range" className="p-4 sm:p-6 scroll-mt-8">
          <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Investment Range</h4>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-950/30 rounded-lg">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Monthly Investment</p>
                <p className="text-3xl sm:text-4xl font-bold text-purple-700 dark:text-purple-300">
                  £{pricing.totalPrice.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Range: £{pricing.priceRange.min.toLocaleString()} - £{pricing.priceRange.max.toLocaleString()}
                </p>
              </div>
              <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Annual Investment</p>
                <p className="text-2xl sm:text-3xl font-semibold text-purple-600 dark:text-purple-400">
                  £{pricing.annualPrice.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Annual Range: £{pricing.annualRange.min.toLocaleString()} - £{pricing.annualRange.max.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  Based On Your Profile
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>Business Size: {formData.businessSize} users</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>Industry: {formData.industry}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>{pricing.isHighCompliance ? "Enhanced compliance & security measures" : "Standard security package"}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                  <ListChecks className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  Included Services
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>24/7 Monitoring & Support</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>Security Incident Response</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>Regular Security Updates</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                    <span>Data Backup & Recovery</span>
                  </li>
                  {pricing.isHighCompliance && (
                    <>
                      <li className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                        <span>Compliance Reporting & Auditing</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-green-500 shrink-0" />
                        <span>Enhanced Security Controls</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-950/30 p-3 sm:p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-blue-500 shrink-0" />
                <div>
                  <strong className="block mb-1">Industry Benchmark Note:</strong>
                  This estimate is based on typical investment levels for businesses of your size and sector. 
                  Actual pricing may vary based on your specific infrastructure requirements, compliance needs, 
                  and desired service level.
                </div>
              </div>
            </div>
          </div>
        </Card>

        <NextStepsSection />
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
