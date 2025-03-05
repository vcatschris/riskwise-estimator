
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { AssessmentData } from '../../types';
import { validateSurveyData } from '../validation/useStepValidation';

const generateUniqueIdentifier = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `SURVEY-${timestamp}-${random}`;
};

export const saveAssessmentResults = async (assessment: any, formData: Partial<AssessmentData>) => {
  try {
    console.log('Saving assessment results:', assessment);
    
    // Generate unique identifier
    const uniqueId = generateUniqueIdentifier();
    
    // First try to enable service role for this operation to bypass RLS
    const { data: surveyData, error: surveyError } = await supabase
      .from('ss_risk_survey')
      .insert({
        business_name: formData.business_name || uniqueId, // Use provided business name if available
        email: formData.email || `${uniqueId}@survey.local`, // Use provided email if available
        name: formData.name || uniqueId, // Use provided name if available
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
      // Continue with in-memory assessment instead of failing
      toast({
        title: "Assessment Completed",
        description: "Your assessment results have been calculated. However, we couldn't save them to the database for later access.",
        variant: "default"
      });
      
      // Return partial success with the assessment data, but no database ID
      return {
        success: true,
        assessment: assessment,
        id: null
      };
    }

    // If the survey was saved successfully, save the detailed results
    if (surveyData && surveyData[0]) {
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
        // Continue with partial success
        toast({
          title: "Assessment Saved Partially",
          description: "Your assessment was saved, but detailed results couldn't be stored.",
          variant: "default"
        });
        
        return {
          success: true,
          id: surveyData[0].id,
          assessment: assessment
        };
      }

      console.log('Assessment saved successfully:', {
        survey: surveyData[0],
        results: resultData?.[0]
      });
      
      toast({
        title: "Assessment Saved",
        description: "Your assessment results have been saved successfully.",
        variant: "default"
      });
      
      return {
        success: true,
        id: surveyData[0].id,
        assessment: assessment
      };
    }
    
    // If no survey data but no error (unusual case)
    return {
      success: true,
      assessment: assessment,
      id: null
    };
    
  } catch (error) {
    console.error('Error saving assessment:', error);
    toast({
      title: "Assessment Completed",
      description: "Your assessment has been completed successfully, but we couldn't save it to the database.",
      variant: "default"
    });
    
    // Return the assessment data without saving
    return {
      success: true,
      assessment: assessment,
      id: null
    };
  }
};
