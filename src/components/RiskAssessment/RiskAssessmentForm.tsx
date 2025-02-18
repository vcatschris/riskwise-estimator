import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Network,
  Search,
  Zap,
  Activity,
  CheckCheck,
  Calculator,
  PoundSterling,
} from "lucide-react";
import {
  AssessmentData,
  BusinessSize,
  Industry,
  ITSupport,
  TimePeriod,
  BackupFrequency,
  DisruptionFrequency,
  ResponseTime,
  YesNoNotSure,
  CloudProvider,
  SupportDuration,
} from "./types";
import { calculateRiskScore } from "./calculateScore";
import { calculatePricing } from './calculatePricing';

const RiskAssessmentForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    newsletter: true,
  });
  const [showResults, setShowResults] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Input
              type="checkbox"
              id="newsletter"
              name="newsletter"
              checked={formData.newsletter === true}
              onChange={handleChange}
            />
            <Label htmlFor="newsletter">
              Sign up for our newsletter to receive industry insights
            </Label>
          </div>
        </div>

        {/* IT Provider Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentProvider">Do you have a current IT provider?</Label>
            <Select
              name="currentProvider"
              value={formData.currentProvider?.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, currentProvider: value === 'true' }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.currentProvider === true && (
            <div>
              <Label htmlFor="providerDuration">
                How long have you had your current provider?
              </Label>
              <Select
                name="providerDuration"
                value={formData.providerDuration || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, providerDuration: value as SupportDuration }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
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
        </div>

        <div>
          <Label htmlFor="cloudProvider">
            Which cloud provider do you primarily use?
          </Label>
          <Select
            name="cloudProvider"
            value={formData.cloudProvider || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, cloudProvider: value as CloudProvider }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Microsoft">Microsoft</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Don't Know">Don't Know</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Business Profile */}
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select
            name="industry"
            value={formData.industry || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, industry: value as Industry }))
            }
          >
            <SelectTrigger className="w-full">
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

        <div>
          <Label htmlFor="businessSize">Business Size (Number of Employees)</Label>
          <Select
            name="businessSize"
            value={formData.businessSize || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, businessSize: value as BusinessSize }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5</SelectItem>
              <SelectItem value="6-20">6-20</SelectItem>
              <SelectItem value="21-50">21-50</SelectItem>
              <SelectItem value="51-100">51-100</SelectItem>
              <SelectItem value="100+">100+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sensitiveData">
            Do you handle sensitive client or customer data?
          </Label>
          <Select
            name="sensitiveData"
            value={formData.sensitiveData || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, sensitiveData: value as YesNoNotSure }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="internalIT">Do you have internal IT support?</Label>
          <Select
            name="internalIT"
            value={formData.internalIT || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, internalIT: value as ITSupport }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="We outsource IT">We outsource IT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="cloudServices">
            Do you use cloud-based services (e.g., Google Workspace, Microsoft 365)?
          </Label>
          <Select
            name="cloudServices"
            value={formData.cloudServices || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, cloudServices: value as YesNoNotSure }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Security Questions */}
        <div>
          <Label htmlFor="lastAudit">When was your last IT security audit?</Label>
          <Select
            name="lastAudit"
            value={formData.lastAudit || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, lastAudit: value as TimePeriod }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Less than 6 months ago">
                Less than 6 months ago
              </SelectItem>
              <SelectItem value="6-12 months ago">6-12 months ago</SelectItem>
              <SelectItem value="Over a year ago">Over a year ago</SelectItem>
              <SelectItem value="Never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mfaEnabled">
            Is multi-factor authentication (MFA) enabled for most users?
          </Label>
          <Select
            name="mfaEnabled"
            value={formData.mfaEnabled || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, mfaEnabled: value as YesNoNotSure }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="backupFrequency">How often do you back up your data?</Label>
          <Select
            name="backupFrequency"
            value={formData.backupFrequency || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, backupFrequency: value as BackupFrequency }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
              <SelectItem value="We don't back up data">We don't back up data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="endpointProtection">
            Do you have endpoint protection (antivirus) on all devices?
          </Label>
          <Select
            name="endpointProtection"
            value={formData.endpointProtection || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, endpointProtection: value as YesNoNotSure }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phishingAttempt">
            Have you conducted phishing simulation attempts for your employees?
          </Label>
          <Select
            name="phishingAttempt"
            value={formData.phishingAttempt || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, phishingAttempt: value as YesNoNotSure }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Compliance and Support */}
        <div>
          <Label htmlFor="dataRegulations">
            Are you subject to specific data protection regulations (e.g., GDPR, HIPAA)?
          </Label>
          <Select
            name="dataRegulations"
            value={formData.dataRegulations || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, dataRegulations: value as YesNoNotSure }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not Sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="itIssues">
            How frequently do you experience IT-related issues or downtime?
          </Label>
          <Select
            name="itIssues"
            value={formData.itIssues || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, itIssues: value as DisruptionFrequency }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Occasionally">Occasionally</SelectItem>
              <SelectItem value="Rarely">Rarely</SelectItem>
              <SelectItem value="Never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="responseNeeded">
            How quickly do you need IT support to respond to critical issues?
          </Label>
          <Select
            name="responseNeeded"
            value={formData.responseNeeded || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, responseNeeded: value as ResponseTime }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select response time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Within minutes">Within minutes</SelectItem>
              <SelectItem value="Within an hour">Within an hour</SelectItem>
              <SelectItem value="Same day">Same day</SelectItem>
              <SelectItem value="Within a few days">Within a few days</SelectItem>
              <SelectItem value="No urgency">No urgency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Evaluate My Resilience
        </Button>
      </form>
    );
  };

  const renderResults = () => {
    const assessment = calculateRiskScore(formData as AssessmentData);
    const pricing = calculatePricing(formData as AssessmentData);

    return (
      <div className="space-y-8">
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
          <div id="cost-estimate" className="my-12 scroll-mt-8">
            <Card>
              <CardHeader className="space-y-1 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <PoundSterling className="w-6 h-6 text-brand-orange" />
                  💡 Industry Benchmark: Monthly IT Investment (£)
                </CardTitle>
                <CardDescription>
                  Based on businesses of similar size, sector and needs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-brand-orange">Base Package Investment</h4>
                    <p className="text-3xl font-bold">
                      <span className="text-sm italic text-brand-orange">from </span> 
                      £{pricing.basePrice.toLocaleString()}/month
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
                      £{pricing.perUserPrice.toLocaleString()}/user/month
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
                        £{pricing.monthlyTotal.toLocaleString()}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Annual Investment</p>
                      <p className="text-2xl font-bold text-brand-orange">
                        £{pricing.annualTotal.toLocaleString()}/year
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    (Based on industry norms for {pricing.userCount} users. Actual investment varies based on business needs and specific service requirements.)
                  </p>
                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-medium">📞 Want a clearer picture of how your IT setup compares?</p>
                    <p className="text-sm text-brand-orange">
                      🔹 Book a Free IT Review to see if your current investment aligns with industry best practices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
            <CardDescription>
              Here's a summary of your IT resilience assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Risk Level</h3>
                <p>Your risk level is: {assessment.level}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Key Insights</h3>
                <ul>
                  {assessment.executiveSummary.topRisks.map((risk, index) => (
                    <li key={index} className="list-disc ml-5">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <ul>
                {assessment.executiveSummary.recommendations.map(
                  (recommendation, index) => (
                    <li key={index} className="list-disc ml-5">
                      {recommendation}
                    </li>
                  }
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!showResults ? renderForm() : renderResults()}
    </div>
  );
};

export default RiskAssessmentForm;
