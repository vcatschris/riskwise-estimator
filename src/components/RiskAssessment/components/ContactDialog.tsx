import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Database } from "@/integrations/supabase/types";
import type { ExecutiveSummary } from '../types';

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  riskLevel: 'Low' | 'Medium' | 'High';
  mode?: 'consultation' | 'download';
  assessmentId?: string | null;
}

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Insert'];

export const ContactDialog: React.FC<ContactDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  riskLevel,
  mode = 'consultation',
  assessmentId
}) => {
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!isOpen || !assessmentId) return;
      
      try {
        console.log('Fetching survey data for ContactDialog, assessment ID:', assessmentId);
        
        const { data: surveyData, error: surveyError } = await supabase
          .from('ss_risk_survey')
          .select('*')
          .eq('id', assessmentId)
          .single();
        
        if (surveyError) {
          console.error('Error fetching survey data in ContactDialog:', surveyError);
          return;
        }
        
        const { data: resultData, error: resultError } = await supabase
          .from('ss_risk_results')
          .select('*')
          .eq('survey_id', assessmentId)
          .single();
        
        if (resultError) {
          console.error('Error fetching result data in ContactDialog:', resultError);
        }
        
        const combinedData = {
          survey: surveyData,
          results: resultData || null
        };
        
        console.log('Retrieved survey data for ContactDialog:', combinedData);
        setSurveyData(combinedData);
      } catch (error) {
        console.error('Error in fetchSurveyData for ContactDialog:', error);
      }
    };
    
    fetchSurveyData();
  }, [isOpen, assessmentId]);
  
  const generatePDF = async () => {
    try {
      console.log('Attempting to generate PDF...');
      const reportElement = document.getElementById('risk-report');
      
      if (!reportElement) {
        console.error('Risk report element not found');
        throw new Error('Risk report element not found');
      }

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = reportElement.offsetWidth + 'px';
      container.style.height = 'auto';
      container.style.overflow = 'visible';
      document.body.appendChild(container);
      
      const cloneReport = reportElement.cloneNode(true) as HTMLElement;
      container.appendChild(cloneReport);
      
      cloneReport.style.display = 'block';
      cloneReport.style.visibility = 'visible';
      cloneReport.style.width = reportElement.offsetWidth + 'px';
      cloneReport.style.height = 'auto';
      
      const badges = cloneReport.querySelectorAll('[class*="rounded-full border"]');
      badges.forEach((badge) => {
        if (badge instanceof HTMLElement) {
          badge.style.display = 'inline-flex';
          badge.style.visibility = 'visible';
          badge.style.opacity = '1';
          
          const scoreElements = badge.querySelectorAll('.score-value, .score-max, [class*="font-semibold"], [class*="text-xs"], [class*="text-sm"]');
          scoreElements.forEach((element) => {
            if (element instanceof HTMLElement) {
              const originalText = element.textContent;
              element.style.display = 'inline';
              element.style.visibility = 'visible';
              element.style.opacity = '1';
              element.style.color = '#000000';
              element.style.fontWeight = '700';
              if (originalText) {
                element.textContent = originalText;
              }
            }
          });
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cloneReport, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          if (element.classList && 
             (element.classList.contains('score-value') || 
              element.classList.contains('score-max') ||
              element.classList.contains('font-semibold'))) {
            return false;
          }
          return element.classList?.contains('pdf-ignore') || false;
        }
      });
      
      console.log('Canvas generated successfully');
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      console.log('PDF created successfully');
      
      document.body.removeChild(container);
      
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const contactData: ContactSubmission = {
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || null,
        newsletter: newsletter,
        risk_level: riskLevel,
        submission_type: mode,
        assessment_id: assessmentId || null
      };

      console.log('Submitting contact data to database...');
      const { error: submissionError } = await supabase
        .from('contact_submissions')
        .insert([contactData]);

      if (submissionError) {
        console.error('Database submission error:', submissionError);
        return;
      }

      try {
        console.log("Calling Zapier webhook directly from ContactDialog...");
        const enhancedZapierPayload = {
          name: contactData.name || 'Anonymous',
          email: contactData.email || 'noemail@example.com',
          company: contactData.company || 'Unknown',
          phone: contactData.phone || 'Not provided',
          newsletter: contactData.newsletter === true,
          submission_type: contactData.submission_type || 'website',
          risk_level: riskLevel || 'Unknown',
          assessment_id: assessmentId || 'No ID',
          submission_date: new Date().toISOString(),
          
          survey_data: surveyData ? {
            business_name: surveyData.survey?.business_name || '',
            industry: surveyData.survey?.industry || '',
            business_size: surveyData.survey?.business_size || '',
            risk_score: surveyData.survey?.risk_score || 0,
            risk_level: surveyData.survey?.risk_level || '',
            value_score: surveyData.survey?.value_score || 0,
            created_at: surveyData.survey?.created_at || '',
            
            results_summary: surveyData.results ? {
              executive_summary: surveyData.results.executive_summary || null,
              risk_level: surveyData.results.risk_level || '',
              risk_score: surveyData.results.risk_score || 0,
              value_score: surveyData.results.value_score || 0,
            } : null
          } : null
        };
        
        const directZapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/3379103/2lry0on/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(enhancedZapierPayload),
        });
        
        console.log("Direct Zapier response status from ContactDialog:", directZapierResponse.status);
        const directResponseText = await directZapierResponse.text();
        console.log("Direct Zapier response from ContactDialog:", directResponseText);
      } catch (directError) {
        console.error("Error calling Zapier directly from ContactDialog:", directError);
      }

      try {
        console.log("Triggering webhook via Edge Function from ContactDialog...");
        await fetch('https://ytwjygdatwyyoxozqfat.functions.supabase.co/assessment-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assessmentId,
            contactData,
            surveyData
          }),
        });
      } catch (webhookError) {
        console.error('Webhook error (non-critical) from ContactDialog:', webhookError);
      }

      try {
        const pdf = await generatePDF();
        pdf.save('IT_Security_Assessment_Report.pdf');
        
        toast({
          title: "Success",
          description: "Your information has been submitted successfully and your report has been downloaded. Our team will be in touch soon.",
        });
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        toast({
          title: "PDF Generation Error",
          description: "We couldn't generate your PDF, but your information has been saved.",
          variant: "destructive",
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Submission error in ContactDialog:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'download' ? 'Download Your Security Report' : "Let's get to know you"}
          </DialogTitle>
          <DialogDescription>
            {mode === 'download' 
              ? 'Complete your details to receive your detailed IT security assessment report.'
              : 'Tell us a bit about yourself so we can help secure your business better.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" placeholder="Your company name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="Your phone number" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="newsletter" 
              checked={newsletter}
              onCheckedChange={(checked) => setNewsletter(checked as boolean)}
            />
            <Label 
              htmlFor="newsletter" 
              className="text-sm leading-none select-none cursor-pointer"
            >
              Subscribe to our newsletter for security tips and updates
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : mode === 'download' ? 'Download Report' : 'Request Consultation & Download Report'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
