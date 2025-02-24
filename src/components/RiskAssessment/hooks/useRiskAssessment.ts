
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Step } from '../types/step';
import { AssessmentData } from '../types';
import { calculateRiskScore } from '../calculateScore';

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

  const validateStep = (): boolean => {
    switch (step) {
      case 'provider':
        if (formData.currentProvider === undefined) {
          toast.error("Please indicate if you have an IT provider");
          return false;
        }
        if (formData.currentProvider) {
          if (!formData.providerDuration) {
            toast.error("Please select how long you've been with your provider");
            return false;
          }
          if (!formData.itSupportType) {
            toast.error("Please select your type of IT support");
            return false;
          }
        }
        if (!formData.cloudProvider) {
          toast.error("Please select your cloud provider");
          return false;
        }
        return true;
      case 'profile':
        if (!formData.industry?.trim()) {
          toast.error("Please select your industry");
          return false;
        }
        if (!formData.businessSize?.trim()) {
          toast.error("Please select your business size");
          return false;
        }
        if (!formData.sensitiveData?.trim()) {
          toast.error("Please select if you handle sensitive data");
          return false;
        }
        return true;
      case 'security':
        if (!formData.lastAudit?.trim()) {
          toast.error("Please select when your last security audit was");
          return false;
        }
        if (!formData.mfaEnabled?.trim()) {
          toast.error("Please select if multi-factor authentication is enabled");
          return false;
        }
        if (!formData.backupFrequency?.trim()) {
          toast.error("Please select your backup frequency");
          return false;
        }
        return true;
      case 'compliance':
        if (!formData.dataRegulations?.trim()) {
          toast.error("Please select if you handle data regulations");
          return false;
        }
        if (!formData.itIssues?.trim()) {
          toast.error("Please select your IT issue frequency");
          return false;
        }
        if (!formData.itCriticality?.trim()) {
          toast.error("Please select your IT criticality level");
          return false;
        }
        return true;
      case 'results':
        return true;
    }
    return true;
  };

  const saveAssessmentResults = async (assessment: any) => {
    try {
      console.log('Saving assessment results:', assessment);
      
      // First save the survey data
      const { data: surveyData, error: surveyError } = await supabase
        .from('ss_risk_survey')
        .insert({
          name: formData.name,
          email: formData.email,
          business_name: formData.businessName,
          newsletter: formData.newsletter,
          current_provider: formData.currentProvider,
          provider_duration: formData.providerDuration,
          cloud_provider: formData.cloudProvider,
          industry: formData.industry,
          business_size: formData.businessSize,
          sensitive_data: formData.sensitiveData,
          last_audit: formData.lastAudit,
          mfa_enabled: formData.mfaEnabled,
          backup_frequency: formData.backupFrequency,
          data_regulations: formData.dataRegulations,
          it_issues: formData.itIssues,
          risk_score: assessment.total,
          max_possible_score: assessment.maxPossible,
          value_score: assessment.valueScore,
          max_value_possible: assessment.maxValuePossible,
          risk_level: assessment.level,
          executive_summary: assessment.executiveSummary,
          category_details: assessment.details
        })
        .select();

      if (surveyError) {
        console.error('Error saving survey:', surveyError);
        toast.error('Failed to save assessment results');
        return null;
      }

      // Then save the detailed results data
      const { data: resultData, error: resultError } = await supabase
        .from('ss_risk_results')
        .insert({
          risk_score: assessment.total,
          max_possible_score: assessment.maxPossible,
          value_score: assessment.valueScore,
          max_value_possible: assessment.maxValuePossible,
          risk_level: assessment.level,
          executive_summary: assessment.executiveSummary,
          category_details: assessment.details,
          survey_id: surveyData[0].id
        })
        .select();

      if (resultError) {
        console.error('Error saving results:', resultError);
        toast.error('Failed to save assessment results');
        return null;
      }

      console.log('Assessment saved successfully:', {
        survey: surveyData[0],
        results: resultData[0]
      });
      toast.success('Assessment results saved successfully');
      return surveyData[0];
      
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment results');
      return null;
    }
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    
    if (step === 'compliance') {
      const assessment = calculateRiskScore(formData as AssessmentData);
      console.log('Calculated assessment:', assessment);
      const savedAssessment = await saveAssessmentResults(assessment);
      console.log('Saved assessment ID:', savedAssessment?.id);
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

