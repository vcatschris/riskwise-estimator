import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Slider } from "@/components/ui/slider"
import { CheckCheck, ShieldCheck, Network, Search, Zap, Activity, PoundSterling } from "lucide-react";

import { calculateRiskScore } from './calculateScore';
import { AssessmentData, RiskScore } from './types';
import { RiskReport } from './RiskReport';

// Updated pricing configuration
const BASE_PACKAGE_PRICING = {
  'Small': 350,  // 1-10 employees
  'Medium': 700, // 11-50 employees
  'Large': 1200  // 51+ employees
} as const;

const PER_USER_PRICING = [
  { maxUsers: 10, price: 50 },   // 1-10 users
  { maxUsers: 25, price: 45 },   // 11-25 users
  { maxUsers: 50, price: 40 },   // 26-50 users
  { maxUsers: 100, price: 35 },  // 51-100 users
  { maxUsers: Infinity, price: 30 } // 100+ users
] as const;

const REGULATED_INDUSTRIES = ['Legal', 'Finance', 'Healthcare', 'Accounting'] as const;

type FormData = AssessmentData;

const RiskAssessmentForm = () => {
  const [formData, setFormData] = useState<FormData>({
    businessSize: '1-5',
    industry: 'Other',
    sensitiveData: 'No',
    internalIT: 'No',
    cloudServices: 'No',
    lastAudit: 'Never',
    mfaEnabled: 'No',
    backupFrequency: "We don't back up data",
    endpointProtection: 'No',
    dataRegulations: 'No',
    itIssues: 'Rarely',
    responseNeeded: 'Within a few days',
  });
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const [userRange, setUserRange] = useState<number>(10);
  const [costs, setCosts] = useState({
    basePrice: 350,
    perUserPrice: 50,
    userCount: 5,
    industryMultiplier: 1
  });

  useEffect(() => {
    if (showEstimate) {
      const calculatedCosts = calculateMonthlyCost();
      setCosts(calculatedCosts);
    }
  }, [formData, showEstimate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateRiskScore(formData);
    setRiskScore(score);
    setShowResults(true);
  };

  const handlePricing = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEstimate(true);
  };

  const handleSliderChange = (value: number[]) => {
    setUserRange(value[0]);
  };

  const calculateMonthlyCost = () => {
    // Determine business size category and base price
    let businessSizeCategory;
    let userCount;
    
    switch(formData.businessSize) {
      case '1-5':
        businessSizeCategory = 'Small';
        userCount = 5;
        break;
      case '6-20':
        businessSizeCategory = 'Medium';
        userCount = 20;
        break;
      case '21-50':
        businessSizeCategory = 'Medium';
        userCount = 50;
        break;
      case '51-100':
        businessSizeCategory = 'Large';
        userCount = 100;
        break;
      case '100+':
        businessSizeCategory = 'Large';
        userCount = 150; // Assumption for calculation purposes
        break;
      default:
        businessSizeCategory = 'Small';
        userCount = 5;
    }

    const basePrice = BASE_PACKAGE_PRICING[businessSizeCategory as keyof typeof BASE_PACKAGE_PRICING];

    // Calculate per-user price based on user count
    const perUserPrice = PER_USER_PRICING.find(tier => userCount <= tier.maxUsers)?.price || 30;

    // Determine industry multiplier
    const industryMultiplier = REGULATED_INDUSTRIES.includes(formData.industry || 'Other') ? 1.25 : 1;

    // Calculate total user cost with industry multiplier
    const totalUserCost = userCount * perUserPrice * industryMultiplier;

    // Add additional factors based on form responses
    let additionalCosts = 0;
    
    // Additional security needs
    if (formData.sensitiveData === 'Yes') additionalCosts += 150;
    if (formData.mfaEnabled === 'No') additionalCosts += 100;
    if (formData.backupFrequency === 'Daily') additionalCosts += 100;
    
    // Response time pricing
    switch(formData.responseNeeded) {
      case 'Within minutes':
        additionalCosts += 500;
        break;
      case 'Within an hour':
        additionalCosts += 300;
        break;
      case 'Same day':
        additionalCosts += 200;
        break;
      case 'Within a few days':
        additionalCosts += 100;
        break;
    }

    // Return both base and per-user costs for display
    return {
      basePrice: Math.round(basePrice + additionalCosts),
      perUserPrice: Math.round(perUserPrice),
      userCount: userCount,
      industryMultiplier: industryMultiplier
    };
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">IT Resilience Assessment</CardTitle>
            <CardDescription>
              Evaluate your IT setup to identify vulnerabilities and improve your security posture.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessSize">Business Size</Label>
                <Select value={formData.businessSize} onValueChange={(value) => setFormData(prev => ({ ...prev, businessSize: value }))}>
                  <SelectTrigger id="businessSize">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-20">6-20 employees</SelectItem>
                    <SelectItem value="21-50">21-50 employees</SelectItem>
                    <SelectItem value="51-100">51-100 employees</SelectItem>
                    <SelectItem value="100+">100+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger id="industry">
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sensitiveData">Handle Sensitive Data?</Label>
                <Select value={formData.sensitiveData} onValueChange={(value) => setFormData(prev => ({ ...prev, sensitiveData: value }))}>
                  <SelectTrigger id="sensitiveData">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="internalIT">Internal IT Support?</Label>
                <Select value={formData.internalIT} onValueChange={(value) => setFormData(prev => ({ ...prev, internalIT: value }))}>
                  <SelectTrigger id="internalIT">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Some">Some</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastAudit">Last Security Audit?</Label>
                <Select value={formData.lastAudit} onValueChange={(value) => setFormData(prev => ({ ...prev, lastAudit: value }))}>
                  <SelectTrigger id="lastAudit">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Within 6 months">Within 6 months</SelectItem>
                    <SelectItem value="6-12 months ago">6-12 months ago</SelectItem>
                    <SelectItem value="Over a year ago">Over a year ago</SelectItem>
                    <SelectItem value="Never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mfaEnabled">Multi-Factor Authentication?</Label>
                <Select value={formData.mfaEnabled} onValueChange={(value) => setFormData(prev => ({ ...prev, mfaEnabled: value }))}>
                  <SelectTrigger id="mfaEnabled">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Not Sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backupFrequency">Data Backup Frequency</Label>
                <Select value={formData.backupFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, backupFrequency: value }))}>
                  <SelectTrigger id="backupFrequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="We don't back up data">We don't back up data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dataRegulations">Subject to Data Regulations?</Label>
                <Select value={formData.dataRegulations} onValueChange={(value) => setFormData(prev => ({ ...prev, dataRegulations: value }))}>
                  <SelectTrigger id="dataRegulations">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Not Sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itIssues">Frequency of IT Issues</Label>
                <Select value={formData.itIssues} onValueChange={(value) => setFormData(prev => ({ ...prev, itIssues: value }))}>
                  <SelectTrigger id="itIssues">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Occasionally">Occasionally</SelectItem>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responseNeeded">Response Time Needed</Label>
                <Select value={formData.responseNeeded} onValueChange={(value) => setFormData(prev => ({ ...prev, responseNeeded: value }))}>
                  <SelectTrigger id="responseNeeded">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Within minutes">Within minutes</SelectItem>
                    <SelectItem value="Within an hour">Within an hour</SelectItem>
                    <SelectItem value="Same day">Same day</SelectItem>
                    <SelectItem value="Within a few days">Within a few days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit}>Calculate Risk</Button>
          </CardFooter>
        </Card>
      </motion.div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mt-12"
        >
          {riskScore && <RiskReport riskScore={riskScore} />}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto mt-12"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Custom IT Investment Estimator</CardTitle>
            <CardDescription>
              Adjust the slider to reflect your business size and needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-range">Number of Users: {userRange}</Label>
              <Slider
                id="user-range"
                defaultValue={[10]}
                max={200}
                step={1}
                onValueChange={(value) => handleSliderChange(value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePricing}>
              Estimate IT Investment
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

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
                    £{costs.basePrice.toLocaleString()}/month
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ {formData.dataRegulations === 'Yes' ? 'Compliance management' : 'Basic compliance support'}</p>
                    <p>✓ {formData.sensitiveData === 'Yes' ? 'Enhanced security measures' : 'Standard security package'}</p>
                    <p>✓ {formData.backupFrequency} data backups</p>
                    <p>✓ {formData.responseNeeded} support response time</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-brand-orange">Per User Investment</h4>
                  <p className="text-3xl font-bold">
                    <span className="text-sm italic text-brand-orange">typically </span>
                    £{costs.perUserPrice.toLocaleString()}/user/month
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ User support and management</p>
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
                      £{(costs.basePrice + (costs.perUserPrice * userRange)).toLocaleString()}/month
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Annual Investment</p>
                    <p className="text-2xl font-bold text-brand-orange">
                      £{((costs.basePrice + (costs.perUserPrice * userRange)) * 12).toLocaleString()}/year
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  (Based on industry norms for {userRange} users. Actual investment varies based on business needs and specific service requirements.)
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
    </div>
  );
};

export { RiskAssessmentForm };
