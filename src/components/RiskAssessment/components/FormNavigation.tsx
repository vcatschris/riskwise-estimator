
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
  const handleNext = () => {
    // Send GTM event when "View Results" button is clicked
    if (step === 'operational') {
      try {
        // Use the dataLayer to push the event
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'view_results_click',
            eventCategory: 'Assessment',
            eventAction: 'Click',
            eventLabel: 'View Results Button'
          });
          console.log('GTM event sent: view_results_click');
        }
      } catch (error) {
        console.error('Error sending GTM event:', error);
      }
    }
    
    // Call the original onNext function
    onNext();
  };

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
            onClick={handleNext} 
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
