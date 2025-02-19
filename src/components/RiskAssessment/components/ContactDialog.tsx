
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
      const reportElement = document.getElementById('risk-report');
      if (!reportElement) {
        throw new Error('Risk report element not found');
      }
      
      // Ensure the element is ready to be captured
      reportElement.style.display = 'block';
      reportElement.style.visibility = 'visible';
      
      // Wait for a moment to ensure the element is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
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
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // First submit the contact info
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

      const { error: submissionError } = await supabase
        .from('contact_submissions')
        .insert([contactData]);

      if (submissionError) {
        throw submissionError;
      }

      // If it's a download request, generate and save PDF
      if (mode === 'download') {
        const pdf = await generatePDF();
        if (!pdf) {
          throw new Error('Failed to generate PDF');
        }
        pdf.save('IT_Security_Assessment_Report.pdf');
      }

      // Show success message
      toast({
        title: mode === 'download' ? "Report downloaded" : "Request submitted",
        description: mode === 'download' 
          ? "Your PDF report has been generated and downloaded."
          : "We'll be in touch with you shortly to discuss your IT needs.",
      });
      
      // Close the dialog
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
