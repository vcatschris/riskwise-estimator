
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRiskAssessmentContext } from '../hooks/RiskAssessmentContext';
import { getRecentAssessment } from '../hooks/database/useAssessmentStorage';

export const RecentAssessment: React.FC = () => {
  const [recentAssessment, setRecentAssessment] = React.useState<any>(null);
  const [loadingRecent, setLoadingRecent] = React.useState(false);

  const fetchRecentAssessment = async () => {
    setLoadingRecent(true);
    try {
      const data = await getRecentAssessment();
      setRecentAssessment(data);
      console.log('Recent assessment data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching recent assessment:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  React.useEffect(() => {
    // Automatically fetch on component mount
    fetchRecentAssessment();
  }, []);

  if (loadingRecent) {
    return (
      <Card className="p-4 my-4">
        <p className="text-center">Loading recent assessment data...</p>
      </Card>
    );
  }

  if (!recentAssessment) {
    return (
      <Card className="p-4 my-4">
        <p className="text-center">No recent assessments found.</p>
        <div className="flex justify-center mt-2">
          <Button variant="outline" onClick={fetchRecentAssessment}>
            Check Again
          </Button>
        </div>
      </Card>
    );
  }

  const { survey, details } = recentAssessment;

  return (
    <Card className="p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">Most Recent Assessment</h3>
      <div className="space-y-2">
        <p><strong>Date:</strong> {survey.created_at_formatted}</p>
        <p><strong>Business:</strong> {survey.business_name}</p>
        <p><strong>Email:</strong> {survey.email}</p>
        <p><strong>Risk Level:</strong> <span className={`font-semibold ${
          survey.risk_level === 'High' ? 'text-red-500' : 
          survey.risk_level === 'Medium' ? 'text-yellow-500' : 
          'text-green-500'
        }`}>{survey.risk_level}</span></p>
        <p><strong>Risk Score:</strong> {survey.risk_score} / {survey.max_possible_score}</p>
        <p><strong>Value Score:</strong> {survey.value_score} / {survey.max_value_possible}</p>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={fetchRecentAssessment}>
          Refresh
        </Button>
      </div>
    </Card>
  );
};
