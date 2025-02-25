
import { useState } from 'react';
import { Step } from '../types/step';
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { validateStep } from './validation/useStepValidation';
import { saveAssessmentResults } from './database/useAssessmentStorage';

export const useRiskAssessment = () => {
  const [step, setStep] = useState<Step>('business');
  const [progress, setProgress] = useState(16);
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
    
    if (step === 'operational') {
      const assessment = calculateRiskScore(formData as AssessmentData);
      console.log('Calculated assessment:', assessment);
      const savedAssessment = await saveAssessmentResults(assessment, formData);
      console.log('Saved assessment ID:', savedAssessment?.id);
      
      if (!savedAssessment) {
        return;
      }
    }

    if (step === 'business') {
      setStep('itsupport');
      setProgress(32);
    } else if (step === 'itsupport') {
      setStep('infrastructure');
      setProgress(48);
    } else if (step === 'infrastructure') {
      setStep('security');
      setProgress(64);
    } else if (step === 'security') {
      setStep('operational');
      setProgress(80);
    } else if (step === 'operational') {
      setStep('results');
      setProgress(100);
    }
  };

  const previousStep = () => {
    if (step === 'itsupport') {
      setStep('business');
      setProgress(16);
    } else if (step === 'infrastructure') {
      setStep('itsupport');
      setProgress(32);
    } else if (step === 'security') {
      setStep('infrastructure');
      setProgress(48);
    } else if (step === 'operational') {
      setStep('security');
      setProgress(64);
    } else if (step === 'results') {
      setStep('operational');
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
