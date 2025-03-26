
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface ContactSubmissionFormProps {
  assessmentId: string | null;
  riskLevel: string;
}

export function ContactSubmissionForm({ assessmentId, riskLevel }: ContactSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    newsletter: false,
    submission_type: 'contact',
  });

  // Fetch survey data when assessmentId changes
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!assessmentId) return;
      
      try {
        console.log('Fetching survey data for assessment ID:', assessmentId);
        
        // Fetch the survey data
        const { data: surveyData, error: surveyError } = await supabase
          .from('ss_risk_survey')
          .select('*')
          .eq('id', assessmentId)
          .single();
        
        if (surveyError) {
          console.error('Error fetching survey data:', surveyError);
          return;
        }
        
        // Fetch the detailed results
        const { data: resultData, error: resultError } = await supabase
          .from('ss_risk_results')
          .select('*')
          .eq('survey_id', assessmentId)
          .single();
        
        if (resultError) {
          console.error('Error fetching result data:', resultError);
        }
        
        // Combine the data
        const combinedData = {
          survey: surveyData,
          results: resultData || null
        };
        
        console.log('Retrieved survey data:', combinedData);
        setSurveyData(combinedData);
      } catch (error) {
        console.error('Error in fetchSurveyData:', error);
      }
    };
    
    fetchSurveyData();
  }, [assessmentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the enhanced Zapier payload that includes survey data
      const enhancedZapierPayload = {
        // Contact form data
        name: formData.name || 'Anonymous',
        email: formData.email || 'noemail@example.com',
        company: formData.company || 'Unknown',
        phone: formData.phone || 'Not provided',
        newsletter: formData.newsletter === true,
        submission_type: formData.submission_type || 'website',
        risk_level: riskLevel || 'Unknown',
        assessment_id: assessmentId || 'No ID',
        submission_date: new Date().toISOString(),
        
        // Include key survey fields that might be useful for Zapier automation
        survey_data: surveyData ? {
          business_name: surveyData.survey?.business_name || '',
          industry: surveyData.survey?.industry || '',
          business_size: surveyData.survey?.business_size || '',
          risk_score: surveyData.survey?.risk_score || 0,
          risk_level: surveyData.survey?.risk_level || '',
          value_score: surveyData.survey?.value_score || 0,
          created_at: surveyData.survey?.created_at || '',
          
          // Include some key result details if available
          results_summary: surveyData.results ? {
            executive_summary: surveyData.results.executive_summary || null,
            risk_level: surveyData.results.risk_level || '',
            risk_score: surveyData.results.risk_score || 0,
            value_score: surveyData.results.value_score || 0,
          } : null
        } : null
      };
      
      console.log("Direct Zapier payload:", JSON.stringify(enhancedZapierPayload, null, 2));
      
      // Try direct call to Zapier webhook first
      try {
        console.log("Calling Zapier webhook directly with combined data...");
        
        const directZapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/3379103/2lry0on/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(enhancedZapierPayload),
        });
        
        console.log("Direct Zapier response status:", directZapierResponse.status);
        const directResponseText = await directZapierResponse.text();
        console.log("Direct Zapier response:", directResponseText);
      } catch (directError) {
        console.error("Error calling Zapier directly:", directError);
      }
      
      // Create the payload for our edge function as backup
      const edgeFunctionPayload = {
        assessmentId,
        contactData: {
          ...formData,
          risk_level: riskLevel
        },
        // Include the survey data directly in the edge function payload
        surveyData: surveyData
      };
      
      console.log("Calling Supabase edge function with combined data...");
      console.log("Edge function payload:", JSON.stringify(edgeFunctionPayload, null, 2));
      
      const response = await fetch('https://ytwjygdatwyyoxozqfat.functions.supabase.co/assessment-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(edgeFunctionPayload),
      });
      
      // Log raw response for debugging
      const responseText = await response.text();
      console.log('Webhook raw response:', responseText);
      
      // Parse the response (if it's valid JSON)
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Webhook parsed response:', responseData);
      } catch (error) {
        console.error('Error parsing response:', error);
        // Continue with original response text
      }
      
      if (response.ok) {
        toast({
          title: "Form Submitted",
          description: "Thank you! We'll be in touch soon.",
          variant: "default"
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          newsletter: false,
          submission_type: 'contact',
        });
      } else {
        throw new Error(`Failed to submit form: ${responseText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium">Get in touch</h3>
      <p className="text-sm text-gray-500 mb-4">
        Leave your details and we'll contact you to discuss your IT needs.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input 
          id="name" 
          name="name"
          value={formData.name} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company *</Label>
        <Input 
          id="company" 
          name="company"
          value={formData.company} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input 
          id="phone" 
          name="phone"
          value={formData.phone} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="newsletter" 
          name="newsletter"
          checked={formData.newsletter} 
          onCheckedChange={(checked) => 
            setFormData({...formData, newsletter: checked as boolean})
          } 
        />
        <Label htmlFor="newsletter" className="text-sm font-normal">
          Subscribe to our newsletter
        </Label>
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : "Submit"}
      </Button>
    </form>
  );
}
