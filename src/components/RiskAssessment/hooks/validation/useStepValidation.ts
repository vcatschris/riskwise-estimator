
import { AssessmentData } from '../../types';
import { Step } from '../../types/step';

export const validateStep = (step: Step, formData: Partial<AssessmentData>): boolean => {
  switch (step) {
    case 'provider':
      return validateProviderStep(formData);
    case 'profile':
      return validateProfileStep(formData);
    case 'security':
      return validateSecurityStep(formData);
    case 'compliance':
      return validateComplianceStep(formData);
    case 'results':
      return true;
    default:
      return false;
  }
};

export const validateSurveyData = (formData: Partial<AssessmentData>): boolean => {
  // Remove validation for personal info since we're using generated IDs
  return true;
};

const validateProviderStep = (formData: Partial<AssessmentData>): boolean => {
  return formData.currentProvider !== undefined &&
    (formData.currentProvider ? 
      (!!formData.providerDuration && !!formData.cloudProvider) : 
      true
    );
};

const validateProfileStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.industry && 
         !!formData.businessSize;
};

const validateSecurityStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.lastAudit && 
         !!formData.mfaEnabled &&
         !!formData.backupFrequency;
};

const validateComplianceStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.dataRegulations && 
         !!formData.itIssues;
};
