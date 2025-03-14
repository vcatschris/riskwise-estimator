
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { AssessmentData } from '../../types';
import { validateSurveyData } from '../validation/useStepValidation';

const generateUniqueIdentifier = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `SURVEY-${timestamp}-${random}`;
};

export const getRecentAssessment = async () => {
  try {
    // Get the most recent survey entry
    const { data: surveyData, error: surveyError } = await supabase
      .from('ss_risk_survey')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (surveyError) {
      console.error('Error fetching recent survey:', surveyError);
      toast({
        title: "Error",
        description: "Could not fetch recent assessment data.",
        variant: "destructive"
      });
      return null;
    }
    
    if (!surveyData || surveyData.length === 0) {
      console.log('No recent surveys found');
      return null;
    }
    
    // Get the detailed results for this survey
    const surveyId = surveyData[0].id;
    const { data: resultData, error: resultError } = await supabase
      .from('ss_risk_results')
      .select('*')
      .eq('survey_id', surveyId)
      .single();
    
    if (resultError) {
      console.error('Error fetching result details:', resultError);
    }
    
    // Format the timestamp to a readable date
    const createdAt = new Date(surveyData[0].created_at);
    const formattedDate = createdAt.toLocaleString();
    
    // Return combined data
    return {
      survey: {
        ...surveyData[0],
        created_at_formatted: formattedDate
      },
      details: resultData || null
    };
  } catch (error) {
    console.error('Error in getRecentAssessment:', error);
    return null;
  }
};

// Define a type for the survey data record
type SurveyRecord = { id: string, [key: string]: any };

// Define a type for the survey data array to avoid 'never' type issues
type SurveyDataArray = SurveyRecord[];

