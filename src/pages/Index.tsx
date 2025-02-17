
import { RiskAssessmentForm } from "@/components/RiskAssessment/RiskAssessmentForm";
import { ShieldCheck, Network, Search, Zap, Activity, CheckCheck } from "lucide-react";

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
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto mt-8">
            <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-secondary/50 rounded-lg">
              <div className="rounded-full bg-blue-500/10 p-2 sm:p-3">
                <Search className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-white text-sm sm:text-base">Discover Risks</h3>
              <p className="text-xs sm:text-sm text-gray-400 text-center">
                Get a clear view of your IT vulnerabilities
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-secondary/50 rounded-lg">
              <div className="rounded-full bg-green-500/10 p-2 sm:p-3">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-white text-sm sm:text-base">Measure Resilience</h3>
              <p className="text-xs sm:text-sm text-gray-400 text-center">
                See how your setup compares to industry standards
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-secondary/50 rounded-lg col-span-2 md:col-span-1">
              <div className="rounded-full bg-purple-500/10 p-2 sm:p-3">
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-white text-sm sm:text-base">Get Solutions</h3>
              <p className="text-xs sm:text-sm text-gray-400 text-center">
                Receive actionable recommendations
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1200px] mx-auto">
          <RiskAssessmentForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
