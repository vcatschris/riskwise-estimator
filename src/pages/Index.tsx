
import { RiskAssessmentForm } from "@/components/RiskAssessment/RiskAssessmentForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/f724b08e-c8db-4821-97cb-9bc3354753fa.png" 
            alt="Support Stack" 
            className="h-20 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            IT Risk Assessment
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Evaluate your business's IT security posture and get personalized recommendations
            for improvement.
          </p>
        </div>
        <RiskAssessmentForm />
      </div>
    </div>
  );
};

export default Index;
