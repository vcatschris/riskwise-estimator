import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, PoundSterling } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { calculateRiskScore } from "./calculateScore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Define cost structure based on business size and industry
const COST_CONFIGURATION = {
  Small: {
    basePrice: 299,
    perUserPrice: 45
  },
  Medium: {
    basePrice: 499,
    perUserPrice: 40
  },
  Large: {
    basePrice: 799,
    perUserPrice: 35
  }
};

// Industry multipliers for specialized needs
const INDUSTRY_MULTIPLIERS = {
  Legal: 1.2,      // Higher due to compliance and security needs
  Finance: 1.25,   // Highest due to regulatory requirements
  Healthcare: 1.15,// Higher due to data protection needs
  Retail: 1.0,     // Standard pricing
  Accounting: 1.15,// Higher due to financial data handling
  Other: 1.0       // Standard pricing
};

export function RiskAssessmentForm() {
  const [showEstimate, setShowEstimate] = useState(false);
  const [formData, setFormData] = useState({
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
    responseNeeded: 'Not urgent',
  });
  const [riskScore, setRiskScore] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(riskScore?.executiveSummary, null, 2));
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The executive summary has been copied to your clipboard.",
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    })
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = calculateRiskScore(formData);
    setRiskScore(score);
    setShowEstimate(true);
  };

  // Determine business size category based on user range
  const userRange = parseInt(formData.businessSize.split('-')[1]); // This should be dynamically set based on businessSize selection
  const businessSizeCategory = 
    userRange <= 5 ? 'Small' :
    userRange <= 50 ? 'Medium' : 'Large';

  // Calculate costs based on business size and industry
  const baseCosts = COST_CONFIGURATION[businessSizeCategory];
  const industryMultiplier = INDUSTRY_MULTIPLIERS[formData.industry || 'Other'];
  
  const costs = {
    basePrice: Math.round(baseCosts.basePrice * industryMultiplier),
    perUserPrice: Math.round(baseCosts.perUserPrice * industryMultiplier)
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Evaluate your IT setup</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="businessSize">Number of Employees</Label>
              <Select name="businessSize" value={formData.businessSize} onValueChange={(value) => setFormData(prev => ({ ...prev, businessSize: value }))}>
                <SelectTrigger id="businessSize">
                  <SelectValue placeholder="Select" />
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
              <Label htmlFor="industry">Industry</Label>
              <Select name="industry" value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select" />
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
              <Label htmlFor="sensitiveData">Handle Sensitive Data?</Label>
              <Select name="sensitiveData" value={formData.sensitiveData} onValueChange={(value) => setFormData(prev => ({ ...prev, sensitiveData: value }))}>
                <SelectTrigger id="sensitiveData">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="internalIT">Internal IT Support?</Label>
              <Select name="internalIT" value={formData.internalIT} onValueChange={(value) => setFormData(prev => ({ ...prev, internalIT: value }))}>
                <SelectTrigger id="internalIT">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Outsourced">Outsourced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cloudServices">Use Cloud Services?</Label>
              <Select name="cloudServices" value={formData.cloudServices} onValueChange={(value) => setFormData(prev => ({ ...prev, cloudServices: value }))}>
                <SelectTrigger id="cloudServices">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lastAudit">Last Security Audit?</Label>
              <Select name="lastAudit" value={formData.lastAudit} onValueChange={(value) => setFormData(prev => ({ ...prev, lastAudit: value }))}>
                <SelectTrigger id="lastAudit">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Over a year ago">Over a year ago</SelectItem>
                  <SelectItem value="6-12 months ago">6-12 months ago</SelectItem>
                  <SelectItem value="Within the last 6 months">Within the last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mfaEnabled">Multi-Factor Authentication?</Label>
              <Select name="mfaEnabled" value={formData.mfaEnabled} onValueChange={(value) => setFormData(prev => ({ ...prev, mfaEnabled: value }))}>
                <SelectTrigger id="mfaEnabled">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Not Sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select name="backupFrequency" value={formData.backupFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, backupFrequency: value }))}>
                <SelectTrigger id="backupFrequency">
                  <SelectValue placeholder="Select" />
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
              <Label htmlFor="endpointProtection">Endpoint Protection?</Label>
              <Select name="endpointProtection" value={formData.endpointProtection} onValueChange={(value) => setFormData(prev => ({ ...prev, endpointProtection: value }))}>
                <SelectTrigger id="endpointProtection">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Not Sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataRegulations">Subject to Data Regulations?</Label>
              <Select name="dataRegulations" value={formData.dataRegulations} onValueChange={(value) => setFormData(prev => ({ ...prev, dataRegulations: value }))}>
                <SelectTrigger id="dataRegulations">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Not Sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="itIssues">Frequency of IT Issues</Label>
              <Select name="itIssues" value={formData.itIssues} onValueChange={(value) => setFormData(prev => ({ ...prev, itIssues: value }))}>
                <SelectTrigger id="itIssues">
                  <SelectValue placeholder="Select" />
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
              <Select name="responseNeeded" value={formData.responseNeeded} onValueChange={(value) => setFormData(prev => ({ ...prev, responseNeeded: value }))}>
                <SelectTrigger id="responseNeeded">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Within minutes">Within minutes</SelectItem>
                  <SelectItem value="Within an hour">Within an hour</SelectItem>
                  <SelectItem value="Same day">Same day</SelectItem>
                  <SelectItem value="Not urgent">Not urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Calculate Risk</Button>
          </form>
        </CardContent>
      </Card>

      {showEstimate && riskScore && (
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Result</CardTitle>
              <CardDescription>
                Here's your risk assessment summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Executive Summary</h3>
              </div>

              <div className="mb-4">
                <p>
                  <strong>Risk Level:</strong> {riskScore.level}
                </p>
                <p>
                  <strong>Total Risk Score:</strong> {riskScore.total} / {riskScore.maxPossible}
                </p>
                <p>
                  <strong>Value Score:</strong> {riskScore.valueScore} / {riskScore.maxValuePossible}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold">Top Risks:</h4>
                <ul className="list-disc pl-5">
                  {riskScore.executiveSummary.topRisks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold">Recommendations:</h4>
                <ul className="list-disc pl-5">
                  {riskScore.executiveSummary.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold">Value Proposition:</h4>
                <ul className="list-disc pl-5">
                  {riskScore.executiveSummary.valueProposition.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold">Industry Insights:</h4>
                <ul className="list-disc pl-5">
                  {riskScore.executiveSummary.industryInsights.risks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold">Industry Values:</h4>
                <ul className="list-disc pl-5">
                  {riskScore.executiveSummary.industryInsights.values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <PoundSterling className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Pricing Estimate</h3>
              </div>

              <div className="mb-4">
                <p>
                  <strong>Base Price:</strong> £{costs.basePrice}
                </p>
                <p>
                  <strong>Per User Price:</strong> £{costs.perUserPrice}
                </p>
                <p>
                  <strong>Number of Users:</strong> {userRange}+
                </p>
                <p>
                  <strong>Business Size:</strong> {businessSizeCategory}
                </p>
                <p>
                  <strong>Industry:</strong> {formData.industry}
                </p>
                <p className="font-bold">
                  <strong>Estimated Monthly Cost:</strong> £{costs.basePrice + (costs.perUserPrice * userRange)}
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setShowDetails(true)}>
                  View Details
                </Button>
                <Button variant="outline" onClick={handleCopy} disabled={copied}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Summary
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assessment Details</AlertDialogTitle>
            <AlertDialogDescription>
              Detailed breakdown of the risk assessment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-4">
                {riskScore?.details.map((detail, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-lg font-semibold">{detail.category}</h4>
                    <p><strong>Risk Score:</strong> {detail.riskScore}</p>
                    <p><strong>Value Score:</strong> {detail.valueScore}</p>
                    <div>
                      <strong>Insights:</strong>
                      <p>{detail.insights.description}</p>
                      <p><strong>Industry Specific:</strong></p>
                      <ul className="list-disc pl-5">
                        {detail.insights.industrySpecific.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                      <p><strong>Size Specific:</strong></p>
                      {Array.isArray(detail.insights.sizeSpecific) ? (
                        <ul className="list-disc pl-5">
                          {detail.insights.sizeSpecific.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{detail.insights.sizeSpecific}</p>
                      )}
                    </div>
                    <div>
                      <strong>Recommendations:</strong>
                      <ul className="list-disc pl-5">
                        {detail.recommendations.map((recommendation, i) => (
                          <li key={i}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Risk Areas:</strong>
                      <ul className="list-disc pl-5">
                        {detail.riskAreas.map((riskArea, i) => (
                          <li key={i}>{riskArea}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Value Areas:</strong>
                      <ul className="list-disc pl-5">
                        {detail.valueAreas.map((valueArea, i) => (
                          <li key={i}>{valueArea}</li>
                        ))}
                      </ul>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDetails(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
