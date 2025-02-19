
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
        return null;
      }
      
      // Store original styles
      const originalDisplay = reportElement.style.display;
      const originalVisibility = reportElement.style.visibility;
      const originalPosition = reportElement.style.position;
      const originalZIndex = reportElement.style.zIndex;
      const originalPointerEvents = reportElement.style.pointerEvents;
      
      // Temporarily modify styles for capture
      reportElement.style.display = 'block';
      reportElement.style.visibility = 'visible';
      reportElement.style.position = 'relative';
      reportElement.style.zIndex = '9999';
      reportElement.style.pointerEvents = 'none';
      
      // Wait for styles to apply and any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Capturing element with dimensions:', {
        width: reportElement.offsetWidth,
        height: reportElement.offsetHeight,
        scrollWidth: reportElement.scrollWidth,
        scrollHeight: reportElement.scrollHeight
      });
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: reportElement.scrollWidth,
        windowHeight: reportElement.scrollHeight,
        logging: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('risk-report');
          if (clonedElement) {
            clonedElement.style.width = `${reportElement.scrollWidth}px`;
            clonedElement.style.height = `${reportElement.scrollHeight}px`;
          }
        }
      });
      
      console.log('Canvas generated with dimensions:', {
        width: canvas.width,
        height: canvas.height
      });
      
      // Restore original styles
      reportElement.style.display = originalDisplay;
      reportElement.style.visibility = originalVisibility;
      reportElement.style.position = originalPosition;
      reportElement.style.zIndex = originalZIndex;
      reportElement.style.pointerEvents = originalPointerEvents;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      console.log('PDF generated successfully');
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting form submission...');
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

      // Generate PDF first if it's a download request
      let pdf = null;
      if (mode === 'download') {
        console.log('Generating PDF before database submission...');
        pdf = await generatePDF();
        if (!pdf) {
          throw new Error('Failed to generate PDF');
        }
      }

      console.log('Submitting contact data to database...');
      const { error: submissionError } = await supabase
        .from('contact_submissions')
        .insert([contactData]);

      if (submissionError) {
        console.error('Database submission error:', submissionError);
        throw submissionError;
      }

      if (mode === 'download' && pdf) {
        console.log('Saving PDF...');
        pdf.save('IT_Security_Assessment_Report.pdf');
      }

      console.log('Submission completed successfully');
      toast({
        title: mode === 'download' ? "Report downloaded" : "Request submitted",
        description: mode === 'download' 
          ? "Your PDF report has been generated and downloaded."
          : "We'll be in touch with you shortly to discuss your IT needs.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
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
            {loading ? 'Processing...' : mode === 'download' ? 'Download Report' : 'Request Consultation'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
