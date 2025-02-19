
import React from 'react';
import { motion } from 'framer-motion';
import { RiskScore } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface CategoryDetailsProps {
  assessment: RiskScore;
}

export function CategoryDetails({ assessment }: CategoryDetailsProps) {
  const renderRiskAndValueList = (category: string) => {
    const categoryData = assessment.details.find(detail => detail.category === category);
    if (!categoryData) return null;

    // Function to bold specific keywords in description
    const highlightDescription = (text: string) => {
      // Common keywords to bold based on industry terms
      const keywords = [
        'regulatory compliance', 'cyber threats', 'data protection', 
        'security measures', 'IT support', 'client trust',
        'operational efficiency', 'sensitive data', 'risk profile',
        'confidential', 'HIPAA', 'GDPR', 'FCA', 'PCI DSS'
      ];
      
      let highlightedText = text;
      keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<strong>$1</strong>');
      });
      
      return <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    };

    return (
      <div className="space-y-6 mt-4">
        {highlightDescription(categoryData.insights.description)}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="text-base font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 pb-2 border-b border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5" />
              Risk Areas
            </h5>
            <ul className="space-y-2">
              {categoryData.riskAreas.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                  <span className="mt-1">⚠️</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="text-base font-semibold text-green-600 dark:text-green-400 flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-800">
              <TrendingUp className="h-5 w-5" />
              Value Opportunities
            </h5>
            <ul className="space-y-2">
              {categoryData.valueAreas.map((value, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
                  <span className="mt-1">✅</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {assessment.details.map((detail, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + (index * 0.1) }}
        >
          <Card>
            <CardHeader className="border-b bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{detail.category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {renderRiskAndValueList(detail.category)}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
