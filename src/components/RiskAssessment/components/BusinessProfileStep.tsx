
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
      className="space-y-4"
    >
      <Select onValueChange={(value) => onInputChange('industry', value)}>
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

      <Select onValueChange={(value) => onInputChange('businessSize', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How many employees need IT support?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-5">Small Team (1-5 users)</SelectItem>
          <SelectItem value="6-20">Growing Business (6-20 users)</SelectItem>
          <SelectItem value="21-50">Mid-sized (21-50 users)</SelectItem>
          <SelectItem value="51-100">Large Organisation (51-100 users)</SelectItem>
          <SelectItem value="100+">Enterprise (100+ users)</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onInputChange('sensitiveData', value)}>
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
}
