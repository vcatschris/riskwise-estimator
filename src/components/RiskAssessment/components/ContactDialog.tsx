
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
    // Wait for any animations to complete and DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 500));

    const reportElement = document.getElementById('risk-report');
    if (!reportElement) {
      console.error('Risk report element not found');
      toast({
        title: "Error generating PDF",
        description: "Could not find report content. Please ensure you are on the results page.",
        variant: "destructive",
      });
      return null;
    }

    try {
      console.log('Starting PDF generation...');
      
      // Make sure the element is visible
      reportElement.style.display = 'block';
      reportElement.style.visibility = 'visible';
      
      // Ensure all images are loaded
      const images = Array.from(reportElement.getElementsByTagName('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      const canvas = await html2canvas(reportElement, {
        logging: true,
        useCORS: true,
        scale: 2,
        allowTaint: true,
        backgroundColor: null,
        windowWidth: reportElement.scrollWidth,
        windowHeight: reportElement.scrollHeight
      });
      
      console.log('Canvas generated successfully');
      
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
      toast({
        title: "Error generating PDF",
        description: "Failed to generate the PDF report. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: ContactSubmission = {
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      newsletter: newsletter,
      risk_level: riskLevel,
      submission_type: mode,
      assessment_id: assessmentId || null
    };

    try {
      // First generate the PDF to ensure it works before saving contact info
      if (mode === 'download') {
        const pdf = await generatePDF();
        if (!pdf) {
          throw new Error('Failed to generate PDF');
        }
        
        // Only proceed with contact submission if PDF generation was successful
        const { error } = await supabase
          .from('contact_submissions')
          .insert([data]);

        if (error) throw error;

        // Save the PDF after successful contact submission
        pdf.save(`IT_Security_Assessment_Report.pdf`);
        toast({
          title: "Report downloaded",
          description: "Your PDF report has been generated and downloaded.",
        });
      } else {
        // For consultation mode, just submit contact info
        const { error } = await supabase
          .from('contact_submissions')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Request submitted",
          description: "We'll be in touch with you shortly to discuss your IT needs.",
        });
      }
      
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
