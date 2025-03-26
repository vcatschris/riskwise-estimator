
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ContactSubmissionFormProps {
  assessmentId: string | null;
  riskLevel: string;
  surveyDataJson?: string | null;
}

export function ContactSubmissionForm({ assessmentId, riskLevel, surveyDataJson }: ContactSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    newsletter: false,
    submission_type: 'contact',
  });

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
      console.log("Form submission with survey data length:", surveyDataJson?.length || 0);
      
      // Create the payload to send directly to Zapier
      const zapierPayload = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || 'Not provided',
        newsletter: formData.newsletter,
        submission_type: formData.submission_type,
        risk_level: riskLevel,
        assessment_id: assessmentId || 'No ID',
        submission_date: new Date().toISOString(),
        survey_data_json: surveyDataJson || '' // Include the serialized survey data
      };
      
      console.log("Calling Zapier webhook directly...");
      
      try {
        const directZapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/3379103/2lry0on/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(zapierPayload),
        });
        
        console.log("Direct Zapier response status:", directZapierResponse.status);
        const directResponseText = await directZapierResponse.text();
        console.log("Direct Zapier response:", directResponseText);
      } catch (directError) {
        console.error("Error calling Zapier directly:", directError);
      }
      
      // Create the payload for the edge function as backup
      const edgeFunctionPayload = {
        assessmentId,
        contactData: {
          ...formData,
          risk_level: riskLevel
        },
        survey_data_json: surveyDataJson // Pass raw JSON string to edge function
      };
      
      console.log("Calling Supabase edge function...");
      
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
      
      {/* Hidden field for survey data */}
      <input 
        type="hidden" 
        name="survey_data_json" 
        value={surveyDataJson || ''} 
      />
      
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
