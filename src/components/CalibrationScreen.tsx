import React, { useState } from "react";
import {  ChevronLeft, ChevronRight, CheckCircle, Droplet, Clock, Beaker, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ModernTimer from "./ModernTimer";
import { CalibrationData } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface CalibrationScreenProps {
  calibrationData: CalibrationData;
  setCalibrationData: React.Dispatch<React.SetStateAction<CalibrationData>>;
  onComplete: () => void;
  onBackToWelcome: () => void;
}

const CalibrationScreen: React.FC<CalibrationScreenProps> = ({
  calibrationData,
  setCalibrationData,
  onComplete,
  onBackToWelcome,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [showCustomVolume, setShowCustomVolume] = useState(false);
  const [customVolumeInput, setCustomVolumeInput] = useState("");

  const handleEmptyToFullTimeUpdate = (time: number | null) =>
    setCalibrationData((prev) => ({ ...prev, emptyToFullTime: time }));

  const handleContainerFillTimeUpdate = (time: number | null) =>
    setCalibrationData((prev) => ({ ...prev, containerFillTime: time }));

  const handleVolumeChange = (value: number) =>
    setCalibrationData((prev) => ({ ...prev, containerVolume: value }));

  const goToNextStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setAnimating(false);
    }, 300);
  };

  const goToPreviousStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setAnimating(false);
    }, 300);
  };

  const handleCustomVolumeSubmit = () => {
    const volume = parseFloat(customVolumeInput);
    if (!isNaN(volume) && volume > 0) {
      handleVolumeChange(volume);
    }
    setShowCustomVolume(false);
    setCustomVolumeInput("");
  };

  const isStep1Complete = calibrationData.emptyToFullTime !== null && calibrationData.emptyToFullTime > 0;
  const isStep2Complete = calibrationData.containerFillTime !== null && calibrationData.containerFillTime > 0;
  const isStep3Complete = calibrationData.containerVolume !== null && calibrationData.containerVolume > 0;

  const completionPercentage = (((isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0) + (isStep3Complete ? 1 : 0)) / 3) * 100;

  const steps = [
    {
      icon: <Droplet className="text-blue-400" size={24} />,
      title: "Empty Tank Fill Time",
      description: "Record how long it takes to fill your empty tank completely",
      content: (
        <ModernTimer
          label="Empty to Full Time"
          onTimeUpdate={handleEmptyToFullTimeUpdate}
          initialTime={calibrationData.emptyToFullTime}
          description="Start the timer when filling begins, stop when tank is completely full"
        />
      ),
      isComplete: isStep1Complete,
    },
    {
      icon: <Clock className="text-blue-400" size={24} />,
      title: "Container Fill Time",
      description: "Measure the time required to fill a container of known volume",
      content: (
        <ModernTimer
          label="Container Fill Time"
          onTimeUpdate={handleContainerFillTimeUpdate}
          initialTime={calibrationData.containerFillTime}
          description="Use a container with clearly marked measurements for accuracy"
        />
      ),
      isComplete: isStep2Complete,
    },
    {
      icon: <Beaker className="text-blue-400" size={24} />,
      title: "Container Volume",
      description: "Specify the exact volume of your measurement container",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Label className="text-gray-300 text-lg">Container Volume</Label>
            <div onClick={() => setShowCustomVolume(true)} className="bg-gray-700 px-4 py-2 rounded-md">
              <span className="text-2xl font-semibold text-blue-400">
                {calibrationData.containerVolume?.toFixed(1) || "0.0"}
              </span>
              <span className="text-lg ml-1 text-gray-300">L</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 5, 10, 15, 20].map((vol) => (
              <Button
                key={vol}
                onClick={() => handleVolumeChange(vol)}
                className={`py-3 rounded-lg transition-all duration-200 ${
                  calibrationData.containerVolume === vol
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {vol} Liter{vol !== 1 ? "s" : ""}
              </Button>
            ))}
          </div>
        </div>
      ),
      isComplete: isStep3Complete,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={onBackToWelcome}
          className="text-gray-300 hover:text-white hover:bg-gray-800 flex gap-2 text-sm sm:text-base"
        >
          <ChevronLeft size={20} /> Back to Welcome
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Calibration Progress</span>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-blue-400 font-medium text-sm">{Math.round(completionPercentage)}%</span>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-xl overflow-hidden w-full max-w-3xl mx-auto">
        <CardHeader className="border-b border-gray-700 bg-gray-850 pb-4">
          <div className="flex gap-2 mb-4">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i + 1 < currentStep ? "bg-blue-500" : i + 1 === currentStep ? "bg-blue-600" : "bg-gray-600"
                  }`}
                />
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    i + 1 < currentStep
                      ? "bg-blue-500 text-white"
                      : i + 1 === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {steps[currentStep - 1].icon}
            <div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-white">
                {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">{steps[currentStep - 1].description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: animating ? 0 : 1, y: animating ? 20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep - 1].content}
          </motion.div>
        </CardContent>

        <CardFooter className="flex justify-between p-4 sm:p-6 border-t border-gray-700 bg-gray-850">
          <div>
            {currentStep > 1 ? (
              <Button
                onClick={goToPreviousStep}
                className="bg-gray-700 text-white hover:bg-gray-600 py-2 px-4 rounded-lg text-sm sm:text-base"
              >
                <ChevronLeft size={20} className="mr-1" /> Previous
              </Button>
            ) : (
              <div></div>
            )}
          </div>

          <Button
            onClick={currentStep === 3 ? onComplete : goToNextStep}
            disabled={!steps[currentStep - 1].isComplete}
            className={`py-2 px-6 rounded-lg transition-all duration-200 text-sm sm:text-base ${
              steps[currentStep - 1].isComplete
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-900/30"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === 3 ? (
              <>
                <CheckCircle size={20} className="mr-2" /> Complete Calibration
              </>
            ) : (
              <>
                Continue <ChevronRight size={20} className="ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center mt-4">
        <p className="text-gray-500 text-sm">
          Step {currentStep} of 3 • {steps[currentStep - 1].isComplete ? "Completed" : "Incomplete"}
        </p>
      </div>

      {/* Custom Volume Modal */}
      <AnimatePresence>
        {showCustomVolume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700 mx-4 sm:mx-0"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Custom Container Volume</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowCustomVolume(false)}
                  className="text-gray-300 hover:text-white"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="number"
                    value={customVolumeInput}
                    onChange={(e) => setCustomVolumeInput(e.target.value)}
                    placeholder="Enter volume in liters"
                    className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 pr-12 text-base"
                    step="0.1"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">L</span>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCustomVolume(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCustomVolumeSubmit}
                    disabled={!customVolumeInput || parseFloat(customVolumeInput) <= 0}
                    className="bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-500 hover:to-blue-400 text-sm sm:text-base"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalibrationScreen;