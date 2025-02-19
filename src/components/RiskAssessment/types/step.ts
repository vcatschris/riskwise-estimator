
export type Step = 'provider' | 'profile' | 'security' | 'compliance' | 'results';

export interface StepInfo {
  title: string;
  description: string;
}

export const getTitleAndDescription = (step: Step): StepInfo => {
  switch (step) {
    case 'provider':
      return {
        title: "Current IT Support",
        description: "Understanding your current setup helps us identify potential gaps and opportunities for improvement"
      };
    case 'profile':
      return {
        title: "Business Context",
        description: "Different industries and business sizes face unique challenges - this helps us provide targeted recommendations"
      };
    case 'security':
      return {
        title: "Security Measures",
        description: "These core security practices are critical indicators of your IT resilience"
      };
    case 'compliance':
      return {
        title: "Operational Requirements",
        description: "Help us understand your specific needs around compliance and response times"
      };
    case 'results':
      return {
        title: "",
        description: ""
      };
    default:
      return {
        title: "",
        description: ""
      };
  }
};
