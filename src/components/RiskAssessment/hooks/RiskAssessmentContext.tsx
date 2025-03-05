
import React, { createContext, useContext, ReactNode } from 'react';
import { useRiskAssessment } from './useRiskAssessment';

const RiskAssessmentContext = createContext<ReturnType<typeof useRiskAssessment> | undefined>(undefined);

export const RiskAssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const assessmentContext = useRiskAssessment();
  
  return (
    <RiskAssessmentContext.Provider value={assessmentContext}>
      {children}
    </RiskAssessmentContext.Provider>
  );
};

export const useRiskAssessmentContext = () => {
  const context = useContext(RiskAssessmentContext);
  if (context === undefined) {
    throw new Error('useRiskAssessmentContext must be used within a RiskAssessmentProvider');
  }
  return context;
};
