
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScoreSection } from "./ResultsStep/ScoreSection";
import { ExecutiveSummary } from "./ResultsStep/ExecutiveSummary";
import { CategoryDetails } from "./ResultsStep/CategoryDetails";
import { CostEstimate } from "./ResultsStep/CostEstimate";
import { ContactSubmissionForm } from "./ContactSubmissionForm";
import { ContactDialog } from "./ContactDialog";
import { AssessmentData, RiskScore } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { calculateCosts } from '../calculatePricing';

interface ResultsDisplayProps {
  formData: Partial<AssessmentData>;
  assessmentId: string | null;
  riskLevel: string;
  surveyDataJson?: string | null;
}

export function ResultsDisplay({ formData, assessmentId, riskLevel, surveyDataJson }: ResultsDisplayProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Generate the assessment data if not already available
  const assessment: RiskScore = calculateRiskScore(formData as AssessmentData);
  
  // Calculate costs based on form data
  const costs = calculateCosts(formData as AssessmentData);

  return (
    <div id="risk-report" className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Your IT Security Assessment Results</h2>
        
        <ScoreSection assessment={assessment} />
        
        <div className="mt-4 mb-8">
          <ExecutiveSummary assessment={assessment} />
        </div>
        
        <CategoryDetails assessment={assessment} />
        
        <div className="flex justify-center mt-8 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(true)}
            className="w-full md:w-auto"
          >
            Download Full Report
          </Button>
        </div>
        
        <CostEstimate costs={costs} formData={formData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
          <p className="text-gray-700 mb-2">
            Based on your assessment results, our team can help you address the identified risks and implement solutions tailored to your business needs.
          </p>
          <p className="text-gray-700 mb-4">
            We offer a free consultation to discuss your results and recommend the most effective approach for your situation.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            <li>Review your assessment in detail</li>
            <li>Identify priority action items</li>
            <li>Develop a customized implementation plan</li>
            <li>Provide cost-effective solutions</li>
          </ul>
        </div>
        
        <div>
          <ContactSubmissionForm 
            assessmentId={assessmentId} 
            riskLevel={riskLevel} 
            surveyDataJson={surveyDataJson}
          />
        </div>
      </div>
      
      <ContactDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        riskLevel={riskLevel as any} 
        mode="download" 
        assessmentId={assessmentId}
        surveyDataJson={surveyDataJson}
      />
    </div>
  );
}
