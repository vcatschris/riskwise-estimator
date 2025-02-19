import { AssessmentData, RiskScore, IndustryInsight, Industry, BusinessSize, CategoryInsight } from './types';

const INDUSTRY_WEIGHTS = {
  Accounting: { risk: 2, rp: 5, vp: 5 },
  Legal: { risk: 2, rp: 5, vp: 5 },
  Finance: { risk: 2, rp: 5, vp: 5 },
  Retail: { risk: 1.5, rp: 3, vp: 4 },
  Healthcare: { risk: 1.5, rp: 3, vp: 4 },
  Other: { risk: 1, rp: 1, vp: 2 },
};

const BUSINESS_SIZE_WEIGHTS = {
  '1-5': { rp: 1, vp: 1, weight: 1 },
  '6-20': { rp: 2, vp: 3, weight: 1 },
  '21-50': { rp: 3, vp: 5, weight: 1.5 },
  '51-100': { rp: 4, vp: 7, weight: 2 },
  '100+': { rp: 5, vp: 10, weight: 2.5 },
};

const INDUSTRY_INSIGHTS: Record<string, IndustryInsight> = {
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

const CATEGORY_INSIGHTS: Record<string, Record<Industry, {
  description: string;
  industrySpecific: string[];
  sizeSpecific: {
    small: string[];
    medium: string[];
    large: string[];
  };
}>> = {
  'Business Profile': {
    Legal: {
      description: "Your law firm's IT infrastructure requires careful consideration given the sensitive nature of client data and regulatory obligations. The combination of your firm size, data handling practices, and current IT support structure shapes your risk profile. Legal firms are particularly attractive targets for cybercriminals due to the valuable client information they hold, making your IT resilience crucial for maintaining client trust and regulatory compliance. Our assessment suggests areas where expert guidance could help strengthen your firm's technology foundation.",
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
      description: "As a financial services organization, your IT infrastructure is critical to maintaining operational integrity and client trust. Your current setup, including your data handling practices and IT support model, directly impacts your risk exposure. Financial institutions face sophisticated cyber threats targeting both client assets and sensitive financial data, making robust IT systems essential for your operations and compliance requirements. A detailed review with our security experts could identify opportunities to enhance your defensive posture.",
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
    Retail: {
      description: "Your retail business's IT infrastructure plays a vital role in maintaining customer service, managing transactions, and protecting customer data. Given your business size and operational model, your technology needs focus on maintaining consistent service while protecting payment systems and customer information. The retail sector faces unique challenges in balancing accessibility with security, particularly in managing point-of-sale systems and e-commerce platforms. Our team can help you explore cost-effective solutions to address these specific challenges.",
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
      description: "Your healthcare organization's IT infrastructure is crucial for both patient care and data protection. Given the sensitive nature of patient information and the critical nature of healthcare services, your technology setup requires careful consideration of both security and accessibility. Healthcare providers face unique challenges in protecting patient data while ensuring systems remain accessible for critical care delivery. Let's discuss how we can help you maintain HIPAA compliance while optimizing your IT operations.",
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
    Accounting: {
      description: "Your accounting firm's IT infrastructure directly impacts your ability to serve clients and protect sensitive financial data. The combination of your firm's size, data handling practices, and current IT support structure influences your overall risk profile. Accounting firms face particular challenges during tax seasons and when handling multiple clients' financial information, making IT reliability and security paramount. We can help you develop strategies to manage these peak periods while maintaining security standards.",
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
    Other: {
      description: "Your organization's IT infrastructure plays a vital role in your daily operations and data security. Based on your business size and operational model, your technology needs require a balanced approach to security and accessibility. While your industry may have specific requirements, maintaining robust IT systems is crucial for operational efficiency and data protection. Our team can provide tailored guidance to address your unique technology challenges.",
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
  },
  'Security': {
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
      description: "Your retail operation's security measures are essential for protecting customer data and maintaining payment system integrity. Your current security controls, including point-of-sale protection and customer data safeguards, determine your resilience against retail-specific cyber threats. The retail sector faces unique challenges in protecting customer payment information while maintaining efficient transaction processes. We can help you implement security solutions that protect your business without slowing down sales.",
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
      description: "Your healthcare organization's security measures are crucial for protecting patient privacy and maintaining regulatory compliance. Your current security implementation, including access controls and data protection measures, directly impacts patient data safety and operational integrity. Healthcare providers face unique challenges in protecting sensitive medical information while ensuring quick access for patient care. Our healthcare IT specialists can guide you through implementing robust security measures that maintain efficiency.",
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
      description: "Your accounting firm's security measures are vital for protecting client financial data and maintaining professional standards. Your current security controls, including data protection and access management, shape your defense against financial cyber threats. Accounting firms face particular challenges in securing sensitive financial information while maintaining efficient client service delivery. Let's discuss how we can enhance your security measures while optimizing workflow efficiency.",
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
      description: "Your organization's security measures form the foundation of your cyber defense strategy. Your current implementation of security controls, including authentication methods and data protection, determines your resilience against various cyber threats. While your industry may have specific requirements, maintaining strong security measures is essential for protecting your operations and data. Our team can help you develop a comprehensive security strategy aligned with your business goals.",
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
  },
  'Compliance & Support': {
    Legal: {
      description: "Your law firm's approach to compliance and IT support significantly impacts your operational resilience. Your current support structure and compliance practices, including response times and regulatory adherence, affect both client service and risk management. Legal firms must balance immediate IT support needs with strict regulatory requirements, ensuring both operational efficiency and compliance standards are maintained. Our compliance experts can help you navigate these complex requirements effectively.",
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
      description: "Your financial institution's compliance and support framework is crucial for maintaining regulatory standards and operational efficiency. Your current IT support structure and compliance monitoring directly impact your ability to meet regulatory requirements while maintaining service levels. Financial organizations face complex compliance demands alongside the need for rapid IT support response times. Let's explore how our managed services can help you meet these demands more effectively.",
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
      description: "Your retail operation's compliance and support structure is essential for maintaining customer service and regulatory standards. Your current IT support model and compliance practices affect both customer experience and regulatory adherence. Retail businesses must balance immediate support needs with payment card industry standards and consumer protection requirements. Our retail IT specialists can help you maintain compliance while improving customer service efficiency.",
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
      description: "Your healthcare organization's compliance and support framework is vital for maintaining patient care standards and regulatory requirements. Your current IT support structure and compliance monitoring directly impact patient care delivery and data protection. Healthcare providers must balance immediate support needs with strict patient privacy regulations and healthcare standards. Let's discuss how we can maintain compliance while optimizing patient care delivery.",
      industrySpecific: [
        "HIPAA compliance requirements",
        "Medical record regulations",
        "Patient privacy standards"
      ],
      sizeSpecific: {
        small: ["Basic healthcare compliance", "Essential support"],
        medium: ["Growing compliance needs", "Multiple provider support"],
        large: ["Enterprise healthcare compliance", "Complex support structure"]
      }
    },
    Accounting: {
      description: "Your accounting firm's compliance and support structure directly impacts client service quality and regulatory adherence. Your current IT support model and compliance practices affect both operational efficiency and professional standards. Accounting firms must balance immediate support needs with financial regulations and data protection requirements, particularly during peak tax seasons. Let's discuss how our managed services can help you handle these demanding periods more effectively.",
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
      description: "Your organization's compliance and support structure forms the foundation of your operational reliability and regulatory adherence. Your current IT support model and compliance practices determine your ability to maintain efficient operations while meeting industry standards. While specific requirements may vary, maintaining effective IT support and compliance monitoring is crucial for business continuity. Our team can help you develop a support and compliance framework that fits your specific needs.",
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
  }
};

function getCategoryInsights(category: string, industry: Industry, businessSize: BusinessSize): CategoryInsight {
  const categoryData = CATEGORY_INSIGHTS[category as keyof typeof CATEGORY_INSIGHTS]?.[industry];
  
  if (!categoryData) {
    return {
      description: "General business IT requirements apply.",
      industrySpecific: ["Standard industry practices apply"],
      sizeSpecific: ["Size-appropriate solutions recommended"]
    };
  }

  const sizeCategory = 
    businessSize === '1-5' || businessSize === '6-20' ? 'small' :
    businessSize === '21-50' ? 'medium' : 'large';

  return {
    description: categoryData.description,
    industrySpecific: categoryData.industrySpecific,
    sizeSpecific: categoryData.sizeSpecific[sizeCategory]
  };
}

const calculateMaxScores = () => {
  const maxRiskPoints = 100; // Changed to 100
  const maxValuePoints = 100; // Changed to 100
  return { maxRiskPoints, maxValuePoints };
};

export const calculateRiskScore = (data: AssessmentData): RiskScore => {
  let totalRiskPoints = 0;
  let totalValuePoints = 0;
  const details = [];

  const getDescriptionForCategory = (category: string) => {
    const insights = CATEGORY_INSIGHTS[category][data.industry || 'Other'];
    return {
      description: insights.description,
      industrySpecific: insights.industrySpecific,
      sizeSpecific: insights.sizeSpecific
    };
  };

  // Business Profile Risk
  let profileRiskScore = 0;
  let profileValueScore = 0;

  // Business Size
  const sizeWeights = BUSINESS_SIZE_WEIGHTS[data.businessSize];
  profileRiskScore += sizeWeights.rp * sizeWeights.weight;
  profileValueScore += sizeWeights.vp;

  // Sensitive Data
  if (data.sensitiveData === 'Yes') {
    profileRiskScore += 5 * 2; // 2x weighting
    profileValueScore += 5;
  } else if (data.sensitiveData === 'No') {
    profileValueScore += 2;
  }

  // Internal IT
  if (data.internalIT === 'Yes') {
    profileRiskScore -= 3;
    profileValueScore += 3;
  } else if (data.internalIT === 'No') {
    profileRiskScore += 5 * 1.5;
    profileValueScore += 7;
  } else {
    profileRiskScore += 2;
    profileValueScore += 5;
  }

  // Apply industry modifier to profile risk score
  profileRiskScore *= INDUSTRY_WEIGHTS[data.industry].risk;
  
  // Normalize profile scores to a 0-33 range (one third of total)
  profileRiskScore = (profileRiskScore / 50) * 33;
  profileValueScore = (profileValueScore / 50) * 33;
  
  totalRiskPoints += profileRiskScore;
  totalValuePoints += profileValueScore;

  details.push({
    category: 'Business Profile',
    riskScore: profileRiskScore,
    valueScore: profileValueScore,
    recommendations: [
      data.sensitiveData === 'Yes' ? 'Implement enhanced data protection measures' : '',
      data.internalIT === 'No' ? 'Consider managed IT support for better security' : '',
    ].filter(Boolean),
    insights: getDescriptionForCategory('Business Profile'),
    riskAreas: [
      data.sensitiveData === 'Yes' ? 'Handling sensitive data requires additional protection' : '',
      data.internalIT === 'No' ? 'Lack of internal IT support increases vulnerability' : '',
      data.cloudServices === 'Yes' ? 'Cloud services need proper security configuration' : '',
    ].filter(Boolean),
    valueAreas: [
      'Structured IT management approach',
      'Enhanced data protection measures',
      'Professional IT expertise and support',
    ]
  });

  // Security Risk
  let securityRiskScore = 0;
  let securityValueScore = 0;

  // Last Audit
  if (data.lastAudit === 'Never') {
    securityRiskScore += 10 * 3;
    securityValueScore += 10;
  } else if (data.lastAudit === 'Over a year ago') {
    securityRiskScore += 5 * 2;
    securityValueScore += 5;
  } else if (data.lastAudit === '6-12 months ago') {
    securityRiskScore += 2 * 1.5;
    securityValueScore += 3;
  } else {
    securityValueScore += 2;
  }

  // MFA
  if (data.mfaEnabled === 'No') {
    securityRiskScore += 7 * 2.5;
    securityValueScore += 7;
  } else if (data.mfaEnabled === 'Not Sure') {
    securityRiskScore += 5 * 2;
    securityValueScore += 5;
  } else {
    securityValueScore += 2;
  }

  // Backup Frequency
  if (data.backupFrequency === "We don't back up data") {
    securityRiskScore += 10 * 3;
    securityValueScore += 10;
  } else if (data.backupFrequency === 'Monthly') {
    securityRiskScore += 5 * 2;
    securityValueScore += 5;
  } else if (data.backupFrequency === 'Weekly') {
    securityRiskScore += 2 * 1.5;
    securityValueScore += 3;
  } else if (data.backupFrequency === 'Daily') {
    securityValueScore += 2;
  }

  // Normalize security scores to a 0-33 range (one third of total)
  securityRiskScore = (securityRiskScore / 100) * 33;
  securityValueScore = (securityValueScore / 100) * 33;

  totalRiskPoints += securityRiskScore;
  totalValuePoints += securityValueScore;

  details.push({
    category: 'Security',
    riskScore: securityRiskScore,
    valueScore: securityValueScore,
    recommendations: [
      data.lastAudit === 'Never' ? 'Schedule regular security audits' : '',
      data.mfaEnabled === 'No' ? 'Enable multi-factor authentication' : '',
      data.backupFrequency === "We don't back up data" ? 'Implement regular backup strategy' : '',
      data.endpointProtection === 'No' ? 'Deploy endpoint protection solutions' : '',
    ].filter(Boolean),
    insights: getDescriptionForCategory('Security'),
    riskAreas: [
      data.lastAudit === 'Never' ? 'No recent security audit' : '',
      data.mfaEnabled === 'No' ? 'Missing multi-factor authentication' : '',
      data.backupFrequency === "We don't back up data" ? 'No data backup strategy' : '',
    ].filter(Boolean),
    valueAreas: [
      'Enhanced security measures',
      'Regular security assessments',
      'Comprehensive data protection',
    ]
  });

  // Compliance & Support Risk
  let complianceRiskScore = 0;
  let complianceValueScore = 0;

  // Data Regulations
  if (data.dataRegulations === 'Yes') {
    complianceRiskScore += 7 * 2;
    complianceValueScore += 7;
  } else if (data.dataRegulations === 'Not Sure') {
    complianceRiskScore += 5 * 1.5;
    complianceValueScore += 5;
  } else {
    complianceValueScore += 2;
  }

  // IT Issues Frequency
  if (data.itIssues === 'Daily') {
    complianceRiskScore += 10 * 3;
    complianceValueScore += 10;
  } else if (data.itIssues === 'Weekly') {
    complianceRiskScore += 7 * 2;
    complianceValueScore += 7;
  } else if (data.itIssues === 'Occasionally') {
    complianceRiskScore += 3;
    complianceValueScore += 3;
  } else if (data.itIssues === 'Rarely') {
    complianceRiskScore += 1;
    complianceValueScore += 1;
  }

  // Response Time Needed
  if (data.responseNeeded === 'Within minutes') {
    complianceRiskScore += 7 * 3;
    complianceValueScore += 10;
  } else if (data.responseNeeded === 'Within an hour') {
    complianceRiskScore += 5 * 2;
    complianceValueScore += 7;
  } else if (data.responseNeeded === 'Same day') {
    complianceRiskScore += 2 * 1.5;
    complianceValueScore += 5;
  } else {
    complianceValueScore += 2;
  }

  // Normalize compliance scores to a 0-34 range (final third of total, slightly higher to round to 100)
  complianceRiskScore = (complianceRiskScore / 100) * 34;
  complianceValueScore = (complianceValueScore / 100) * 34;

  totalRiskPoints += complianceRiskScore;
  totalValuePoints += complianceValueScore;

  details.push({
    category: 'Compliance & Support',
    riskScore: complianceRiskScore,
    valueScore: complianceValueScore,
    recommendations: [
      data.dataRegulations === 'Not Sure' ? 'Assess your regulatory requirements' : '',
      data.dataRegulations === 'Yes' ? 'Implement compliance monitoring' : '',
      data.itIssues === 'Daily' || data.itIssues === 'Weekly' ? 'Consider proactive IT monitoring' : '',
    ].filter(Boolean),
    insights: getDescriptionForCategory('Compliance & Support'),
    riskAreas: [
      data.dataRegulations === 'Not Sure' ? 'Unclear regulatory compliance status' : '',
      data.itIssues === 'Daily' ? 'Frequent IT disruptions' : '',
      data.responseNeeded === 'Within minutes' ? 'Critical response time requirements' : '',
    ].filter(Boolean),
    valueAreas: [
      'Compliance management system',
      'Proactive IT support',
      'Business continuity planning',
    ]
  });

  // Round scores to ensure they don't exceed 100
  totalRiskPoints = Math.min(Math.round(totalRiskPoints), 100);
  totalValuePoints = Math.min(Math.round(totalValuePoints), 100);

  let riskLevel: 'Low' | 'Medium' | 'High';
  if (totalRiskPoints < 33) riskLevel = 'Low';
  else if (totalRiskPoints < 66) riskLevel = 'Medium';
  else riskLevel = 'High';

  // Generate executive summary
  const industryInsights = INDUSTRY_INSIGHTS[data.industry] || INDUSTRY_INSIGHTS.Other;
  
  const getTopRisks = () => {
    const risks = [];
    if (data.sensitiveData === 'Yes') {
      risks.push("Handles sensitive data requiring enhanced protection");
    }
    if (data.lastAudit === 'Never' || data.lastAudit === 'Over a year ago') {
      risks.push("Overdue for security audit");
    }
    if (data.backupFrequency === "We don't back up data" || data.backupFrequency === 'Not Sure') {
      risks.push("Inadequate data backup procedures");
    }
    if (data.mfaEnabled === 'No') {
      risks.push("Missing multi-factor authentication");
    }
    if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
      risks.push("Frequent IT disruptions impacting business");
    }
    return risks.slice(0, 3); // Return top 3 risks
  };

  const getValueProposition = () => {
    const values = [];
    if (data.sensitiveData === 'Yes') {
      values.push("Enhanced data protection and compliance support");
    }
    if (data.internalIT === 'No') {
      values.push("Professional IT management and support");
    }
    if (data.itIssues === 'Daily' || data.itIssues === 'Weekly') {
      values.push("Reduced downtime and improved system reliability");
    }
    if (data.responseNeeded === 'Within minutes' || data.responseNeeded === 'Within an hour') {
      values.push("Rapid response IT support available 24/7");
    }
    return values;
  };

  const executiveSummary = {
    industryInsights,
    riskLevel: riskLevel,
    topRisks: getTopRisks(),
    recommendations: details.flatMap(d => d.recommendations),
    valueProposition: getValueProposition()
  };

  const { maxRiskPoints, maxValuePoints } = calculateMaxScores();

  return {
    total: totalRiskPoints,
    maxPossible: maxRiskPoints,
    valueScore: totalValuePoints,
    maxValuePossible: maxValuePoints,
    level: riskLevel,
    executiveSummary,
    details,
  };
}
