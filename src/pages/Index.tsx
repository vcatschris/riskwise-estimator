
import { RiskAssessmentForm } from "@/components/RiskAssessment/RiskAssessmentForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            IT Risk Assessment
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
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
