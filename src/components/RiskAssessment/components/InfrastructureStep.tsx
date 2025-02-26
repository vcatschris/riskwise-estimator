
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface InfrastructureStepProps {
  formData: Partial<AssessmentData>;
  onInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function InfrastructureStep({ formData, onInputChange }: InfrastructureStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 w-full"
    >
      <Select 
        onValueChange={(value) => onInputChange('infrastructure', value)}
        value={formData.infrastructure}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="What best describes your IT infrastructure?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Cloud-based systems">Cloud-based systems</SelectItem>
          <SelectItem value="Internal servers">Internal servers</SelectItem>
          <SelectItem value="Extensive IT network">Extensive IT network</SelectItem>
          <SelectItem value="Mixed environment">Mixed environment</SelectItem>
          <SelectItem value="Not sure">Not sure</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={value => onInputChange('cloudProvider', value)}
        value={formData.cloudProvider}
      >
        <SelectTrigger className="w-full">
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
}
