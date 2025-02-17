<lov-code>
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentData, CloudProvider, SupportDuration } from './types';
import { calculateRiskScore } from './calculateScore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Users, 
  Lightbulb, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Step = 'contact' | 'provider' | 'profile' | 'security' | 'compliance' | 'results';

const getTitleAndDescription = (step: Step) => {
  switch (step) {
    case 'contact':
      return {
        title: "Let's Get to Know You",
        description: "We'll tailor the assessment to your specific business context and ensure you get the most relevant insights"
      };
    case 'provider':
      return {
        title: "Current IT Support",
        description: "Understanding your current setup helps us identify potential gaps and opportunities for improvement"
      };
    case 'profile':
      return {
        title: "Business Context",
        description: "Different industries and business sizes face unique challenges - this helps us provide targeted recommendations"
      };
    case 'security':
      return {
        title: "Security Measures",
        description: "These core security practices are critical indicators of your IT resilience"
      };
    case 'compliance':
      return {
        title: "Operational Requirements",
        description: "Help us understand your specific needs around compliance and response times"
      };
    case 'results':
      return {
        title: "",
        description: ""
      };
    default:
      return {
        title: "",
        description: ""
      };
  }
};

const isBusinessEmail = (email: string): boolean => {
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !personalDomains.includes(domain) : false;
};

export function RiskAssessmentForm() {
  const [step, setStep] = useState<Step>('contact');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    newsletter: false,
    currentProvider: false,
  });

  const { title, description } = getTitleAndDescription(step);

  const handleInputChange = (field: keyof AssessmentData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 'contact':
        if (!formData.name?.trim()) {
          toast.error("Please enter your name");
          return false;
        }
        if (!formData.email?.trim()) {
          toast.error("Please enter your email");
          return false;
        }
        if (!isBusinessEmail(formData.email)) {
          toast.error("Please use a business email address");
          return false;
        }
        if (!formData.businessName?.trim()) {
          toast.error("Please enter your business name");
          return false;
        }
        return true;

      case 'provider':
        if (formData.currentProvider === undefined) {
          toast.error("Please indicate if you have an IT provider");
          return false;
        }
        if (formData.currentProvider && !formData.providerDuration) {
          toast.error("Please select how long you've been with your provider");
          return false;
        }
        if (!formData.cloudProvider) {
          toast.error("Please select your cloud provider");
          return false;
        }
        return true;

      case 'profile':
        if (!formData.industry?.trim()) {
          toast.error("Please select your industry");
          return false;
        }
        if (!formData.businessSize?.trim()) {
          toast.error("Please select your business size");
          return false;
        }
        if (!formData.sensitiveData?.trim()) {
          toast.error("Please select if you handle sensitive data");
          return false;
        }
        return true;

      case 'security':
        if (!formData.lastAudit?.trim()) {
          toast.error("Please select when your last security audit was");
          return false;
        }
        if (!formData.mfaEnabled?.trim()) {
          toast.error("Please select if multi-factor authentication is enabled");
          return false;
        }
        if (!formData.backupFrequency?.trim()) {
          toast.error("Please select your backup frequency");
          return false;
        }
        return true;

      case 'compliance':
        if (!formData.dataRegulations?.trim()) {
          toast.error("Please select if you handle data regulations");
          return false;
        }
        if (!formData.itIssues?.trim()) {
          toast.error("Please select your IT issue frequency");
          return false;
        }
        if (!formData.responseNeeded?.trim()) {
          toast.error("Please select your required response time");
          return false;
        }
        return true;

      case 'results':
        return true;
    }
    return true;
  };

  const saveAssessmentResults = async (assessment: any) => {
    try {
      const { data, error } = await supabase
        .from('ss_tool_risk')
        .insert({
          name: formData.name,
          email: formData.email,
          business_name: formData.businessName,
          newsletter: formData.newsletter,
          current_provider: formData.currentProvider,
          provider_duration: formData.providerDuration,
          cloud_provider: formData.cloudProvider,
          industry: formData.industry,
          business_size: formData.businessSize,
          sensitive_data: formData.sensitiveData,
          last_audit: formData.lastAudit,
          mfa_enabled: formData.mfaEnabled,
          backup_frequency: formData.backupFrequency,
          data_regulations: formData.dataRegulations,
          it_issues: formData.itIssues,
          response_needed: formData.responseNeeded,
          risk_score: assessment.total,
          max_possible_score: assessment.maxPossible,
          value_score: assessment.valueScore,
          max_value_possible: assessment.maxValuePossible,
          risk_level: assessment.level,
          executive_summary: assessment.executiveSummary,
          category_details: assessment.details
        })
        .select();

      if (error) {
        console.error('Error saving assessment:', error);
        toast.error('Failed to save assessment results');
        return;
      }

      toast.success('Assessment results saved successfully');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment results');
    }
  };

  const nextStep = async () => {
    if (!validateStep()) return;

    if (step === 'compliance') {
      const assessment = calculateRiskScore(formData as AssessmentData);
      await saveAssessmentResults(assessment);
    }

    if (step === 'contact') {
      setStep('provider');
      setProgress(20);
    } else if (step === 'provider') {
      setStep('profile');
      setProgress(40);
    } else if (step === 'profile') {
      setStep('security');
      setProgress(60);
    } else if (step === 'security') {
      setStep('compliance');
      setProgress(80);
    } else if (step === 'compliance') {
      setStep('results');
      setProgress(100);
    }
  };

  const previousStep = () => {
    if (step === 'provider') {
      setStep('contact');
      setProgress(0);
    } else if (step === 'profile') {
      setStep('provider');
      setProgress(20);
    } else if (step === 'security') {
      setStep('profile');
      setProgress(40);
    } else if (step === 'compliance') {
      setStep('security');
      setProgress(60);
    } else if (step === 'results') {
      setStep('compliance');
      setProgress(80);
    }
  };

  const renderContactInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your work email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={formData.businessName || ''}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Enter your business name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={formData.newsletter}
          onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
        />
        <Label htmlFor="newsletter">Subscribe to our newsletter for IT security updates</Label>
      </div>
    </motion.div>
  );

