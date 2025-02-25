
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface ProviderStepProps {
  formData: Partial<AssessmentData>;
  onInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export const ProviderStep: React.FC<ProviderStepProps> = ({ formData, onInputChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Select onValueChange={value => onInputChange('itSupportType', value)}>
        <SelectTrigger>
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
        <Select onValueChange={value => onInputChange('providerDuration', value)}>
          <SelectTrigger>
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

      <Select onValueChange={value => onInputChange('cloudProvider', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Which platform do you use for email & documents?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Microsoft">Microsoft 365 (formerly Office 365)</SelectItem>
          <SelectItem value="Google">Google Workspace (formerly G Suite)</SelectItem>
          <SelectItem value="Other">Another provider or on-premise system</SelectItem>
          <SelectItem value="Don't Know">Not sure which system we use</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};