export const saveAssessmentResults = async (assessment: any, formData: Partial<AssessmentData>) => {
  try {
    console.log('Saving assessment results:', assessment);
    
    // Generate unique identifier
    const uniqueId = generateUniqueIdentifier();
    
    // Check if there's an active session
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    
    // Create the base insert query
    let insertQuery = supabase
      .from('ss_risk_survey')
      .insert({
        business_name: formData.businessName || uniqueId,
        email: formData.email || `${uniqueId}@survey.local`,
        name: formData.name || uniqueId,
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
      });

    // Execute the insert operation
    const { data: surveyData, error: surveyError } = await insertQuery;

    if (surveyError) {
      console.error('Error saving survey:', surveyError);
      // Continue with in-memory assessment instead of failing
      toast({
        title: "Assessment Completed",
        description: "Your assessment results have been calculated. However, we couldn't save them to the database due to access permissions. You can still view and download your results.",
        variant: "default"
      });
      
      // Return partial success with the assessment data, but no database ID
      return {
        success: true,
        assessment: assessment,
        id: null
      };
    }

    // If the survey was saved successfully, get the ID
    let surveyId = null;
    
    if (surveyData) {
      if (Array.isArray(surveyData)) {
        // Explicitly cast the array to our defined type to avoid 'never' type issues
        const typedArray = surveyData as SurveyDataArray;
        if (typedArray.length > 0) {
          // Handle array case
          const record = typedArray[0];
          surveyId = record?.id;
        }
      } else if (typeof surveyData === 'object' && surveyData !== null) {
        // Handle single object case
        surveyId = (surveyData as SurveyRecord).id;
      }
    }

    // If we have a survey ID, save the detailed results
    if (surveyId) {
      // Create the base insert query for results
      let resultQuery = supabase
        .from('ss_risk_results')
        .insert({
          risk_score: assessment.total,
          max_possible_score: assessment.maxPossible,
          value_score: assessment.valueScore,
          max_value_possible: assessment.maxValuePossible,
          risk_level: assessment.level,
          executive_summary: assessment.executiveSummary,
          category_details: assessment.details,
          survey_id: surveyId
        });
        
      // Execute the insert operation
      const { data: resultData, error: resultError } = await resultQuery;

      if (resultError) {
        console.error('Error saving results:', resultError);
        // Continue with partial success
        toast({
          title: "Assessment Saved Partially",
          description: "Your assessment was saved, but detailed results couldn't be stored due to access permissions.",
          variant: "default"
        });
        
        return {
          success: true,
          id: surveyId,
          assessment: assessment
        };
      }

      // Prepare survey data for logging with proper type checking
      let surveyDataToLog: SurveyRecord | null = null;
      
      if (surveyData) {
        if (Array.isArray(surveyData)) {
          // Explicitly cast the array to our defined type
          const typedArray = surveyData as SurveyDataArray;
          if (typedArray.length > 0) {
            surveyDataToLog = typedArray[0];
          }
        } else if (typeof surveyData === 'object' && surveyData !== null) {
          surveyDataToLog = surveyData as SurveyRecord;
        }
      }
      
      console.log('Assessment saved successfully:', {
        survey: surveyDataToLog,
        results: resultData
      });
      
      toast({
        title: "Assessment Saved",
        description: "Your assessment results have been saved successfully.",
        variant: "default"
      });
      
      return {
        success: true,
        id: surveyId,
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
      description: "Your assessment has been completed successfully, but we couldn't save it to the database due to an unexpected error. You can still view and download your results.",
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

export const submitContactForm = async (
  contactData: { 
    name: string; 
    email: string; 
    company: string; 
    phone?: string; 
    newsletter: boolean;
    submission_type: string;
  },
  assessmentId: string | null,
  riskLevel: string
) => {
  try {
    console.log('Submitting contact form to webhook:', {
      assessmentId,
      contactData: {
        ...contactData,
        risk_level: riskLevel
      }
    });
    
    // First try to insert into Supabase table as a backup
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: contactData.name,
          company: contactData.company,
          email: contactData.email,
          phone: contactData.phone,
          newsletter: contactData.newsletter,
          risk_level: riskLevel,
          submission_type: contactData.submission_type,
          assessment_id: assessmentId
        }]);
        
      if (error) {
        console.warn('Failed to save contact to database, but will still try webhook:', error);
      } else {
        console.log('Contact saved to database:', data);
      }
    } catch (dbError) {
      console.warn('Error saving to database:', dbError);
    }
    
    // Try direct call to Zapier webhook first
    try {
      console.log("Calling Zapier webhook directly...");
      const directZapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/3379103/2lry0on/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactData.name || 'Anonymous',
          email: contactData.email || 'noemail@example.com',
          company: contactData.company || 'Unknown',
          phone: contactData.phone || 'Not provided',
          newsletter: contactData.newsletter === true,
          submission_type: contactData.submission_type || 'website',
          risk_level: riskLevel || 'Unknown',
          assessment_id: assessmentId || 'No ID',
          submission_date: new Date().toISOString()
        }),
      });
      
      console.log("Direct Zapier response status:", directZapierResponse.status);
      try {
        const directResponseText = await directZapierResponse.text();
        console.log("Direct Zapier response:", directResponseText);
      } catch (textError) {
        console.log("Could not get response text from Zapier direct call");
      }
      
      if (directZapierResponse.ok) {
        return {
          success: true,
          message: "Contact information submitted successfully via direct Zapier webhook"
        };
      }
    } catch (directError) {
      console.error("Error calling Zapier directly:", directError);
    }
    
    // Then try the webhook (our backup)
    const response = await fetch('https://ytwjygdatwyyoxozqfat.functions.supabase.co/assessment-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessmentId,
        contactData: {
          ...contactData,
          risk_level: riskLevel
        }
      }),
    });
    
    try {
      const responseData = await response.json();
      console.log('Webhook response:', responseData);
      
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`);
      }
      
      return {
        success: true,
        message: "Contact information submitted successfully via edge function"
      };
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      const textResponse = await response.text();
      console.log('Raw response text:', textResponse);
      
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText} (${textResponse})`);
      }
      
      return {
        success: true,
        message: "Contact information submitted successfully (no JSON response)"
      };
    }
  } catch (error) {
    console.error('Error submitting contact information:', error);
    return {
      success: false,
      error: error.message || "Unknown error occurred"
    };
  }
};
