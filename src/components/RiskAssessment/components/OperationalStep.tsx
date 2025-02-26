
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../types';

interface OperationalStepProps {
  formData: Partial<AssessmentData>;
  onInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function OperationalStep({ formData, onInputChange }: OperationalStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 w-full"
    >
      <Select 
        onValueChange={(value) => onInputChange('itIssues', value)}
        value={formData.itIssues}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="How often do you experience IT issues that affect productivity?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily disruptions</SelectItem>
          <SelectItem value="Weekly">Weekly issues</SelectItem>
          <SelectItem value="Occasionally">Occasional problems</SelectItem>
          <SelectItem value="Rarely">Rare issues</SelectItem>
          <SelectItem value="Never">Never experience issues</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onInputChange('itCriticality', value)}
        value={formData.itCriticality}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="How critical is IT to your day-to-day operations?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="IT downtime causes immediate operational issues">
            IT downtime causes immediate operational issues
          </SelectItem>
          <SelectItem value="IT downtime impacts productivity but not critical operations">
            IT downtime impacts productivity but not critical operations
          </SelectItem>
          <SelectItem value="IT downtime is a minor inconvenience">
            IT downtime is a minor inconvenience
          </SelectItem>
          <SelectItem value="IT is not critical to daily operations">
            IT is not critical to daily operations
          </SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
