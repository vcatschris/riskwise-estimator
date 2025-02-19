import React, { useState } from 'react';
import { AssessmentData } from './types';
import { calculateRiskScore } from './calculateScore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Step, getTitleAndDescription } from './types/step';
import { ProviderStep } from './components/ProviderStep';
import { BusinessProfileStep } from './components/BusinessProfileStep';
import { ResultsDisplay } from './components/ResultsDisplay';

export function RiskAssessmentForm() {
  const [step, setStep] = useState<Step>('provider');
  const [progress, setProgress] = useState(20);
  const [showEstimate, setShowEstimate] = useState(false);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    currentProvider: false
  });

  const { title, description } = getTitleAndDescription(step);

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
        if (formData.currentProvider && !formData.providerDuration) {
          toast.error("Please select how long you've been with your provider");
          return false;
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
        if (!formData.responseNeeded?.trim()) {
          toast.error("Please select your required response time");
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
      const {
        data,
        error
      } = await supabase.from('ss_tool_risk').insert({
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
        response_needed: formData.responseNeeded,
        risk_score: assessment.total,
        max_possible_score: assessment.maxPossible,
        value_score: assessment.valueScore,
        max_value_possible: assessment.maxValuePossible,
        risk_level: assessment.level,
        executive_summary: assessment.executiveSummary,
        category_details: assessment.details
      }).select();
      if (error) {
        console.error('Error saving assessment:', error);
        toast.error('Failed to save assessment results');
        return;
      }
      toast.success('Assessment results saved successfully');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment results');
    }
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    if (step === 'compliance') {
      const assessment = calculateRiskScore(formData as AssessmentData);
      await saveAssessmentResults(assessment);
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
        {step === 'results' && <ResultsDisplay formData={formData} />}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== 'provider' && (
          <Button variant="outline" onClick={previousStep}>
            Previous
          </Button>
        )}
        {step !== 'results' && (
          <Button className="ml-auto" onClick={nextStep}>
            {step === 'compliance' ? 'View Results' : 'Next'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
