
import React from 'react';
import { Button } from '@/components/ui/button';
import { Step } from '../types/step';

interface FormNavigationProps {
  step: Step;
  onPrevious: () => void;
  onNext: () => void;
}

export function FormNavigation({ step, onPrevious, onNext }: FormNavigationProps) {
  return (
    <div className="flex justify-between">
      {step !== 'provider' && (
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
      )}
      {step !== 'results' && (
        <Button className="ml-auto" onClick={onNext}>
          {step === 'compliance' ? 'View Results' : 'Next'}
        </Button>
      )}
    </div>
  );
}
