
import React from 'react';
import { Button } from '@/components/ui/button';
import { Step } from '../types/step';
import { Loader2 } from 'lucide-react';

interface FormNavigationProps {
  step: Step;
  onPrevious: () => void;
  onNext: () => void;
  isGeneratingReport?: boolean;
}

export function FormNavigation({ step, onPrevious, onNext, isGeneratingReport = false }: FormNavigationProps) {
  return (
    <div className="flex justify-between w-full">
      <div>
        {step !== 'business' && (
          <Button variant="outline" onClick={onPrevious} type="button" disabled={isGeneratingReport}>
            Previous
          </Button>
        )}
      </div>
      <div>
        {step !== 'results' && (
          <Button 
            onClick={onNext} 
            type="button"
            disabled={isGeneratingReport}
          >
            {step === 'operational' ? (
              isGeneratingReport ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : 'View Results'
            ) : 'Next'}
          </Button>
        )}
      </div>
    </div>
  );
}
