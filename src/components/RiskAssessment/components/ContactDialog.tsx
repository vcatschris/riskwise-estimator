import React, { useState } from 'react';
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
  surveyData?: object;
}

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Insert'];

export const ContactDialog: React.FC<ContactDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  riskLevel,
  mode = 'consultation',
  assessmentId,
  surveyData = {}
}) => {
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const generatePDF = async () => {
    try {
      console.log('Attempting to generate PDF...');
      const reportElement = document.getElementById('risk-report');
      
      if (!reportElement) {
        console.error('Risk report element not found');
        throw new Error('Risk report element not found');
      }

      // Create a temporary container for the cloned content
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = reportElement.offsetWidth + 'px';
      container.style.height = 'auto';
      container.style.overflow = 'visible';
      document.body.appendChild(container);
      
      // Clone the report element to manipulate it without affecting the UI
      const cloneReport = reportElement.cloneNode(true) as HTMLElement;
      container.appendChild(cloneReport);
      
      // Force all content to be visible in the clone
      cloneReport.style.display = 'block';
      cloneReport.style.visibility = 'visible';
      cloneReport.style.width = reportElement.offsetWidth + 'px';
      cloneReport.style.height = 'auto';
      
      // Pre-process all score badges and ensure their visibility
      const badges = cloneReport.querySelectorAll('[class*="rounded-full border"]');
      badges.forEach((badge) => {
        if (badge instanceof HTMLElement) {
          badge.style.display = 'inline-flex';
          badge.style.visibility = 'visible';
          badge.style.opacity = '1';
          
          // Find score values and ensure they're visible
          const scoreElements = badge.querySelectorAll('.score-value, .score-max, [class*="font-semibold"], [class*="text-xs"], [class*="text-sm"]');
          scoreElements.forEach((element) => {
            if (element instanceof HTMLElement) {
              // Store the original text content
              const originalText = element.textContent;
              
              // Reset the element to ensure proper rendering
              element.style.display = 'inline';
              element.style.visibility = 'visible';
              element.style.opacity = '1';
              element.style.color = '#000000';
              element.style.fontWeight = '700';
              
              // Ensure text content is preserved
              if (originalText) {
                element.textContent = originalText;
              }
            }
          });
        }
      });
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use html2canvas with proper settings
      const canvas = await html2canvas(cloneReport, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Don't ignore elements with score values
          if (element.classList && 
             (element.classList.contains('score-value') || 
              element.classList.contains('score-max') ||
              element.classList.contains('font-semibold'))) {
            return false;
          }
          // Allow hiding of elements that we don't want in the PDF
          return element.classList?.contains('pdf-ignore') || false;
        }
      });
      
      console.log('Canvas generated successfully');
      
      // Create PDF with proper dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      
      // Add the canvas image to the PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      console.log('PDF created successfully');
      
      // Clean up the temporary container
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
        // Continue even if database submission fails
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
            submission_date: new Date().toISOString(),
            survey_data_json: JSON.stringify(surveyData || {})
          }),
        });
        
        console.log("Direct Zapier response status:", directZapierResponse.status);
        const directResponseText = await directZapierResponse.text();
        console.log("Direct Zapier response:", directResponseText);
      } catch (directError) {
        console.error("Error calling Zapier directly:", directError);
      }

      // Only try to trigger webhook if we have an assessmentId
      try {
        console.log("Triggering webhook via Edge Function...");
        await fetch('https://ytwjygdatwyyoxozqfat.functions.supabase.co/assessment-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assessmentId,
            contactData: {
              ...contactData,
              survey_data_json: JSON.stringify(surveyData || {})
            },
          }),
        });
      } catch (webhookError) {
        // Log the webhook error but continue with PDF generation
        console.error('Webhook error (non-critical):', webhookError);
      }

      // Generate and save PDF for both consultation and download modes
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
      console.error('Submission error:', error);
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
              ? 'Complete your details to receive your detailed IT security assessment report. By submitting, you agree that we may contact you if we can help with your IT security needs.'
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
          
          <input 
            type="hidden" 
            name="survey_data_json" 
            value={JSON.stringify(surveyData || {})} 
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : mode === 'download' ? 'Download Report' : 'Request Consultation & Download Report'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
