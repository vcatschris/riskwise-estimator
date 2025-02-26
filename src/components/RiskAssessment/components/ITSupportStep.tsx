
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface ITSupportStepProps {
  formData: Partial<AssessmentData>;
  onInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function ITSupportStep({ formData, onInputChange }: ITSupportStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 w-full"
    >
      <Select 
        onValueChange={value => onInputChange('itSupportType', value)}
        value={formData.itSupportType}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="What kind of IT support does your business have?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="An internal expert/team">An internal expert/team</SelectItem>
          <SelectItem value="An external IT support partner">An external IT support partner</SelectItem>
          <SelectItem value="We do not have IT Support currently">We do not have IT Support currently</SelectItem>
          <SelectItem value="Not sure">Not sure what kind of IT support we have</SelectItem>
        </SelectContent>
      </Select>

      {(formData.itSupportType === 'An internal expert/team' || formData.itSupportType === 'An external IT support partner') && (
        <Select 
          onValueChange={value => onInputChange('providerDuration', value)}
          value={formData.providerDuration}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="How long have you had this IT support?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Less than 1 year">New relationship (Less than 1 year)</SelectItem>
            <SelectItem value="1-2 years">Established (1-2 years)</SelectItem>
            <SelectItem value="3-5 years">Long-term (3-5 years)</SelectItem>
            <SelectItem value="More than 5 years">Very long-term (More than 5 years)</SelectItem>
          </SelectContent>
        </Select>
      )}
    </motion.div>
  );
}
