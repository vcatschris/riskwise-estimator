
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface BusinessProfileStepProps {
  formData: Partial<AssessmentData>;
  onInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function BusinessProfileStep({ formData, onInputChange }: BusinessProfileStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 w-full"
    >
      <Select 
        onValueChange={(value) => onInputChange('industry', value)}
        value={formData.industry}
      >
        <SelectTrigger className="w-full">
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

      <Select 
        onValueChange={(value) => onInputChange('businessSize', value)}
        value={formData.businessSize}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="How many employees use IT as a core part of their role?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-5">Small Team (1-5 users)</SelectItem>
          <SelectItem value="6-20">Growing Business (6-20 users)</SelectItem>
          <SelectItem value="21-50">Mid-sized (21-50 users)</SelectItem>
          <SelectItem value="51-100">Large Organisation (51-100 users)</SelectItem>
          <SelectItem value="100+">Enterprise (100+ users)</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onInputChange('sensitiveData', value)}
        value={formData.sensitiveData}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Do you handle sensitive information? (customer data, financial records, etc.)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We handle confidential data (needs protection)</SelectItem>
          <SelectItem value="No">No - We don't handle sensitive information</SelectItem>
          <SelectItem value="Not Sure">Not sure what counts as sensitive data</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onInputChange('workLocation', value)}
        value={formData.workLocation}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="How many locations do your staff work from, and do they routinely work from home?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Single site, no remote working">Single site, no remote working</SelectItem>
          <SelectItem value="Multiple sites, no remote working">Multiple sites, no remote working</SelectItem>
          <SelectItem value="Single site, with remote working">Single site, with remote working</SelectItem>
          <SelectItem value="Multiple sites, with remote working">Multiple sites, with remote working</SelectItem>
          <SelectItem value="Fully remote workforce">Fully remote workforce</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
