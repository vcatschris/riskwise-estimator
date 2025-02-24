
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Step, getTitleAndDescription } from './types/step';
import { ProviderStep } from './components/ProviderStep';
import { BusinessProfileStep } from './components/BusinessProfileStep';
import { SecurityQuestionsStep } from './components/SecurityQuestionsStep';
import { ComplianceQuestionsStep } from './components/ComplianceQuestionsStep';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FormNavigation } from './components/FormNavigation';
import { useRiskAssessment } from './hooks/useRiskAssessment';

export function RiskAssessmentForm() {
  const {
    step,
    progress,
    formData,
    handleInputChange,
    nextStep,
    previousStep,
    showEstimate,
  } = useRiskAssessment();

  const { title, description } = getTitleAndDescription(step);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {step === 'provider' && <ProviderStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'profile' && <BusinessProfileStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'security' && <SecurityQuestionsStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'compliance' && <ComplianceQuestionsStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'results' && <ResultsDisplay formData={formData} />}
      </CardContent>
      <CardFooter>
        <FormNavigation
          step={step}
          onPrevious={previousStep}
          onNext={nextStep}
        />
      </CardFooter>
    </Card>
  );
}
