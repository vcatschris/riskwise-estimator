
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

      const contentWidth = reportElement.scrollWidth;
      const contentHeight = reportElement.scrollHeight;

      // Configure element for capture
      reportElement.style.width = `${contentWidth}px`;
      reportElement.style.height = `${contentHeight}px`;
      reportElement.style.position = 'relative';
      reportElement.style.overflow = 'visible';
      
      // Give the browser time to apply the styles
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: contentWidth,
        height: contentHeight,
        logging: true
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

      // Get the complete assessment data if we have an ID
      if (assessmentId) {
        const { data: assessment, error: assessmentError } = await supabase
          .from('ss_risk_survey')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (!assessmentError && assessment) {
          // Calculate pricing based on business size
          const basePrice = assessment.business_size === '1-5' ? 700 :
            assessment.business_size === '6-20' ? 1250 :
            assessment.business_size === '21-50' ? 2500 :
            assessment.business_size === '51-100' ? 4250 : 6000;

          const isHighCompliance = ['Legal', 'Finance', 'Healthcare', 'Accounting'].includes(assessment.industry);
          const finalPrice = isHighCompliance ? basePrice * 1.3 : basePrice;
          const annualPrice = finalPrice * 12;

          const packageInclusions = [
            "24/7 Monitoring & Support",
            "Security Incident Response",
            "Regular Security Updates",
            "Data Backup & Recovery",
          ];

          if (isHighCompliance) {
            packageInclusions.push(
              "Compliance Reporting & Auditing",
              "Enhanced Security Controls"
            );
          }

          // Type cast the executive_summary to our known type
          const executiveSummary = assessment.executive_summary as unknown as ExecutiveSummary;

          // Trigger Zapier webhook with the complete data
          const webhookUrl = process.env.VITE_ZAPIER_WEBHOOK_URL;
          if (webhookUrl) {
            try {
              const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  timestamp: new Date().toISOString(),
                  contact_info: contactData,
                  assessment_data: assessment,
                  pricing: {
                    monthly: finalPrice,
                    annual: annualPrice,
                    is_high_compliance: isHighCompliance,
                    currency: 'GBP'
                  },
                  package_inclusions: packageInclusions,
                  narrative: `New IT Security Assessment Submission\n` +
                    `Business: ${assessment.business_name}\n` +
                    `Contact: ${contactData.name} (${contactData.email})\n` +
                    `${contactData.phone ? `Phone: ${contactData.phone}\n` : ''}` +
                    `\nRisk Assessment Results:\n` +
                    `- Risk Level: ${assessment.risk_level}\n` +
                    `- Risk Score: ${assessment.risk_score}/${assessment.max_possible_score}\n` +
                    `- Value Score: ${assessment.value_score}/${assessment.max_value_possible}\n` +
                    `\nBusiness Profile:\n` +
                    `- Industry: ${assessment.industry}\n` +
                    `- Size: ${assessment.business_size} employees\n` +
                    `- Current Provider: ${assessment.current_provider ? 'Yes' : 'No'}\n` +
                    `${assessment.current_provider ? `- Provider Duration: ${assessment.provider_duration}\n` : ''}` +
                    `\nPricing Estimate:\n` +
                    `- Monthly Investment: £${finalPrice}\n` +
                    `- Annual Investment: £${annualPrice}\n` +
                    `\nPackage Includes:\n${packageInclusions.map(item => `- ${item}`).join('\n')}\n` +
                    `\nKey Risk Areas:\n${executiveSummary.topRisks.map((risk: string) => `- ${risk}`).join('\n')}\n` +
                    `\nOpportunity Summary:\n` +
                    `This ${assessment.risk_level.toLowerCase()} risk assessment indicates ${
                      assessment.risk_level === 'High' ? 'urgent security needs' :
                      assessment.risk_level === 'Medium' ? 'significant improvement opportunities' :
                      'potential for security enhancement'
                    } in ${assessment.business_name}'s IT infrastructure.\n` +
                    `${isHighCompliance ? 'The business operates in a high-compliance industry, requiring enhanced security measures.\n' : ''}` +
                    `\nContact Preferences:\n` +
                    `- Newsletter Subscription: ${contactData.newsletter ? 'Yes' : 'No'}\n` +
                    `- Submission Type: ${contactData.submission_type}`
                }),
              });
              console.log('Zapier webhook response:', response);
            } catch (error) {
              console.error('Error triggering Zapier webhook:', error);
            }
          }
        }
      }

      if (mode === 'download') {
        const pdf = await generatePDF();
        pdf.save('IT_Security_Assessment_Report.pdf');
      }

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
