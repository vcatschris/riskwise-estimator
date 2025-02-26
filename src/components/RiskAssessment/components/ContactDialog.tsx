
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

      // Clone the report element so we can modify it without affecting the UI
      const clone = reportElement.cloneNode(true) as HTMLElement;
      
      // Apply styles to the clone to make sure it's visible during capture
      clone.style.width = `${reportElement.scrollWidth}px`;
      clone.style.height = `${reportElement.scrollHeight}px`;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.overflow = 'visible';
      clone.style.visibility = 'visible';
      clone.style.display = 'block';
      clone.style.zIndex = '9999';
      clone.style.backgroundColor = '#ffffff';
      
      // Find all badge elements in the clone
      const badges = clone.querySelectorAll('[class*="rounded-full border"]');
      
      // Process each badge to ensure scores are visible
      badges.forEach(badge => {
        if (badge instanceof HTMLElement) {
          // Force badges to be visible
          badge.style.opacity = '1';
          badge.style.visibility = 'visible';
          badge.style.display = 'inline-flex';
          badge.style.alignItems = 'center';
          badge.style.justifyContent = 'center';
          badge.style.padding = '8px 12px';
          
          // Extract the score text
          const scoreText = badge.textContent || '';
          console.log('Badge text content:', scoreText);
          
          // Extract numbers from the text (score and max score if present)
          const matches = scoreText.match(/(\d+)(?:\s*\/\s*(\d+))?/);
          
          if (matches) {
            const mainScore = matches[1];
            const maxScore = matches[2] || '';
            
            // Create a completely new element structure for the badge
            badge.innerHTML = '';
            
            // Main score (larger, bold)
            const mainScoreSpan = document.createElement('span');
            mainScoreSpan.textContent = mainScore;
            mainScoreSpan.style.fontSize = '20px';
            mainScoreSpan.style.fontWeight = 'bold';
            mainScoreSpan.style.opacity = '1';
            mainScoreSpan.style.visibility = 'visible';
            mainScoreSpan.style.lineHeight = '1';
            badge.appendChild(mainScoreSpan);
            
            // If there's a max score, add it with a slash
            if (maxScore) {
              const slashSpan = document.createElement('span');
              slashSpan.textContent = ' / ';
              slashSpan.style.fontSize = '16px';
              slashSpan.style.opacity = '1';
              slashSpan.style.visibility = 'visible';
              badge.appendChild(slashSpan);
              
              const maxScoreSpan = document.createElement('span');
              maxScoreSpan.textContent = maxScore;
              maxScoreSpan.style.fontSize = '16px';
              maxScoreSpan.style.opacity = '1';
              maxScoreSpan.style.visibility = 'visible';
              badge.appendChild(maxScoreSpan);
            }
          } else {
            console.log('No score pattern found in badge:', scoreText);
          }
        }
      });
      
      // Add the modified clone to the document body temporarily
      document.body.appendChild(clone);
      
      // Wait for the browser to render the clone
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Generating canvas from cloned element...');
      
      try {
        // Generate the canvas from the cloned element
        const canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: true,
          removeContainer: false, // Important to keep the container
          ignoreElements: (element) => 
            element.classList?.contains('hidden') || 
            window.getComputedStyle(element).display === 'none' ||
            window.getComputedStyle(element).visibility === 'hidden'
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
        
        // Remove the cloned element from the document
        document.body.removeChild(clone);
        
        return pdf;
      } catch (error) {
        // Remove the cloned element even if there's an error
        if (document.body.contains(clone)) {
          document.body.removeChild(clone);
        }
        throw error;
      }
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
