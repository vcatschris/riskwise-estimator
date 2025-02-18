
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentData, RiskScore } from '../../types';
import { ScoreSection } from './ScoreSection';
import { ExecutiveSummary } from './ExecutiveSummary';
import { CategoryDetails } from './CategoryDetails';
import { CostEstimate } from './CostEstimate';
import { calculatePricing } from '../../calculatePricing';
import { FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface ResultsStepProps {
  assessment: RiskScore;
  formData: Partial<AssessmentData>;
  showEstimate: boolean;
  setShowEstimate: (show: boolean) => void;
}

export function ResultsStep({ assessment, formData, showEstimate, setShowEstimate }: ResultsStepProps) {
  const handlePDFDownload = async () => {
    const reportElement = document.getElementById('risk-report');
    if (!reportElement) return;

    try {
      toast.loading('Generating PDF...');
      const canvas = await html2canvas(reportElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`IT_Risk_Assessment_${formData.businessName?.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const costs = calculatePricing(formData as AssessmentData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col items-center gap-4 mb-12 px-4 sm:px-0">
        <Button
          onClick={() => setShowEstimate(true)}
          size="lg"
          className="w-full sm:max-w-md flex items-center gap-2 text-base sm:text-lg py-4 sm:py-6 whitespace-normal text-center"
        >
          📊 IT Investment Benchmark (£)
        </Button>
        <p className="text-muted-foreground text-xs sm:text-sm text-center font-bold">
          How much do businesses like yours typically invest in IT support?
        </p>
      </div>

      {showEstimate && (
        <CostEstimate 
          costs={costs} 
          formData={formData} 
        />
      )}

      <div className="flex justify-end">
        <Button
          onClick={handlePDFDownload}
          variant="secondary"
          size="lg"
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Save as PDF
        </Button>
      </div>

      <div id="risk-report">
        <ScoreSection assessment={assessment} />
        <ExecutiveSummary assessment={assessment} />
        <CategoryDetails assessment={assessment} />
      </div>
    </motion.div>
  );
}
