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
        title: "Your IT Resilience Score",
        description: "Based on industry standards and best practices for your business profile"
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
      <div className="rounded-lg border bg-secondary/50 p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="currentProvider"
            checked={formData.currentProvider}
            onCheckedChange={(checked) => handleInputChange('currentProvider', checked)}
            className="h-5 w-5"
          />
          <Label htmlFor="currentProvider" className="text-lg font-medium">
            Do you have an IT support company?
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
        ? 'text-risk-low'
        : assessment.level === 'Medium'
        ? 'text-risk-medium'
        : 'text-risk-high';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold">Risk Assessment Results</h3>
          <p className={`text-4xl font-bold mt-4 ${riskColor}`}>{assessment.level} Risk</p>
          <p className="text-lg mt-2">Risk Score: {assessment.total} / {assessment.maxPossible}</p>
          <p className="text-lg mt-1">Value Score: {assessment.valueScore} / {assessment.maxValuePossible}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
            <CardDescription>Based on your {formData.industry} industry profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Key Industry Risks:</h4>
              <ul className="list-disc pl-6 space-y-1">
                {assessment.executiveSummary.industryInsights.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Your Top Risks:</h4>
              <ul className="list-disc pl-6 space-y-1">
                {assessment.executiveSummary.topRisks.map((risk, i) => (
                  <li key={i} className="text-risk-high">{risk}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Value of Managed IT Services:</h4>
              <ul className="list-disc pl-6 space-y-1">
                {assessment.executiveSummary.industryInsights.values.map((value, i) => (
                  <li key={i} className="text-risk-low">✓ {value}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {assessment.details.map((detail, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{detail.category}</CardTitle>
                <CardDescription>
                  Risk Score: {detail.riskScore} | Value Score: {detail.valueScore}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {detail.insights.description}
                  </p>
                  
                  <h4 className="font-semibold mt-4 mb-2">Industry-Specific Considerations:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {detail.insights.industrySpecific.map((insight, i) => (
                      <li key={i} className="text-sm">{insight}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold mt-4 mb-2">Size-Specific Considerations:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {detail.insights.sizeSpecific.map((insight, i) => (
                      <li key={i} className="text-sm">{insight}</li>
                    ))}
                  </ul>

                  {detail.recommendations.length > 0 && (
                    <>
                      <h4 className="font-semibold mt-4 mb-2">Recommendations:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {detail.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-risk-high">{rec}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="w-full mt-6"
          variant="secondary"
        >
          Start New Assessment
        </Button>
      </motion.div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
