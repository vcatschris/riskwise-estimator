
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecentAssessment } from './RecentAssessment';

export const AdminTools: React.FC = () => {
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showTools ? (
        <Card className="p-4 shadow-lg w-[400px] max-w-[90vw]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Admin Tools</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowTools(false)}>Close</Button>
          </div>
          
          <RecentAssessment />
        </Card>
      ) : (
        <Button 
          variant="outline" 
          className="rounded-full shadow-lg"
          onClick={() => setShowTools(true)}
        >
          Admin Tools
        </Button>
      )}
    </div>
  );
};
