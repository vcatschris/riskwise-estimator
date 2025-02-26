
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
    <div className="flex justify-between w-full">
      <div>
        {step !== 'business' && (
          <Button variant="outline" onClick={onPrevious} type="button">
            Previous
          </Button>
        )}
      </div>
      <div>
        {step !== 'results' && (
          <Button onClick={onNext} type="button">
            {step === 'operational' ? 'View Results' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  );
}
