
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calculator, PoundSterling } from "lucide-react";
import { AssessmentData, BusinessSize, Industry, ITSupport, TimePeriod, BackupFrequency, DisruptionFrequency, ResponseTime, YesNoNotSure, CloudProvider, SupportDuration } from './types';
import { calculateRiskScore } from './calculateScore';
import { calculatePricing } from './calculatePricing';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  businessName: z.string().min(2, {
    message: 'Business name must be at least 2 characters.',
  }),
  newsletter: z.boolean().default(false),
  currentProvider: z.boolean().default(false),
  providerDuration: z.enum(['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years', 'No current provider']),
  cloudProvider: z.enum(['Microsoft', 'Google', 'Other', "Don't Know"]),
  industry: z.enum(['Accounting', 'Legal', 'Finance', 'Retail', 'Healthcare', 'Other']),
  businessSize: z.enum(['1-5', '6-20', '21-50', '51-100', '100+']),
  sensitiveData: z.enum(['Yes', 'No', 'Not Sure']),
  internalIT: z.enum(['Yes', 'No', 'We outsource IT']),
  cloudServices: z.enum(['Yes', 'No', 'Not Sure']),
  lastAudit: z.enum(['Less than 6 months ago', '6-12 months ago', 'Over a year ago', 'Never']),
  mfaEnabled: z.enum(['Yes', 'No', 'Not Sure']),
  backupFrequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Not Sure', "We don't back up data"]),
  endpointProtection: z.enum(['Yes', 'No', 'Not Sure']),
  phishingAttempt: z.enum(['Yes', 'No', 'Not Sure']),
  dataRegulations: z.enum(['Yes', 'No', 'Not Sure']),
  itIssues: z.enum(['Daily', 'Weekly', 'Occasionally', 'Rarely', 'Never']),
  responseNeeded: z.enum(['Within minutes', 'Within an hour', 'Same day', 'Within a few days', 'No urgency']),
});

export const RiskAssessmentForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      businessName: '',
      newsletter: false,
      currentProvider: false,
      providerDuration: 'No current provider',
      cloudProvider: "Don't Know",
      industry: 'Other',
      businessSize: '1-5',
      sensitiveData: 'No',
      internalIT: 'No',
      cloudServices: 'No',
      lastAudit: 'Never',
      mfaEnabled: 'No',
      backupFrequency: "We don't back up data",
      endpointProtection: 'No',
      phishingAttempt: 'No',
      dataRegulations: 'No',
      itIssues: 'Never',
      responseNeeded: 'No urgency',
    },
  });

  const [showResults, setShowResults] = React.useState(false);
  const [formData, setFormData] = React.useState<z.infer<typeof formSchema> | null>(null);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (values) => {
    setFormData(values);
    setShowResults(true);
  };

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Enter your contact details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">
                      Subscribe to newsletter?
                    </FormLabel>
                    <CardDescription>
                      Receive updates and special offers.
                    </CardDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IT Provider Information</CardTitle>
            <CardDescription>
              Tell us about your current IT support.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="currentProvider"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">
                      Do you have a current IT support provider?
                    </FormLabel>
                    <CardDescription>
                      Indicate if you have an existing IT support arrangement.
                    </CardDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.getValues('currentProvider') && (
              <>
                <FormField
                  control={form.control}
                  name="providerDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long have you had your current provider?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                          <SelectItem value="1-3 years">1-3 years</SelectItem>
                          <SelectItem value="3-5 years">3-5 years</SelectItem>
                          <SelectItem value="More than 5 years">More than 5 years</SelectItem>
                          <SelectItem value="No current provider">No current provider</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cloudProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which cloud provider do you primarily use?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Microsoft">Microsoft</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Don't Know">Don't Know</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>
              Tell us about your business so we can tailor the assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Accounting">Accounting</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-5">1-5</SelectItem>
                      <SelectItem value="6-20">6-20</SelectItem>
                      <SelectItem value="21-50">21-50</SelectItem>
                      <SelectItem value="51-100">51-100</SelectItem>
                      <SelectItem value="100+">100+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sensitiveData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you handle sensitive client or patient data?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internalIT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have internal IT support?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="We outsource IT">We outsource IT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cloudServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you use cloud services (e.g., file storage, email)?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Practices</CardTitle>
            <CardDescription>
              Assess your current security measures.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="lastAudit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When was your last IT security audit?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Less than 6 months ago">Less than 6 months ago</SelectItem>
                      <SelectItem value="6-12 months ago">6-12 months ago</SelectItem>
                      <SelectItem value="Over a year ago">Over a year ago</SelectItem>
                      <SelectItem value="Never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mfaEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is multi-factor authentication (MFA) enabled?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backupFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How often do you back up your data?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                      <SelectItem value="We don't back up data">We don't back up data</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpointProtection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you use endpoint protection (antivirus) on all devices?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phishingAttempt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Have you conducted phishing attempt simulations for staff?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance and Support</CardTitle>
            <CardDescription>
              Assess your compliance and support needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="dataRegulations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Are you subject to data regulations like GDPR or HIPAA?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itIssues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How frequently do you experience IT issues or disruptions?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Occasionally">Occasionally</SelectItem>
                      <SelectItem value="Rarely">Rarely</SelectItem>
                      <SelectItem value="Never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responseNeeded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What response time do you need for critical IT issues?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Within minutes">Within minutes</SelectItem>
                      <SelectItem value="Within an hour">Within an hour</SelectItem>
                      <SelectItem value="Same day">Same day</SelectItem>
                      <SelectItem value="Within a few days">Within a few days</SelectItem>
                      <SelectItem value="No urgency">No urgency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit">Submit Assessment</Button>
      </form>
    </Form>
  );

  const renderResults = () => {
    const assessment = calculateRiskScore(formData as AssessmentData);
    const pricing = calculatePricing(formData as AssessmentData);

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Risk Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Risk Level</h3>
                <p>Your overall risk level is: <span className="font-bold">{assessment.level}</span></p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Risk Score</h3>
                <p>You scored {assessment.total} out of a possible {assessment.maxPossible}.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Value Score</h3>
                <p>Your value score is {assessment.valueScore} out of {assessment.maxValuePossible}.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Top Risks</h3>
              <ul className="list-disc pl-5">
                {assessment.executiveSummary.topRisks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <ul className="list-disc pl-5">
                {assessment.executiveSummary.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="w-5 h-5" />
              Estimated Monthly IT Support Investment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Base Price:</span>
                <span>£{pricing.basePrice.toLocaleString()}</span>
              </div>
              
              {pricing.adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                  <span>{adjustment.description}:</span>
                  <span>+£{Math.round(adjustment.amount).toLocaleString()}</span>
                </div>
              ))}
              
              <div className="pt-4 border-t flex justify-between items-center text-xl font-bold">
                <span>Total Monthly Investment:</span>
                <span>£{Math.round(pricing.finalPrice).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 bg-secondary/50 p-4 rounded-lg text-sm">
              <p>This estimate is based on your business profile and requirements. The final price may vary based on specific needs and customizations. Contact us for a detailed quote.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full">
      {showResults ? (
        <div>
          {renderResults()}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-4">Take Assessment Again</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset the form and clear your current assessment results.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setShowResults(false)}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        renderForm()
      )}
    </div>
  );
};
