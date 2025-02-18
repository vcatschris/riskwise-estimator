
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AssessmentData } from '../types';

interface ContactInfoStepProps {
  formData: Partial<AssessmentData>;
  handleInputChange: (field: keyof AssessmentData, value: string | boolean) => void;
}

export function ContactInfoStep({ formData, handleInputChange }: ContactInfoStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name (main point of contact)</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Business Email (for your IT assessment report)</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your work email (e.g., name@company.com)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Company or Organization Name</Label>
        <Input
          id="businessName"
          value={formData.businessName || ''}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Your company's legal or trading name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={formData.newsletter}
          onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
        />
        <Label htmlFor="newsletter">Receive monthly security tips & IT best practices newsletter</Label>
      </div>
    </motion.div>
  );
}
