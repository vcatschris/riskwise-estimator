import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentData } from './types';
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
import { Progress } from '@/components/ui/progress';

type Step = 'profile' | 'security' | 'compliance' | 'results';

export function RiskAssessmentForm() {
  const [step, setStep] = useState<Step>('profile');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({});

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (step === 'profile') {
      setStep('security');
      setProgress(33);
    } else if (step === 'security') {
      setStep('compliance');
      setProgress(66);
    } else if (step === 'compliance') {
      setStep('results');
      setProgress(100);
    }
  };

  const previousStep = () => {
    if (step === 'security') {
      setStep('profile');
      setProgress(0);
    } else if (step === 'compliance') {
      setStep('security');
      setProgress(33);
    } else if (step === 'results') {
      setStep('compliance');
      setProgress(66);
    }
  };

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
          <p className="text-lg mt-2">Risk Score: {assessment.total}</p>
          <p className="text-lg mt-1">Value Score: {assessment.valueScore}</p>
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
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {detail.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
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
        <CardTitle>IT Risk Assessment</CardTitle>
        <CardDescription>
          Evaluate your business's IT security and get personalized recommendations
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {step === 'profile' && renderBusinessProfile()}
        {step === 'security' && renderSecurityQuestions()}
        {step === 'compliance' && renderComplianceQuestions()}
        {step === 'results' && renderResults()}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== 'profile' && (
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
