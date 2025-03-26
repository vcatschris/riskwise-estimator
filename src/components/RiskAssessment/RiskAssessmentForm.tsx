
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Step, getTitleAndDescription } from './types/step';
import { BusinessProfileStep } from './components/BusinessProfileStep';
import { ITSupportStep } from './components/ITSupportStep';
import { InfrastructureStep } from './components/InfrastructureStep';
import { SecurityStep } from './components/SecurityStep';
import { OperationalStep } from './components/OperationalStep';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FormNavigation } from './components/FormNavigation';
import { useRiskAssessment } from './hooks/useRiskAssessment';
import { Loader2 } from 'lucide-react';
import './styles/form.css';

export function RiskAssessmentForm() {
  const {
    step,
    progress,
    formData,
    assessmentId,
    assessmentResults,
    handleInputChange,
    nextStep,
    previousStep,
    showEstimate,
    isGeneratingReport,
  } = useRiskAssessment();

  const { title, description } = getTitleAndDescription(step);

  return (
    <div className="relative w-full">
      {isGeneratingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-orange mb-4" />
            <p className="text-lg font-medium">We're building your report</p>
          </div>
        </div>
      )}
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {step === 'business' && <BusinessProfileStep formData={formData} onInputChange={handleInputChange} />}
          {step === 'itsupport' && <ITSupportStep formData={formData} onInputChange={handleInputChange} />}
          {step === 'infrastructure' && <InfrastructureStep formData={formData} onInputChange={handleInputChange} />}
          {step === 'security' && <SecurityStep formData={formData} onInputChange={handleInputChange} />}
          {step === 'operational' && <OperationalStep formData={formData} onInputChange={handleInputChange} />}
          {step === 'results' && (
            <ResultsDisplay 
              formData={formData} 
              assessmentId={assessmentId} 
              riskLevel={assessmentResults?.level || 'Medium'} 
              surveyData={formData}
            />
          )}
        </CardContent>
        <CardFooter>
          <FormNavigation
            step={step}
            onPrevious={previousStep}
            onNext={nextStep}
            isGeneratingReport={isGeneratingReport}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
