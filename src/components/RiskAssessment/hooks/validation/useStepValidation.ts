
import { toast } from 'sonner';
import { AssessmentData } from '../../types';
import { Step } from '../../types/step';

export const validateSurveyData = (data: Partial<AssessmentData>): boolean => {
  if (!data.name?.trim()) {
    toast.error("Name is required");
    return false;
  }
  if (!data.email?.trim()) {
    toast.error("Email is required");
    return false;
  }
  if (!data.businessName?.trim()) {
    toast.error("Business name is required");
    return false;
  }
  return true;
};

export const validateStep = (step: Step, formData: Partial<AssessmentData>): boolean => {
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
