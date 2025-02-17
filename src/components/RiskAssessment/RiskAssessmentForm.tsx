import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export function RiskAssessmentForm() {
  const [employees, setEmployees] = useState<number>(5);
  const [servers, setServers] = useState<number>(1);
  const [devices, setDevices] = useState<number>(10);
  const [riskLevel, setRiskLevel] = useState<string>("medium");

  const estimateRef = useRef<HTMLDivElement>(null);

  const scrollToEstimate = () => {
    estimateRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderResults = () => {
    const employeeCost = employees * 15;
    const serverCost = servers * 50;
    const deviceCost = devices * 5;
    const riskMultiplier =
      riskLevel === "low" ? 0.8 : riskLevel === "high" ? 1.2 : 1;
    const totalCost = (employeeCost + serverCost + deviceCost) * riskMultiplier;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col items-center gap-4 mb-12 px-4 sm:px-0">
          <Button
            onClick={scrollToEstimate}
            size="lg"
            className="w-full sm:max-w-md flex items-center gap-2 text-base sm:text-lg py-4 sm:py-6"
          >
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            Show Estimate (£)
          </Button>
          <p className="text-muted-foreground text-xs sm:text-sm text-center">
            How much should the IT support you need roughly cost
          </p>
        </div>

        <div ref={estimateRef} className="scroll-mt-20">
          <Card>
            <CardHeader>
              <CardTitle>Your Estimate</CardTitle>
              <CardDescription>
                Based on your selections, here is your estimated monthly cost:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div className="flex gap-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    type="number"
                    id="employees"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="servers">Number of Servers</Label>
                  <Input
                    type="number"
                    id="servers"
                    value={servers}
                    onChange={(e) => setServers(Number(e.target.value))}
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="devices">Number of Devices</Label>
                  <Input
                    type="number"
                    id="devices"
                    value={devices}
                    onChange={(e) => setDevices(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Risk Level</Label>
                  <Select onValueChange={setRiskLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p>Employee Cost: £{employeeCost}</p>
                  <p>Server Cost: £{serverCost}</p>
                  <p>Device Cost: £{deviceCost}</p>
                  <p>Risk Multiplier: {riskMultiplier}</p>
                  <h2>Total Estimated Cost: £{totalCost.toFixed(2)}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container grid w-full gap-6 pb-8 pt-6 md:pt-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          IT Support Cost Calculator
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Estimate your monthly IT support costs based on your business needs.
        </p>
      </div>
      {renderResults()}
    </div>
  );
}
