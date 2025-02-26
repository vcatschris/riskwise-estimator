
import { AssessmentData } from '../../types';
import { Step } from '../../types/step';

export const validateStep = (step: Step, formData: Partial<AssessmentData>): boolean => {
  const result = (() => {
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
  })();
  
  console.log(`Validating step ${step}:`, result);
  return result;
};

export const validateSurveyData = (formData: Partial<AssessmentData>): boolean => {
  // Remove validation for personal info since we're using generated IDs
  return true;
};

const validateBusinessStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.industry && 
         !!formData.businessSize &&
         !!formData.sensitiveData &&
         !!formData.workLocation;
};

const validateITSupportStep = (formData: Partial<AssessmentData>): boolean => {
  // Check if itSupportType is set
  return !!formData.itSupportType && 
    // Only require providerDuration if they have support
    ((formData.itSupportType === 'An internal expert/team' || 
     formData.itSupportType === 'An external IT support partner') ? 
      !!formData.providerDuration : true);
};

const validateInfrastructureStep = (formData: Partial<AssessmentData>): boolean => {
  // Require all infrastructure fields
  return !!formData.infrastructure &&
         !!formData.cloudProvider;
};

const validateSecurityStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.lastAudit && 
         !!formData.mfaEnabled &&
         !!formData.backupFrequency &&
         !!formData.dataRegulations;
};

const validateOperationalStep = (formData: Partial<AssessmentData>): boolean => {
  return !!formData.itIssues && 
         !!formData.itCriticality;
};
