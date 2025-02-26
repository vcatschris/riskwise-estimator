
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
import './styles/form.css';

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
        {step === 'business' && <BusinessProfileStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'itsupport' && <ITSupportStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'infrastructure' && <InfrastructureStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'security' && <SecurityStep formData={formData} onInputChange={handleInputChange} />}
        {step === 'operational' && <OperationalStep formData={formData} onInputChange={handleInputChange} />}
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
