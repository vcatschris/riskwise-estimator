
import { Industry } from '../../types';

export const BUSINESS_PROFILE_INSIGHTS: Record<Industry, {
  description: string;
  industrySpecific: string[];
  sizeSpecific: {
    small: string[];
    medium: string[];
    large: string[];
  };
}> = {
  Legal: {
    description: "Your law firm's IT infrastructure requires careful consideration given the sensitive nature of client data and regulatory obligations. The combination of your firm size, data handling practices, and current IT support structure shapes your risk profile. Legal firms are particularly attractive targets for cybercriminals due to the valuable client information they hold, making your IT resilience crucial for maintaining client trust and regulatory compliance. Our assessment suggests areas where specialist guidance could help strengthen your firm's technology foundation.",
    industrySpecific: [
      "Law firms are prime targets for cybercriminals due to sensitive client data",
      "Regulatory compliance with SRA and GDPR is mandatory",
      "Client confidentiality breaches can result in severe reputational damage"
    ],
    sizeSpecific: {
      small: ["Small firms often lack dedicated IT resources", "Cost-effective solutions needed"],
      medium: ["Growing complexity requires structured IT management", "Balance between security and accessibility"],
      large: ["Multiple office locations need unified IT strategy", "Complex compliance requirements"]
    }
  },
  Finance: {
    description: "As a financial services organisation, your IT infrastructure is critical to maintaining operational integrity and client trust. Your current setup, including your data handling practices and IT support model, directly impacts your risk exposure. Financial institutions face sophisticated cyber threats targeting both client assets and sensitive financial data, making robust IT systems essential for your operations and compliance requirements. A detailed review with our security specialists could identify opportunities to enhance your defensive posture.",
    industrySpecific: [
      "Financial data requires maximum security protection",
      "FCA compliance and audit requirements",
      "Zero tolerance for system downtime"
    ],
    sizeSpecific: {
      small: ["Limited IT budget but high security needs", "Need for enterprise-grade security"],
      medium: ["Growing transaction volumes require scalable systems", "Multiple regulatory requirements"],
      large: ["Complex integration needs", "International compliance requirements"]
    }
  },
  Accounting: {
    description: "Your accounting firm's IT infrastructure directly impacts your ability to serve clients and protect sensitive financial data. The combination of your firm's size, data handling practices, and current IT support structure influences your overall risk profile. Accounting firms face particular challenges during tax periods and when handling multiple clients' financial information, making IT reliability and security paramount. We can help you develop strategies to manage these peak periods whilst maintaining security standards.",
    industrySpecific: [
      "Financial data security requirements",
      "Tax season peak performance needs",
      "Client confidentiality standards"
    ],
    sizeSpecific: {
      small: ["Basic financial software needs", "Limited IT resources"],
      medium: ["Growing client data management", "Multiple service lines"],
      large: ["Enterprise financial systems", "Multiple office locations"]
    }
  },
  Retail: {
    description: "Your retail business's IT infrastructure plays a vital role in maintaining customer service, managing transactions, and protecting customer data. Given your business size and operational model, your technology needs focus on maintaining consistent service whilst protecting payment systems and customer information. The retail sector faces unique challenges in balancing accessibility with security, particularly in managing point-of-sale systems and e-commerce platforms. Our team can help you explore cost-effective solutions to address these specific challenges.",
    industrySpecific: [
      "POS system reliability is critical",
      "Customer data protection requirements",
      "Ecommerce integration needs"
    ],
    sizeSpecific: {
      small: ["Basic POS and inventory management", "Limited IT budget"],
      medium: ["Multiple locations need centralized management", "Growing online presence"],
      large: ["Complex supply chain integration", "Multi-channel retail requirements"]
    }
  },
  Healthcare: {
    description: "Your healthcare organisation's IT infrastructure is crucial for both patient care and data protection. Given the sensitive nature of patient information and the critical nature of healthcare services, your technology setup requires careful consideration of both security and accessibility. Healthcare providers face unique challenges in protecting patient data whilst ensuring systems remain accessible for critical care delivery. Let's discuss how we can help you maintain compliance whilst optimising your IT operations.",
    industrySpecific: [
      "Patient confidentiality is paramount",
      "Healthcare compliance requirements",
      "Critical system reliability needs"
    ],
    sizeSpecific: {
      small: ["Basic patient record management", "Limited IT resources"],
      medium: ["Multiple practitioner coordination", "Growing patient data volumes"],
      large: ["Complex integration with health systems", "Multi-location challenges"]
    }
  },
  Other: {
    description: "Your organisation's IT infrastructure plays a vital role in your daily operations and data security. Based on your business size and operational model, your technology needs require a balanced approach to security and accessibility. Whilst your industry may have specific requirements, maintaining robust IT systems is crucial for operational efficiency and data protection. Our team can provide tailored guidance to address your unique technology challenges.",
    industrySpecific: [
      "Standard security practices required",
      "Basic compliance requirements",
      "General IT reliability needs"
    ],
    sizeSpecific: {
      small: ["Focus on essential IT services", "Cost-effective solutions"],
      medium: ["Balanced IT infrastructure needed", "Growing complexity management"],
      large: ["Enterprise-level requirements", "Comprehensive IT strategy"]
    }
  }
};
