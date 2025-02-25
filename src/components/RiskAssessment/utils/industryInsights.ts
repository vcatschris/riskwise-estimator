
import { IndustryInsight } from '../types';

export const INDUSTRY_INSIGHTS: Record<string, IndustryInsight> = {
  Legal: {
    risks: [
      "High risk of ransomware & data breaches due to confidential client data",
      "Regulatory compliance exposure to GDPR and SRA standards",
      "Service outages can disrupt critical casework",
      "Frequent targets of email fraud & phishing attacks"
    ],
    values: [
      "Regulatory compliance support for legal requirements",
      "Advanced cybersecurity protection against breaches",
      "Business continuity & disaster recovery systems",
      "Secure client communication & document management"
    ]
  },
  Finance: {
    risks: [
      "High risk of financial data breaches and theft",
      "Strict FCA compliance requirements",
      "Critical transaction system reliability",
      "Targeted financial fraud attempts"
    ],
    values: [
      "Financial compliance and audit support",
      "Advanced fraud prevention systems",
      "High-availability transaction processing",
      "Secure financial data management"
    ]
  },
  Accounting: {
    risks: [
      "Sensitive financial data protection",
      "Tax and financial compliance requirements",
      "System reliability during peak seasons",
      "Financial fraud and phishing attempts"
    ],
    values: [
      "Comprehensive data security measures",
      "Compliance and audit support",
      "Reliable system performance",
      "Advanced threat protection"
    ]
  },
  Retail: {
    risks: [
      "Payment system security risks",
      "Customer data protection requirements",
      "POS system reliability",
      "Website and ecommerce vulnerabilities"
    ],
    values: [
      "24/7 system monitoring and support",
      "PCI DSS compliance management",
      "Reliable POS and inventory systems",
      "Secure payment processing"
    ]
  },
  Healthcare: {
    risks: [
      "Patient data confidentiality risks",
      "Healthcare compliance requirements",
      "Critical system reliability",
      "Ransomware targeting medical systems"
    ],
    values: [
      "HIPAA/GDPR compliance support",
      "Advanced patient data protection",
      "24/7 systems availability",
      "Secure medical record management"
    ]
  },
  Other: {
    risks: [
      "Data security vulnerabilities",
      "System reliability concerns",
      "Compliance requirements",
      "Cybersecurity threats"
    ],
    values: [
      "Comprehensive IT security",
      "Reliable system support",
      "Compliance guidance",
      "Cost-effective IT management"
    ]
  }
};

