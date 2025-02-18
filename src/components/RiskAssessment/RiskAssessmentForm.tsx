import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentData, CloudProvider, SupportDuration, CategoryDetail } from './types';
import { calculateRiskScore, calculatePricing } from './calculateScore';
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
  HelpCircle,
  FileDown,
  Calculator,
  PoundSterling
} from 'lucide-react';
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
  const [showEstimate, setShowEstimate] = useState(false);
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
        <Label htmlFor="name">Full Name (main point of contact)</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Business Email (for your IT assessment report)</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your work email (e.g., name@company.com)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Company or Organization Name</Label>
        <Input
          id="businessName"
          value={formData.businessName || ''}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Your company's legal or trading name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={formData.newsletter}
          onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
        />
        <Label htmlFor="newsletter">Receive monthly security tips & IT best practices newsletter</Label>
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
          <Label htmlFor="currentProvider" className="text-lg font-medium">
            We currently have IT support (internal team or external provider)
          </Label>
        </div>
      </div>

      {formData.currentProvider && (
        <Select onValueChange={(value) => handleInputChange('providerDuration', value)}>
          <SelectTrigger>
            <SelectValue placeholder="How long have you had this IT support?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Less than 1 year">New relationship (Less than 1 year)</SelectItem>
            <SelectItem value="1-3 years">Established (1-3 years)</SelectItem>
            <SelectItem value="3-5 years">Long-term (3-5 years)</SelectItem>
            <SelectItem value="More than 5 years">Very long-term (More than 5 years)</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select onValueChange={(value) => handleInputChange('cloudProvider', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Which platform do you use for email & documents?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Microsoft">Microsoft 365 (formerly Office 365)</SelectItem>
          <SelectItem value="Google">Google Workspace (formerly G Suite)</SelectItem>
          <SelectItem value="Other">Another provider or on-premise system</SelectItem>
          <SelectItem value="Don't Know">Not sure which system we use</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );

  const renderBusinessProfile = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Select onValueChange={(value) => handleInputChange('industry', value)}>
        <SelectTrigger>
          <SelectValue placeholder="What type of business are you? (for compliance needs)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Accounting">Accounting & Tax Services (e.g., CPAs, Bookkeepers)</SelectItem>
          <SelectItem value="Legal">Legal Services (e.g., Law Firms, Notaries)</SelectItem>
          <SelectItem value="Finance">Financial Services (e.g., Advisory, Planning)</SelectItem>
          <SelectItem value="Retail">Retail & E-commerce (e.g., Shops, Online Stores)</SelectItem>
          <SelectItem value="Healthcare">Healthcare & Medical (e.g., Clinics, Practices)</SelectItem>
          <SelectItem value="Other">Other Industry</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('businessSize', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How many employees need IT support?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-5">Small Team (1-5 users)</SelectItem>
          <SelectItem value="6-20">Growing Business (6-20 users)</SelectItem>
          <SelectItem value="21-50">Mid-sized (21-50 users)</SelectItem>
          <SelectItem value="51-100">Large Organization (51-100 users)</SelectItem>
          <SelectItem value="100+">Enterprise (100+ users)</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('sensitiveData', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you handle sensitive information? (customer data, financial records, etc.)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We handle confidential data (needs protection)</SelectItem>
          <SelectItem value="No">No - We don't handle sensitive information</SelectItem>
          <SelectItem value="Not Sure">Not sure what counts as sensitive data</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );

  const renderSecurityQuestions = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Select onValueChange={(value) => handleInputChange('lastAudit', value)}>
        <SelectTrigger>
          <SelectValue placeholder="When was your last IT security check? (e.g., vulnerability scan)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Less than 6 months ago">Recent (within last 6 months)</SelectItem>
          <SelectItem value="6-12 months ago">Within the past year</SelectItem>
          <SelectItem value="Over a year ago">More than a year ago</SelectItem>
          <SelectItem value="Never">Never had a security assessment</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('mfaEnabled', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you use two-step login? (phone code + password)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We use extra security steps when logging in</SelectItem>
          <SelectItem value="No">No - Just username and password</SelectItem>
          <SelectItem value="Not Sure">Not sure what this means</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('backupFrequency', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How often do you backup your business data?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily backups (recommended)</SelectItem>
          <SelectItem value="Weekly">Weekly backups</SelectItem>
          <SelectItem value="Monthly">Monthly backups</SelectItem>
          <SelectItem value="Not Sure">Not sure about our backup schedule</SelectItem>
          <SelectItem value="We don't back up data">We don't have backups in place</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );

  const renderComplianceQuestions = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Select onValueChange={(value) => handleInputChange('dataRegulations', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you need to follow data protection laws? (e.g., GDPR, HIPAA)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We must follow specific regulations</SelectItem>
          <SelectItem value="No">No - No special requirements</SelectItem>
          <SelectItem value="Not Sure">Not sure about our obligations</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('itIssues', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How often do you face IT problems? (e.g., crashes, slowness)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Very frequently (multiple times per day)</SelectItem>
          <SelectItem value="Weekly">Often (several times per week)</SelectItem>
          <SelectItem value="Occasionally">Sometimes (few times per month)</SelectItem>
          <SelectItem value="Rarely">Rarely (once every few months)</SelectItem>
          <SelectItem value="Never">Never have technical issues</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('responseNeeded', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How quickly do you need IT problems fixed?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Within minutes">Emergency response (within minutes)</SelectItem>
          <SelectItem value="Within an hour">Urgent response (within an hour)</SelectItem>
          <SelectItem value="Same day">Same business day response</SelectItem>
          <SelectItem value="Within a few days">Within 2-3 business days</SelectItem>
          <SelectItem value="No urgency">No urgent requirements</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );

  const getCTAContent = (level: string) => {
    switch(level) {
      case 'High':
        return {
          title: "🚨 Critical IT Risk Detected – Immediate Action Recommended! 🚨",
          message: "Your results show critical security gaps that could lead to costly breaches or downtime. Don't wait for a cyber attack that could cost you thousands - let's secure your business today!",
          buttonText: "Book Your Free IT Consultation",
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

  const renderResults = () => {
    const assessment = calculateRiskScore(formData as AssessmentData);
    const pricing = calculatePricing(formData as AssessmentData);

    const renderRiskAndValueList = (category: string) => {
      const categoryData = assessment.details.find(detail => detail.category === category) as CategoryDetail;
      if (!categoryData) return null;

      return (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Areas
            </h5>
            <ul className="space-y-2">
              {categoryData.riskAreas.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                  <span className="mt-1">⚠️</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Value Opportunities
            </h5>
            <ul className="space-y-2">
              {categoryData.valueAreas.map((value, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
                  <span className="mt-1">✅</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };

    const calculateMonthlyCost = () => {
      return pricing;
    };

    const costs = calculateMonthlyCost();
    const userRange = {
      '1-5': 5,
      '6-20': 20,
      '21-50': 50,
      '51-100': 100,
      '100+': 150
    }[formData.businessSize || '1-5'];

    const riskColor = assessment.level === 'Low'
      ? 'text-green-500 bg-green-50 dark:bg-green-950/30'
      : assessment.level === 'Medium'
      ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30'
      : 'text-red-500 bg-red-50 dark:bg-red-950/30';

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

    const scrollToEstimate = () => {
      const estimateElement = document.getElementById('cost-estimate');
      if (estimateElement) {
        estimateElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col items-center gap-4 mb-12 px-4 sm:px-0">
          <Button
            onClick={() => setShowEstimate(true)}
            size="lg"
            className="w-full sm:max-w-md flex items-center gap-2 text-base sm:text-lg py-4 sm:py-6 whitespace-normal text-center"
          >
            <Calculator className="w-4 h-4" />
            📊 IT Investment Benchmark (£)
          </Button>
          <p className="text-muted-foreground text-xs sm:text-sm text-center font-bold">
            How much do businesses like yours typically invest in IT support?
          </p>
        </div>

        {showEstimate && (
          <motion.div
            id="cost-estimate"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="my-12 scroll-mt-8"
          >
            <Card>
              <CardHeader className="space-y-1 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <PoundSterling className="w-6 h-6 text-brand-orange" />
                  💡 Industry Benchmark: Monthly IT Investment (£)
                </CardTitle>
                <CardDescription>
                  Based on your answers about your businesses of similar size, sector and needs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-brand-orange">Base Package Investment</h4>
                    <p className="text-3xl font-bold">
                      <span className="text-sm italic text-brand-orange">from </span>
                      £{costs.basePackage.toLocaleString()}/month
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ {costs.isHighCompliance ? 'Compliance management' : 'Basic compliance support'}</p>
                      <p>✓ {formData.sensitiveData === 'Yes' ? 'Enhanced security measures' : 'Standard security package'}</p>
                      <p>✓ {formData.backupFrequency} data backups</p>
                      <p>✓ {formData.responseNeeded} support response time</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-brand-orange">Value Proposition</h4>
                    <p className="text-3xl font-bold">
                      {costs.isHighCompliance ? 'High Compliance' : 'Standard'} Package
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ {userRange} users support and management</p>
                      <p>✓ {formData.mfaEnabled === 'Yes' ? 'Multi-factor authentication' : 'Basic authentication'}</p>
                      <p>✓ Software licenses and management</p>
                      <p>✓ Device monitoring and support</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg space-y-4">
                  <h4 className="font-semibold">Estimated IT Investment Range for Your Business</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Monthly Investment</p>
                      <p className="text-2xl font-bold text-brand-orange">
                        £{costs.totalPrice.toLocaleString()}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Annual Investment</p>
                      <p className="text-2xl font-bold text-brand-orange">
                        £{costs.annualPrice.toLocaleString()}/year
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on industry norms for {userRange} users in {costs.isHighCompliance ? 'regulated' : 'standard'} industries.
                  </p>
                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-medium">📞 Want a clearer picture of how your IT setup compares?</p>
                    <p className="text-sm text-brand-orange">🔹 Book a Free IT Review to see if your current investment aligns with industry best practices.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
            className="my-8 p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-brand-orange/20"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
              {ctaContent.title}
            </h2>
            <p className="text-base sm:text-lg text-center text-muted-foreground mb-6 max-w-3xl mx-auto">
              {ctaContent.message}
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant={ctaContent.variant}
                className="text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto whitespace-normal text-center min-h-[3rem]"
                onClick={() => window.open('https://calendly.com/your-link', '_blank')}
              >
                <span className="flex items-center gap-2 justify-center">
                  {ctaContent.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                </span>
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-center text-muted-foreground mt-4">
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
                    {assessment.executiveSummary.topRisks.map((risk, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-start gap-2 text-red-600 dark:text-red-400"
                      >
                        <span className="mt-1">❌</span>
                        <span>{risk}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Value of Managed IT Services
                </h4>
                <ul className="grid md:grid-cols-2 gap-4">
                  {assessment.executiveSummary.industryInsights.values.map((value, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      className="flex items-start gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                    >
                      <span className="mt-1">✅</span>
                      <span>{value}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {assessment.details.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
              >
                <Card>
                  <CardHeader className="border-b bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{detail.category}</CardTitle>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                          <AlertTriangle className="h-4 w-4" />
                          Risk: {detail.riskScore}
                        </span>
                        <span className="flex items-center gap-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          <TrendingUp className="h-4 w-4" />
                          Value: {detail.valueScore}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <p className="text-slate-600 dark:text-slate-300">
                      {detail.insights.description}
                    </p>
                    
                    {renderRiskAndValueList(detail.category)}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {step === 'contact' && renderContactInfo()}
        {step === 'provider' && renderProviderInfo()}
        {step === 'profile' && renderBusinessProfile()}
        {step === 'security' && renderSecurityQuestions()}
        {step === 'compliance' && renderComplianceQuestions()}
        {step === 'results' && renderResults()}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== 'contact' && (
          <Button variant="outline" onClick={previousStep}>
            Previous
          </Button>
        )}
        {step !== 'results' && (
          <Button className="ml-auto" onClick={nextStep}>
            {step === 'compliance' ? 'View Results' : 'Next'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
