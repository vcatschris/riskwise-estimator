
import { AssessmentData } from './types';

export interface IndustryInsight {
  businessProfile: {
    overview: string;
    assessment: string;
  };
  security: {
    overview: string;
    assessment: string;
  };
  compliance: {
    overview: string;
    assessment: string;
  };
}

export const getIndustryInsights = (data: Partial<AssessmentData>): IndustryInsight => {
  switch (data.industry) {
    case 'Legal':
    case 'Finance':
    case 'Accounting':
      return {
        businessProfile: {
          overview: "Legal and financial firms handle highly sensitive client data, making IT infrastructure a critical component. Secure storage, encrypted communications, and regulatory compliance (e.g. GDPR, FCA, SRA) are essential to maintaining client trust and avoiding legal consequences.",
          assessment: "Based on your responses, your firm may benefit from enhanced document security, structured compliance policies, and a reliable IT support system to prevent operational disruptions."
        },
        security: {
          overview: "Due to the confidential nature of legal and financial transactions, cybersecurity threats such as ransomware, phishing, and insider breaches pose a major risk. Implementing Multi-Factor Authentication (MFA), data encryption, and proactive threat monitoring reduces these risks significantly.",
          assessment: `Your current security setup suggests potential vulnerabilities in ${
            [
              data.mfaEnabled === 'No' ? 'MFA usage' : null,
              data.backupFrequency !== 'Daily' ? 'data encryption' : null,
              data.lastAudit === 'Never' ? 'incident response' : null
            ].filter(Boolean).join('/')
          }, which should be addressed to maintain compliance and client trust.`
        },
        compliance: {
          overview: "Strict regulatory requirements demand structured IT policies, secure document storage, and regular audits. Rapid IT response is necessary to prevent operational disruptions that could impact casework or financial transactions.",
          assessment: `Your risk assessment highlights potential gaps in ${
            [
              data.dataRegulations === 'Not Sure' ? 'data handling policies' : null,
              data.lastAudit === 'Never' ? 'security audits' : null,
              data.itIssues === 'Daily' ? 'staff training' : null
            ].filter(Boolean).join('/')
          }, which should be prioritised for regulatory alignment.`
        }
      };

    case 'Retail':
      return {
        businessProfile: {
          overview: "Retail and eCommerce businesses rely on seamless technology to process transactions, manage inventory, and deliver customer service. IT downtime can directly impact revenue, and secure payment processing is critical to maintaining customer trust.",
          assessment: `Based on your ${data.businessSize} business size and online presence, optimising your IT infrastructure for uptime and security will ensure uninterrupted operations and smooth customer transactions.`
        },
        security: {
          overview: "Retailers are frequent targets for credit card fraud, website attacks, and data breaches. Ensuring PCI DSS compliance, securing customer data, and preventing fraud through advanced security monitoring are high-priority needs.",
          assessment: `Your assessment indicates potential weaknesses in ${
            [
              data.endpointProtection === 'No' ? 'fraud prevention' : null,
              data.backupFrequency !== 'Daily' ? 'POS security' : null,
              data.mfaEnabled === 'No' ? 'website encryption' : null
            ].filter(Boolean).join('/')
          }, which could expose your business to cyber threats.`
        },
        compliance: {
          overview: "Retailers must adhere to data protection laws such as GDPR, especially when handling customer payment information. Quick IT support is needed to maintain uptime for POS systems, online storefronts, and backend logistics.",
          assessment: `Your current approach to IT support and compliance suggests areas for improvement in ${
            [
              data.responseNeeded === 'Within a few days' ? 'real-time system monitoring' : null,
              data.dataRegulations === 'Not Sure' ? 'customer data protection' : null
            ].filter(Boolean).join('/')
          }, ensuring both security and customer confidence.`
        }
      };

    case 'Healthcare':
      return {
        businessProfile: {
          overview: "Healthcare organisations store highly sensitive patient data and depend on reliable IT infrastructure for scheduling, telemedicine, and medical records management. Any downtime or breach can compromise patient safety and care.",
          assessment: "Your organisation's reliance on digital records means ensuring data integrity and access is critical for patient safety and operational efficiency."
        },
        security: {
          overview: "Cyber threats, including ransomware and phishing attacks, pose significant risks to patient confidentiality. Implementing robust access controls, endpoint protection, and secure data storage is critical to maintaining compliance and protecting sensitive records.",
          assessment: `Your assessment highlights potential security risks in ${
            [
              data.endpointProtection === 'No' ? 'endpoint security' : null,
              data.backupFrequency !== 'Daily' ? 'backup policies' : null,
              data.mfaEnabled === 'No' ? 'access control' : null
            ].filter(Boolean).join('/')
          }, areas that should be strengthened to ensure compliance with medical data regulations.`
        },
        compliance: {
          overview: "Strict regulatory frameworks such as GDPR and ISO 27001 require healthcare providers to maintain tight security and compliance controls. IT support must be available to ensure system uptime and prevent interruptions in care.",
          assessment: `Your responses indicate opportunities to improve compliance procedures, particularly in ${
            [
              data.dataRegulations === 'Not Sure' ? 'secure data handling' : null,
              data.lastAudit === 'Never' ? 'breach response planning' : null,
              data.responseNeeded === 'Within a few days' ? 'system uptime monitoring' : null
            ].filter(Boolean).join('/')
          }.`
        }
      };

    case 'Other':
    default:
      return {
        businessProfile: {
          overview: "Regardless of industry, IT plays a crucial role in daily operations, communication, and data security. A strong IT foundation enables efficiency, scalability, and risk mitigation.",
          assessment: "Based on your business structure, investing in reliable IT services can provide stability, improve security, and streamline operations."
        },
        security: {
          overview: "Cyber threats impact businesses of all sizes. Weak passwords, unpatched software, and phishing scams can compromise company data and result in financial losses. Implementing cybersecurity best practices reduces these risks.",
          assessment: `Your assessment suggests that your security approach could be strengthened in ${
            [
              data.mfaEnabled === 'No' ? 'password policies' : null,
              data.endpointProtection === 'No' ? 'patch management' : null,
              data.phishingAttempt === 'Yes' ? 'phishing awareness training' : null
            ].filter(Boolean).join('/')
          } to minimise risk.`
        },
        compliance: {
          overview: "Data protection regulations apply to most businesses, requiring secure IT systems and proper documentation. Having reliable IT support ensures minimal downtime and fast issue resolution.",
          assessment: `Your responses indicate that improvements in ${
            [
              data.lastAudit === 'Never' ? 'data security audits' : null,
              data.responseNeeded === 'Within a few days' ? 'IT response planning' : null,
              data.itIssues === 'Daily' ? 'staff security training' : null
            ].filter(Boolean).join('/')
          } would enhance business continuity and compliance.`
        }
      };
  }
};
