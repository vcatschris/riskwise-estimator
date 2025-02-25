
import { Industry } from '../../types';

export const COMPLIANCE_INSIGHTS: Record<Industry, {
  description: string;
  industrySpecific: string[];
  sizeSpecific: {
    small: string[];
    medium: string[];
    large: string[];
  };
}> = {
  Legal: {
    description: "Your law firm's approach to compliance and IT support significantly impacts your operational resilience. Your current support structure and compliance practices, including response times and regulatory adherence, affect both client service and risk management. Legal firms must balance immediate IT support needs with strict regulatory requirements, ensuring both operational efficiency and compliance standards are maintained. Our compliance specialists can help you navigate these complex requirements effectively.",
    industrySpecific: [
      "SRA compliance requirements",
      "Legal document retention policies",
      "Client confidentiality standards"
    ],
    sizeSpecific: {
      small: ["Basic compliance needs", "Limited support resources"],
      medium: ["Growing compliance complexity", "Need for dedicated support"],
      large: ["Complex compliance framework", "24/7 support requirements"]
    }
  },
  Finance: {
    description: "Your financial institution's compliance and support framework is crucial for maintaining regulatory standards and operational efficiency. Your current IT support structure and compliance monitoring directly impact your ability to meet regulatory requirements whilst maintaining service levels. Financial organisations face complex compliance demands alongside the need for rapid IT support response times. Let's explore how our managed services can help you meet these demands more effectively.",
    industrySpecific: [
      "FCA compliance requirements",
      "Transaction monitoring needs",
      "Audit trail requirements"
    ],
    sizeSpecific: {
      small: ["Basic compliance framework", "Limited support availability"],
      medium: ["Multiple compliance standards", "Growing support needs"],
      large: ["Complex compliance environment", "Global support requirements"]
    }
  },
  Retail: {
    description: "Your retail operation's compliance and support structure is essential for maintaining customer service and regulatory standards. Your current IT support model and compliance practices affect both customer experience and regulatory adherence. Retail businesses must balance immediate support needs with payment card industry standards and consumer protection requirements. Our retail IT specialists can help you maintain compliance whilst improving customer service efficiency.",
    industrySpecific: [
      "PCI compliance requirements",
      "Consumer protection regulations",
      "Payment system standards"
    ],
    sizeSpecific: {
      small: ["Basic retail compliance", "Limited support needs"],
      medium: ["Multi-store compliance", "Growing support requirements"],
      large: ["Enterprise retail compliance", "Complex support needs"]
    }
  },
  Healthcare: {
    description: "Your healthcare organisation's compliance and support framework is vital for maintaining patient care standards and regulatory requirements. Your current IT support structure and compliance monitoring directly impact patient care delivery and data protection. Healthcare providers must balance immediate support needs with strict patient privacy regulations and healthcare standards. Our healthcare IT experts can help you maintain compliance whilst optimising patient care delivery.",
    industrySpecific: [
      "HIPAA compliance requirements",
      "Medical record regulations",
      "Patient privacy standards"
    ],
    sizeSpecific: {
      small: ["Basic healthcare compliance", "Essential support"],
      medium: ["Growing compliance needs", "Multiple provider access"],
      large: ["Enterprise healthcare compliance", "Complex support structure"]
    }
  },
  Accounting: {
    description: "Your accounting firm's compliance and support structure directly impacts client service quality and regulatory adherence. Your current IT support model and compliance practices affect both operational efficiency and professional standards. Accounting firms must balance immediate support needs with financial regulations and data protection requirements, particularly during peak tax periods. Let's discuss how our managed services can help you handle these demanding periods more effectively.",
    industrySpecific: [
      "Financial compliance requirements",
      "Tax regulation standards",
      "Data retention policies"
    ],
    sizeSpecific: {
      small: ["Basic compliance needs", "Limited support"],
      medium: ["Growing compliance demands", "Multiple service support"],
      large: ["Enterprise compliance framework", "Complex support needs"]
    }
  },
  Other: {
    description: "Your organisation's compliance and support structure forms the foundation of your operational reliability and regulatory adherence. Your current IT support model and compliance practices determine your ability to maintain efficient operations whilst meeting industry standards. Whilst specific requirements may vary, maintaining effective IT support and compliance monitoring is crucial for business continuity. Our team can help you develop a support and compliance framework that fits your specific needs.",
    industrySpecific: [
      "Basic compliance needs",
      "Standard support requirements",
      "General IT management"
    ],
    sizeSpecific: {
      small: ["Basic support needs", "Essential compliance"],
      medium: ["Growing support demands", "Increased compliance needs"],
      large: ["Complex support structure", "Comprehensive compliance"]
    }
  }
};
