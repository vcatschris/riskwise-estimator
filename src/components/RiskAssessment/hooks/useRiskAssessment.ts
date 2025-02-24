
import { useState } from 'react';
import { Step } from '../types/step';
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { validateStep } from './validation/useStepValidation';
import { saveAssessmentResults } from './database/useAssessmentStorage';

export const useRiskAssessment = () => {
  const [step, setStep] = useState<Step>('provider');
  const [progress, setProgress] = useState(20);
  const [showEstimate, setShowEstimate] = useState(false);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    currentProvider: false
  });

  const handleInputChange = (field: keyof AssessmentData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = async () => {
    if (!validateStep(step, formData)) return;
    
    if (step === 'compliance') {
      const assessment = calculateRiskScore(formData as AssessmentData);
      console.log('Calculated assessment:', assessment);
      const savedAssessment = await saveAssessmentResults(assessment, formData);
      console.log('Saved assessment ID:', savedAssessment?.id);
      
      if (!savedAssessment) {
        return;
      }
    }

    if (step === 'provider') {
      setStep('profile');
      setProgress(40);
    } else if (step === 'profile') {
      setStep('security');
      setProgress(60);
    } else if (step === 'security') {
      setStep('compliance');
      setProgress(80);
    } else if (step === 'compliance') {
      setStep('results');
      setProgress(100);
    }
  };

  const previousStep = () => {
    if (step === 'profile') {
      setStep('provider');
      setProgress(20);
    } else if (step === 'security') {
      setStep('profile');
      setProgress(40);
    } else if (step === 'compliance') {
      setStep('security');
      setProgress(60);
    } else if (step === 'results') {
      setStep('compliance');
      setProgress(80);
    }
  };

  return {
    step,
    progress,
    formData,
    handleInputChange,
    nextStep,
    previousStep,
    showEstimate,
    setShowEstimate
  };
};
