
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface ComplianceQuestionsStepProps {
  formData: Partial<AssessmentData>;
  handleInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function ComplianceQuestionsStep({ formData, handleInputChange }: ComplianceQuestionsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Select onValueChange={(value) => handleInputChange('dataRegulations', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Do you need to follow data protection laws? (e.g., GDPR, HIPAA)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes - We must follow specific regulations</SelectItem>
          <SelectItem value="No">No - No special requirements</SelectItem>
          <SelectItem value="Not Sure">Not sure about our obligations</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('itIssues', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How often do you face IT problems? (e.g., crashes, slowness)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Very frequently (multiple times per day)</SelectItem>
          <SelectItem value="Weekly">Often (several times per week)</SelectItem>
          <SelectItem value="Occasionally">Sometimes (few times per month)</SelectItem>
          <SelectItem value="Rarely">Rarely (once every few months)</SelectItem>
          <SelectItem value="Never">Never have technical issues</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleInputChange('responseNeeded', value)}>
        <SelectTrigger>
          <SelectValue placeholder="How quickly do you need IT problems fixed?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Within minutes">Emergency response (within minutes)</SelectItem>
          <SelectItem value="Within an hour">Urgent response (within an hour)</SelectItem>
          <SelectItem value="Same day">Same business day response</SelectItem>
          <SelectItem value="Within a few days">Within 2-3 business days</SelectItem>
          <SelectItem value="No urgency">No urgent requirements</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
