
import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
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
      <div className="rounded-lg border p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="currentProvider"
            checked={formData.currentProvider}
            onCheckedChange={checked => onInputChange('currentProvider', checked)}
            className="h-5 w-5"
          />
          <Label htmlFor="currentProvider" className="text-lg font-medium">
            We currently have IT support (internal team or external provider)
          </Label>
        </div>
      </div>

      {formData.currentProvider && (
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
