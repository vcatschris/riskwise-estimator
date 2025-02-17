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
  ArrowRight 
} from 'lucide-react';
import { FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
          <Label htmlFor="currentProvider" className="text-lg font-medium">
            I have an IT support company?
          </Label>
        </div>
      </div>

      {formData.currentProvider && (
        <Select onValueChange={(value) => handleInputChange('providerDuration', value)}>
          <SelectTrigger>
            <SelectValue placeholder="How long have they been in place?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value="3-5 years">3-5 years</SelectItem>
            <SelectItem value="More than 5 years">More than 5 years</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select onValueChange={(value) => handleInputChange('cloudProvider', value)}>
        <SelectTrigger>
          <SelectValue placeholder="What is your main cloud provider?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Microsoft">Microsoft</SelectItem>
          <SelectItem value="Google">Google</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
          <SelectItem value="Don't Know">Don't Know</SelectItem>
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
          <SelectValue placeholder="Select industry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Accounting">Accounting</SelectItem>
          <SelectItem value="Legal">Legal</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="Retail">Retail</SelectItem>
          <SelectItem value="Healthcare">Healthcare</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('businessSize', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Business size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-5">1-5 employees</SelectItem>
          <SelectItem value="6-20">6-20 employees</SelectItem>
          <SelectItem value="21-50">21-50 employees</SelectItem>
          <SelectItem value="51-100">51-100 employees</SelectItem>
          <SelectItem value="100+">100+ employees</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('sensitiveData', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you handle sensitive data?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
          <SelectItem value="Not Sure">Not Sure</SelectItem>
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
          <SelectValue placeholder="Last security audit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Less than 6 months ago">Less than 6 months ago</SelectItem>
          <SelectItem value="6-12 months ago">6-12 months ago</SelectItem>
          <SelectItem value="Over a year ago">Over a year ago</SelectItem>
          <SelectItem value="Never">Never</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('mfaEnabled', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Multi-factor authentication" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
          <SelectItem value="Not Sure">Not Sure</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('backupFrequency', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Backup frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily</SelectItem>
          <SelectItem value="Weekly">Weekly</SelectItem>
          <SelectItem value="Monthly">Monthly</SelectItem>
          <SelectItem value="Not Sure">Not Sure</SelectItem>
          <SelectItem value="We don't back up data">We don't back up data</SelectItem>
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
          <SelectValue placeholder="Data regulations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
          <SelectItem value="Not Sure">Not Sure</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('itIssues', value)}>
        <SelectTrigger>
          <SelectValue placeholder="IT issue frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily</SelectItem>
          <SelectItem value="Weekly">Weekly</SelectItem>
          <SelectItem value="Occasionally">Occasionally</SelectItem>
          <SelectItem value="Rarely">Rarely</SelectItem>
          <SelectItem value="Never">Never</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('responseNeeded', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Required response time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Within minutes">Within minutes</SelectItem>
          <SelectItem value="Within an hour">Within an hour</SelectItem>
          <SelectItem value="Same day">Same day</SelectItem>
          <SelectItem value="Within a few days">Within a few days</SelectItem>
          <SelectItem value="No urgency">No urgency</SelectItem>
        </SelectContent>
      </Select>
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
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          Industry-Specific Considerations
                        </h4>
                        <ul className="space-y-2">
                          {detail.insights.industrySpecific.map((insight, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                              <span className="mt-1">💡</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          Size-Specific Considerations
                        </h4>
                        <ul className="space-y-2">
                          {detail.insights.sizeSpecific.map((insight, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                              <span className="mt-1">📊</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {detail.recommendations.length > 0 && (
                      <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-700 dark:text-red-300">
                          <Lightbulb className="h-4 w-4" />
                          Critical Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {detail.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                              <span className="mt-1">⚠️</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full mt-8"
            variant="outline"
            size="lg"
          >
            Start New Assessment
          </Button>
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