const renderProviderInfo = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center space-x-3">
        <Checkbox
          id="currentProvider"
          checked={formData.currentProvider}
          onCheckedChange={(checked) => handleInputChange('currentProvider', checked)}
          className="h-5 w-5"
        />
        <Label htmlFor="currentProvider" className="text-lg font-medium flex items-center gap-2">
          I currently have IT support or a managed service provider
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>An IT support company helps manage your technology, provides technical support, and ensures your systems are secure and running smoothly.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>
    </div>

    {formData.currentProvider && (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Length of time with current IT provider
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The length of your relationship with your IT provider can impact the stability and effectiveness of your IT support.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select onValueChange={(value) => handleInputChange('providerDuration', value)}>
          <SelectTrigger>
            <SelectValue placeholder="How long have you been with your provider?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value="3-5 years">3-5 years</SelectItem>
            <SelectItem value="More than 5 years">More than 5 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )}

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Email and document storage provider (Microsoft 365, Google Workspace, etc.)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Cloud providers store your emails, documents, and other data online. Microsoft includes Office 365, Google includes Google Workspace (formerly G Suite).</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('cloudProvider', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Where do you store your emails and documents?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Microsoft">Microsoft (Office 365)</SelectItem>
          <SelectItem value="Google">Google Workspace</SelectItem>
          <SelectItem value="Other">Other Provider</SelectItem>
          <SelectItem value="Don't Know">Not Sure</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </motion.div>
);

