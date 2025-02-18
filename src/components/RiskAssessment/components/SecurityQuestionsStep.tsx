
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface SecurityQuestionsStepProps {
  formData: Partial<AssessmentData>;
  handleInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function SecurityQuestionsStep({ formData, handleInputChange }: SecurityQuestionsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Select onValueChange={(value) => handleInputChange('lastAudit', value)}>
        <SelectTrigger>
          <SelectValue placeholder="When was your last IT security check? (e.g., vulnerability scan)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Less than 6 months ago">Recent (within last 6 months)</SelectItem>
          <SelectItem value="6-12 months ago">Within the past year</SelectItem>
          <SelectItem value="Over a year ago">More than a year ago</SelectItem>
          <SelectItem value="Never">Never had a security assessment</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('mfaEnabled', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you use two-step login? (mobile code + password)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We use extra security steps when logging in</SelectItem>
          <SelectItem value="No">No - Just username and password</SelectItem>
          <SelectItem value="Not Sure">Not sure what this means</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('backupFrequency', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How often do you back up your business data?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily backups (recommended)</SelectItem>
          <SelectItem value="Weekly">Weekly backups</SelectItem>
          <SelectItem value="Monthly">Monthly backups</SelectItem>
          <SelectItem value="Not Sure">Not sure about our backup schedule</SelectItem>
          <SelectItem value="We don't back up data">We don't have backups in place</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
