
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
  assessmentId?: string;
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
  const { toast } = useToast();
  
  const generatePDF = async () => {
    try {
      console.log('Attempting to generate PDF...');
      const reportElement = document.getElementById('risk-report');
      
      if (!reportElement) {
        console.error('Risk report element not found');
        throw new Error('Risk report element not found');
      }

      // Clone the report element to manipulate it without affecting the UI
      const cloneReport = reportElement.cloneNode(true) as HTMLElement;
      
      // Make sure all content is visible in the clone
      cloneReport.style.display = 'block';
      cloneReport.style.visibility = 'visible';
      
      // Process all score badges and values in the clone
      const processBadges = (element: HTMLElement) => {
        // Find all badge containers
        const badges = element.querySelectorAll('[class*="rounded-full border"]');
        
        badges.forEach(badge => {
          if (badge instanceof HTMLElement) {
            badge.style.display = 'inline-flex';
            badge.style.visibility = 'visible';
            badge.style.opacity = '1';
            
            // Find and make visible all score values and max values
            const scoreValues = badge.querySelectorAll('.score-value, [class*="font-semibold"]');
            const scoreMax = badge.querySelectorAll('.score-max, [class*="text-xs"], [class*="text-sm"]');
            
            // Ensure score values are visible
            scoreValues.forEach(value => {
              if (value instanceof HTMLElement) {
                value.style.display = 'inline';
                value.style.visibility = 'visible';
                value.style.opacity = '1';
                // Force the text to be black in case it's using a color that doesn't show up well in PDF
                value.style.color = '#000000';
              }
            });
            
            // Ensure score max values are visible
            scoreMax.forEach(max => {
              if (max instanceof HTMLElement) {
                max.style.display = 'inline';
                max.style.visibility = 'visible';
                max.style.opacity = '1';
                max.style.color = '#000000';
              }
            });
          }
        });
      };
      
      // Process the badges in the clone
      processBadges(cloneReport);
      
      // Take a screenshot of the processed clone
      const canvas = await html2canvas(cloneReport, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: true,
        onclone: (documentClone) => {
          // Find the cloned report element in the cloned document
          const clonedReport = documentClone.getElementById('risk-report');
          if (clonedReport) {
            // Make sure the report is visible in the cloned document
            clonedReport.style.display = 'block';
            clonedReport.style.visibility = 'visible';
            
            // Process all badges in the cloned document
            if (clonedReport instanceof HTMLElement) {
              processBadges(clonedReport);
            }
            
            // Additional specific targeting for score elements
            const scoreElements = clonedReport.querySelectorAll('.score-value, .score-max');
            scoreElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.display = 'inline';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.color = '#000000';
                
                // Force parent elements to be visible too
                let parent = el.parentElement;
                while (parent) {
                  parent.style.display = parent.tagName === 'DIV' ? 'flex' : 'inline';
                  parent.style.visibility = 'visible';
                  parent.style.opacity = '1';
                  parent = parent.parentElement;
                }
              }
            });
          }
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
        throw submissionError;
      }

      // Try to trigger webhook, but don't fail the whole process if it fails
      try {
        console.log("Triggering webhook via Edge Function...");
        const { data: { session } } = await supabase.auth.getSession();
        await fetch('https://ytwjygdatwyyoxozqfat.functions.supabase.co/assessment-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            assessmentId,
            contactData,
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
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        toast({
          title: "PDF Generation Error",
          description: "We couldn't generate your PDF, but your information has been saved.",
          variant: "destructive",
        });
        // Still close the dialog since the form submission was successful
        onOpenChange(false);
        setLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Your information has been submitted successfully and your report has been downloaded. Our team will be in touch soon.",
      });
      
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