const renderBusinessProfile = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Type of business (for compliance requirements)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Different industries have different IT security requirements and compliance needs.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('industry', value)}>
        <SelectTrigger>
          <SelectValue placeholder="What industry are you in?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Accounting">Accounting & Bookkeeping</SelectItem>
          <SelectItem value="Legal">Legal Services</SelectItem>
          <SelectItem value="Finance">Financial Services</SelectItem>
          <SelectItem value="Retail">Retail & E-commerce</SelectItem>
          <SelectItem value="Healthcare">Healthcare & Medical</SelectItem>
          <SelectItem value="Other">Other Industry</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Number of employees (for IT support planning)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>The number of employees affects the complexity of your IT needs and the level of support required.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('businessSize', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How many people work at your company?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-5">Small Team (1-5 employees)</SelectItem>
          <SelectItem value="6-20">Growing Business (6-20 employees)</SelectItem>
          <SelectItem value="21-50">Mid-sized Company (21-50 employees)</SelectItem>
          <SelectItem value="51-100">Large Business (51-100 employees)</SelectItem>
          <SelectItem value="100+">Enterprise (100+ employees)</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Protected information handling (customer data, financial records, etc.)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Sensitive data includes customer information, financial records, health records, or other confidential business information that needs special protection.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('sensitiveData', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you handle sensitive information?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes, we handle sensitive data</SelectItem>
          <SelectItem value="No">No, we don't handle sensitive data</SelectItem>
          <SelectItem value="Not Sure">I'm not sure</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </motion.div>
);

const renderSecurityQuestions = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Last IT security review (checking for vulnerabilities)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>A security audit reviews your IT systems for vulnerabilities and ensures your business follows best security practices.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('lastAudit', value)}>
        <SelectTrigger>
          <SelectValue placeholder="When was your last security check?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Less than 6 months ago">Recently (Less than 6 months ago)</SelectItem>
          <SelectItem value="6-12 months ago">Within the last year</SelectItem>
          <SelectItem value="Over a year ago">More than a year ago</SelectItem>
          <SelectItem value="Never">Never had a security review</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Two-factor authentication (2FA/MFA security)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Multi-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password when logging in.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('mfaEnabled', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you use two-factor authentication?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes, we use 2FA/MFA</SelectItem>
          <SelectItem value="No">No, we don't use 2FA/MFA</SelectItem>
          <SelectItem value="Not Sure">I'm not sure what this is</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Data backup schedule (how often we save copies)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Regular backups protect your business data from loss due to hardware failure, cyber attacks, or human error.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('backupFrequency', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How often do you back up your data?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Every day</SelectItem>
          <SelectItem value="Weekly">Once a week</SelectItem>
          <SelectItem value="Monthly">Once a month</SelectItem>
          <SelectItem value="Not Sure">Not sure about our backups</SelectItem>
          <SelectItem value="We don't back up data">We don't back up our data</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </motion.div>
);

