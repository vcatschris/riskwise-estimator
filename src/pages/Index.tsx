
import { RiskAssessmentForm } from "@/components/RiskAssessment/RiskAssessmentForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/f724b08e-c8db-4821-97cb-9bc3354753fa.png" 
            alt="Support Stack" 
            className="h-16 sm:h-20 mx-auto mb-6 sm:mb-8"
          />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white md:text-5xl">
            How Resilient is Your IT Setup?
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Take our no-pressure assessment to understand your IT security posture and get personalised recommendations. 
            View your results instantly - no sales calls unless you specifically request them.
          </p>
        </div>
        <div className="w-full max-w-[1200px] mx-auto">
          <RiskAssessmentForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
