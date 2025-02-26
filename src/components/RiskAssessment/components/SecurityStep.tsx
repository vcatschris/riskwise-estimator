
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface SecurityStepProps {
  formData: Partial<AssessmentData>;
  onInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function SecurityStep({ formData, onInputChange }: SecurityStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 w-full"
    >
      <Select 
        onValueChange={(value) => onInputChange('lastAudit', value)}
        value={formData.lastAudit}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="When was your last IT security check? (e.g., vulnerability scan)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Less than 6 months ago">Recent (within last 6 months)</SelectItem>
          <SelectItem value="6-12 months ago">Within the past year</SelectItem>
          <SelectItem value="Over a year ago">More than a year ago</SelectItem>
          <SelectItem value="Never">Never had a security assessment</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onInputChange('mfaEnabled', value)}
        value={formData.mfaEnabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Do you use two-step login? (mobile code + password)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We use extra security steps when logging in</SelectItem>
          <SelectItem value="No">No - Just username and password</SelectItem>
          <SelectItem value="Not Sure">Not sure what this means</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onInputChange('backupFrequency', value)}
        value={formData.backupFrequency}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="How often do you back up your business data?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily backups</SelectItem>
          <SelectItem value="Weekly">Weekly backups</SelectItem>
          <SelectItem value="Monthly">Monthly backups</SelectItem>
          <SelectItem value="Not Sure">Not sure about our backup schedule</SelectItem>
          <SelectItem value="We don't back up data">We don't have backups in place</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onInputChange('dataRegulations', value)}
        value={formData.dataRegulations}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Are you required to comply with specific data protection regulations?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We have specific compliance requirements</SelectItem>
          <SelectItem value="No">No - We don't have any specific requirements</SelectItem>
          <SelectItem value="Not Sure">Not sure about our compliance requirements</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
