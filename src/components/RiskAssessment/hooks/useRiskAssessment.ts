
import { useState } from 'react';
import { Step } from '../types/step';
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';
import { validateStep } from './validation/useStepValidation';
import { saveAssessmentResults, getRecentAssessment } from './database/useAssessmentStorage';

export const useRiskAssessment = () => {
  const [step, setStep] = useState<Step>('business');
  const [progress, setProgress] = useState(16);
  const [showEstimate, setShowEstimate] = useState(false);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    currentProvider: false
  });
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [recentAssessment, setRecentAssessment] = useState<any>(null);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const handleInputChange = (field: keyof AssessmentData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchRecentAssessment = async () => {
    setLoadingRecent(true);
    try {
      const data = await getRecentAssessment();
      setRecentAssessment(data);
      console.log('Recent assessment data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching recent assessment:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const nextStep = async () => {
    // Log validation status for debugging
    console.log('Current step:', step);
    console.log('Current form data:', formData);
    console.log('Is step valid:', validateStep(step, formData));
    
    if (!validateStep(step, formData)) {
      console.log('Validation failed for step:', step);
      return;
    }
    
    if (step === 'operational') {
      const assessment = calculateRiskScore(formData as AssessmentData);
      console.log('Calculated assessment:', assessment);
      const result = await saveAssessmentResults(assessment, formData);
      console.log('Saved assessment ID:', result?.id);
      
      if (result.id) {
        setAssessmentId(result.id);
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
    assessmentId,
    recentAssessment,
    loadingRecent,
    handleInputChange,
    nextStep,
    previousStep,
    showEstimate,
    setShowEstimate,
    fetchRecentAssessment
  };
};
