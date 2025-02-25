
import { AssessmentData } from '../../types';
import { Step } from '../../types/step';

export const validateStep = (step: Step, formData: Partial<AssessmentData>): boolean => {
  switch (step) {
    case 'business':
      return validateBusinessStep(formData);
    case 'itsupport':
      return validateITSupportStep(formData);
    case 'infrastructure':
      return validateInfrastructureStep(formData);
    case 'security':
      return validateSecurityStep(formData);
    case 'operational':
      return validateOperationalStep(formData);
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

const validateBusinessStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.industry && 
         !!formData.businessSize;
};

const validateITSupportStep = (formData: Partial<AssessmentData>): boolean => {
  // Check if itSupportType is set
  return !!formData.itSupportType && 
    // Only require providerDuration if they have support
    ((formData.itSupportType === 'An internal expert/team' || 
     formData.itSupportType === 'An external IT support partner') ? 
      !!formData.providerDuration : true) && 
    // Always require cloudProvider
    !!formData.cloudProvider;
};

const validateInfrastructureStep = (formData: Partial<AssessmentData>): boolean => {
  // Basic validation for infrastructure step
  return true; // Adjust as needed based on required fields
};

const validateSecurityStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.lastAudit && 
         !!formData.mfaEnabled &&
         !!formData.backupFrequency;
};

const validateOperationalStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.dataRegulations && 
         !!formData.itIssues;
};
