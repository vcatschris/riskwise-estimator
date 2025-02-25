
import { Industry } from '../../types';

export const SECURITY_INSIGHTS: Record<Industry, {
  description: string;
  industrySpecific: string[];
  sizeSpecific: {
    small: string[];
    medium: string[];
    large: string[];
  };
}> = {
  Legal: {
    description: "Your current security posture reveals important considerations for your law firm's cyber resilience. Your approach to security audits, multi-factor authentication, and data backup practices shapes your vulnerability to cyber threats. Legal firms require exceptional security measures due to the confidential nature of client information and the increasing sophistication of cyber attacks targeting the legal sector. Our security specialists can help you implement industry-best practices tailored to your firm's needs.",
    industrySpecific: [
      "Advanced encryption for client communications",
      "Secure document management systems",
      "Protection against targeted attacks"
    ],
    sizeSpecific: {
      small: ["Basic security measures may be insufficient", "Limited security budget"],
      medium: ["Need for comprehensive security framework", "Remote access security"],
      large: ["Enterprise-grade security requirements", "Multiple attack surfaces"]
    }
  },
  Finance: {
    description: "Your financial institution's security measures are critical for protecting both assets and client trust. Your current implementation of security controls, including authentication methods and data protection strategies, directly impacts your exposure to financial cyber threats. The financial sector faces sophisticated attacks aimed at both monetary theft and data breaches, requiring robust security measures across all systems. Let's explore how we can strengthen your security framework to meet these challenges.",
    industrySpecific: [
      "Transaction security is critical",
      "Protection against financial fraud",
      "Secure client portal requirements"
    ],
    sizeSpecific: {
      small: ["Basic financial data protection", "Limited security resources"],
      medium: ["Growing security complexity", "Multiple system integrations"],
      large: ["Enterprise security framework needed", "International security standards"]
    }
  },
  Retail: {
    description: "Your retail operation's security measures are essential for protecting customer data and maintaining payment system integrity. Your current security controls, including point-of-sale protection and customer data safeguards, determine your resilience against retail-specific cyber threats. The retail sector faces unique challenges in protecting customer payment information whilst maintaining efficient transaction processes. We can help you implement security solutions that protect your business without slowing down sales.",
    industrySpecific: [
      "PCI DSS compliance requirements",
      "Point-of-sale system security",
      "Customer data protection"
    ],
    sizeSpecific: {
      small: ["Basic payment security", "Limited security budget"],
      medium: ["Multi-location security needs", "Growing digital presence"],
      large: ["Enterprise retail security", "Multi-channel protection"]
    }
  },
  Healthcare: {
    description: "Your healthcare organisation's security measures are crucial for protecting patient privacy and maintaining regulatory compliance. Your current security implementation, including access controls and data protection measures, directly impacts patient data safety and operational integrity. Healthcare providers face unique challenges in protecting sensitive medical information whilst ensuring quick access for patient care. Our healthcare IT specialists can guide you through implementing robust security measures that maintain efficiency.",
    industrySpecific: [
      "HIPAA compliance requirements",
      "Medical device security",
      "Patient data protection"
    ],
    sizeSpecific: {
      small: ["Basic patient data security", "Limited security resources"],
      medium: ["Growing patient data volumes", "Multiple provider access"],
      large: ["Enterprise healthcare security", "Multi-facility protection"]
    }
  },
  Accounting: {
    description: "Your accounting firm's security measures are vital for protecting client financial data and maintaining professional standards. Your current security controls, including data protection and access management, shape your defence against financial cyber threats. Accounting firms face particular challenges in securing sensitive financial information whilst maintaining efficient client service delivery. Let's discuss how we can enhance your security measures whilst optimising workflow efficiency.",
    industrySpecific: [
      "Financial data security",
      "Client confidentiality",
      "Tax information protection"
    ],
    sizeSpecific: {
      small: ["Basic financial security", "Limited resources"],
      medium: ["Growing security needs", "Multiple client types"],
      large: ["Enterprise financial security", "Complex data protection"]
    }
  },
  Other: {
    description: "Your organisation's security measures form the foundation of your cyber defence strategy. Your current implementation of security controls, including authentication methods and data protection, determines your resilience against various cyber threats. Whilst your industry may have specific requirements, maintaining strong security measures is essential for protecting your operations and data. Our team can help you develop a comprehensive security strategy aligned with your business goals.",
    industrySpecific: [
      "Standard security protocols",
      "Basic threat protection",
      "Data security requirements"
    ],
    sizeSpecific: {
      small: ["Essential security measures", "Basic protection needs"],
      medium: ["Enhanced security framework", "Growing security demands"],
      large: ["Comprehensive security", "Complex threat protection"]
    }
  }
};
