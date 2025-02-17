
import { RiskAssessmentForm } from "@/components/RiskAssessment/RiskAssessmentForm";
import { ShieldCheck, Network, Search, Zap, Activity, CheckCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8"> {/* Changed from default width to max-w-7xl */}
        <div className="text-center">
          <img 
            src="/lovable-uploads/f724b08e-c8db-4821-97cb-9bc3354753fa.png" 
            alt="Support Stack" 
            className="h-20 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How Resilient is Your IT Setup?
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Take our no-pressure assessment to understand your IT security posture and get personalized recommendations. 
            View your results instantly - no sales calls unless you specifically request them.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-white">Discover Risks</h3>
              <p className="text-sm text-gray-400 text-center">
                Get a clear view of your IT vulnerabilities
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-white">Measure Resilience</h3>
              <p className="text-sm text-gray-400 text-center">
                See how your setup compares to industry standards
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="rounded-full bg-purple-500/10 p-3">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-white">Get Solutions</h3>
              <p className="text-sm text-gray-400 text-center">
                Receive actionable recommendations
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1200px] mx-auto"> {/* Added wider container for the form */}
          <RiskAssessmentForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
