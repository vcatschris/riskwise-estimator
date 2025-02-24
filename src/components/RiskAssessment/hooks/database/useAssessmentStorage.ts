
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { AssessmentData } from '../../types';
import { validateSurveyData } from '../validation/useStepValidation';

export const saveAssessmentResults = async (assessment: any, formData: Partial<AssessmentData>) => {
  try {
    console.log('Saving assessment results:', assessment);
    
    if (!validateSurveyData(formData)) {
      return null;
    }

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
