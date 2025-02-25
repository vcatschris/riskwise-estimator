
export type Step = 'business' | 'itsupport' | 'infrastructure' | 'security' | 'operational' | 'results';

export interface StepInfo {
  title: string;
  description: string;
}

export const getTitleAndDescription = (step: Step): StepInfo => {
  switch (step) {
    case 'business':
      return {
        title: "Business Profile",
        description: "Understanding your business context helps us identify industry-specific challenges and requirements"
      };
    case 'itsupport':
      return {
        title: "IT Support & Management",
        description: "Tell us about how your IT systems are currently supported and managed"
      };
    case 'infrastructure':
      return {
        title: "IT Infrastructure & Systems",
        description: "Help us understand the technology backbone that your business relies on"
      };
    case 'security':
      return {
        title: "Security & Compliance",
        description: "These core security practices are critical indicators of your IT resilience"
      };
    case 'operational':
      return {
        title: "Operational Impact & Needs",
        description: "Help us understand how IT affects your day-to-day business operations"
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