const renderComplianceQuestions = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Regulatory compliance (GDPR, HIPAA, etc.)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Data regulations are laws that govern how businesses must handle and protect sensitive information (like GDPR, HIPAA, or industry-specific requirements).</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('dataRegulations', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you need to follow specific data regulations?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes, we have compliance requirements</SelectItem>
          <SelectItem value="No">No specific requirements</SelectItem>
          <SelectItem value="Not Sure">Not sure about our requirements</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        IT problems frequency (computer issues, network problems, etc.)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>How often you experience technical problems that affect your work, such as slow computers, connection issues, or software problems.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('itIssues', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How often do you have IT problems?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Multiple times per day</SelectItem>
          <SelectItem value="Weekly">A few times per week</SelectItem>
          <SelectItem value="Occasionally">A few times per month</SelectItem>
          <SelectItem value="Rarely">Very rarely</SelectItem>
          <SelectItem value="Never">Never have issues</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        IT support response time needs (how fast you need help)
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>How quickly you need IT support to respond when issues arise. This affects the type of support service your business needs.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select onValueChange={(value) => handleInputChange('responseNeeded', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How quickly do you need IT support to respond?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Within minutes">Immediate response (within minutes)</SelectItem>
          <SelectItem value="Within an hour">Quick response (within an hour)</SelectItem>
          <SelectItem value="Same day">Same business day</SelectItem>
          <SelectItem value="Within a few days">Within 2-3 business days</SelectItem>
          <SelectItem value="No urgency">No specific time requirement</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </motion.div>
);

  const renderResults = () => {
    const assessment = calculateRiskScore(formData as AssessmentData);
    const riskColor =
      assessment.level === 'Low'
        ? 'text-green-500 bg-green-50 dark:bg-green-950/30'
        : assessment.level === 'Medium'
        ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30'
        : 'text-red-500 bg-red-50 dark:bg-red-950/30';

    const getCTAContent = (level: string) => {
      switch(level) {
        case 'High':
          return {
            title: "🚨 Critical IT Risk Detected – Immediate Action Recommended! 🚨",
            message: "Your results show critical security gaps that could lead to costly breaches or downtime. Don't wait for a cyber attack that could cost you thousands - let's secure your business today!",
            buttonText: "Book Your Free Emergency IT Consultation",
            variant: "destructive" as const
          };
        case 'Medium':
          return {
            title: "⚠️ IT Vulnerabilities Identified - Let's Address Them",
            message: "Your assessment reveals several risks that need attention. Take proactive steps now to prevent these from becoming major issues that could impact your business.",
            buttonText: "Schedule Your Free IT Strategy Session",
            variant: "default" as const
          };
        default: // Low
          return {
            title: "🔒 Good Foundation - Let's Optimize Further",
            message: "While your IT setup is solid, there's room for optimization. Let our experts show you how to enhance your security and efficiency for long-term success.",
            buttonText: "Book Your Free Optimization Review",
            variant: "secondary" as const
          };
      }
    };

    const ctaContent = getCTAContent(assessment.level);

    const handlePDFDownload = async () => {
      const reportElement = document.getElementById('risk-report');
      if (!reportElement) return;

      try {
        toast.loading('Generating PDF...');
        const canvas = await html2canvas(reportElement);
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`IT_Risk_Assessment_${formData.businessName?.replace(/\s+/g, '_')}.pdf`);
        toast.success('PDF downloaded successfully!');
      } catch (error) {
        console.error('PDF generation error:', error);
        toast.error('Failed to generate PDF');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-end">
          <Button
            onClick={handlePDFDownload}
            variant="secondary"
            size="lg"
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Save as PDF
          </Button>
        </div>

        <div id="risk-report">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`score-section p-8 rounded-2xl shadow-lg ${riskColor}`}
            >
              <h3 className="text-3xl font-bold mb-2">Risk Assessment Results</h3>
              <p className="text-5xl font-bold mt-4">{assessment.level} Risk</p>
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                  <p className="text-2xl font-semibold">{assessment.total} / {assessment.maxPossible}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Value Score</p>
                  <p className="text-2xl font-semibold">{assessment.valueScore} / {assessment.maxValuePossible}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="my-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-brand-orange/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              {ctaContent.title}
            </h2>
            <p className="text-lg text-center text-muted-foreground mb-6 max-w-3xl mx-auto">
              {ctaContent.message}
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant={ctaContent.variant}
                className="text-lg px-8 py-6 h-auto"
                onClick={() => window.open('https://calendly.com/your-link', '_blank')}
              >
                {ctaContent.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Limited Time Offer: FREE 30-day IT support trial for {assessment.level} risk businesses
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-2xl">Executive Summary</CardTitle>
              <CardDescription>Based on your {formData.industry} industry profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Key Industry Risks
                  </h4>
                  <ul className="space-y-3">
                    {assessment.executiveSummary.industryInsights.risks.map((risk, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-start gap-2 text-orange-700 dark:text-orange-300"
                      >
                        <span className="mt-1">⚠️</span>
                        <span>{risk}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Your Top Risks
                  </h4>
                  <ul className="space-y-3">
