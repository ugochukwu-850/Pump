import React, { useState } from "react";
import { Settings, Gauge, Info, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStartCalibration: () => void;
  onStartEstimation: () => void;
  isCalibrated: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartCalibration,
  onStartEstimation,
  isCalibrated,
}) => {
  const [showSteps, setShowSteps] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Fill Time",
      description: "Start with an empty tank and measure how long it takes to fill it completely using a stopwatch or timer.",
      icon: "⏱️",
    },
    {
      title: "Container Test",
      description: "Take a container with a known volume and fill it from your full tank, timing how long it takes.",
      icon: "📏",
    },
    {
      title: "Container Size",
      description: "Enter the exact volume of your test container—like 5 liters or 1 gallon—to set up the calculation.",
      icon: "🪣",
    },
    {
      title: "Estimate",
      description: "Anytime, fill your container again and use the time to estimate your tank’s current water level instantly.",
      icon: "📊",
    },
  ];

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-950 text-blue-50 flex flex-col">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 opacity-70 h-full" />

      {/* Fluid animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/3 -left-12 w-40 h-40 rounded-full bg-blue-400/5 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col">
        {showSteps ? (
          <div className="flex flex-col h-full">
            {/* Steps view header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-6 sm:pt-12 pb-4">
              <button
                onClick={() => setShowSteps(false)}
                className="flex items-center text-blue-300 hover:text-blue-100 transition-colors"
              >
                <ChevronLeft size={20} className="mr-1" />
                <span>Back</span>
              </button>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-50 tracking-tight">How It Works</h2>
              <div className="w-16" /> {/* Spacer */}
            </div>

            {/* Steps Section */}
            <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
              {/* Step Indicators */}
              <div className="flex justify-center gap-4 sm:gap-6 mb-8">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 ${
                        activeStep === index
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40"
                          : index < activeStep
                          ? "bg-blue-700 text-blue-200"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Step Content */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-gray-900/70 backdrop-blur-lg rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-between shadow-xl border border-blue-600/20"
              >
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-500/10 to-transparent" />
                <div className="relative z-10 w-16 sm:w-24 h-16 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-6xl mb-6 bg-blue-600/10 border border-blue-500/30 shadow-md">
                  {steps[activeStep].icon}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div className="text-center z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-300 mb-4 tracking-wide drop-shadow-md">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-md font-light">
                    {steps[activeStep].description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between w-full mt-8 z-10 gap-4">
                  {activeStep > 0 && (
                    <Button
                      onClick={prevStep}
                      className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-blue-200 rounded-xl text-base sm:text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center group"
                    >
                      <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={activeStep < steps.length - 1 ? nextStep : onStartCalibration}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-base sm:text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center group"
                  >
                    {activeStep < steps.length - 1 ? (
                      <>
                        Next
                        <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        Start Calibration
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Hero section */}
            <div className="flex-1 px-4 sm:px-6 pt-6 sm:pt-12 flex flex-col">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-blue-50">
                  Water Tank <span className="text-blue-400">Wizard</span>
                </h1>
                <p className="text-xs sm:text-sm text-blue-300/80">
                  Smart water level estimation for your tanks
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-64 mx-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-full filter blur-xl transform scale-150" />
                    <div className="aspect-square rounded-full border-2 border-blue-400/20 p-4 bg-gray-900/40 backdrop-blur-sm relative overflow-hidden">
                      <div className="aspect-square w-full rounded-full border border-blue-300/30 relative overflow-hidden flex items-end justify-center">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000"
                          style={{ height: "65%" }}
                        >
                          <div className="absolute inset-x-0 top-0 h-4 bg-blue-300/20 rounded-full transform -translate-y-1/2 animate-pulse" />
                          <div className="absolute inset-x-0 top-0 h-3 bg-blue-300/30 rounded-full transform -translate-y-2/3 animate-pulse" style={{ animationDelay: "0.7s" }} />
                          <div className="absolute bottom-4 left-1/4 w-1 h-1 rounded-full bg-blue-200/40 animate-ping" style={{ animationDuration: "1.8s" }} />
                          <div className="absolute bottom-6 left-2/3 w-2 h-2 rounded-full bg-blue-200/30 animate-ping" style={{ animationDuration: "2.3s" }} />
                          <div className="absolute bottom-10 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-200/50 animate-ping" style={{ animationDuration: "1.5s" }} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-2xl sm:text-4xl font-bold text-blue-50/80 drop-shadow-lg backdrop-blur-sm bg-blue-900/10 px-2 sm:px-4 py-1 rounded-full">
                            65%
                          </div>
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                          <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                            <span className="absolute -right-8 -top-2.5 text-xs text-blue-400/70">100%</span>
                          </div>
                          <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                            <span className="absolute -right-6 -top-2.5 text-xs text-blue-400/70">75%</span>
                          </div>
                          <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                            <span className="absolute -right-6 -top-2.5 text-xs text-blue-400/70">50%</span>
                          </div>
                          <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                            <span className="absolute -right-6 -top-2.5 text-xs text-blue-400/70">25%</span>
                          </div>
                          <div className="border-t border-blue-400/20 h-0 relative">
                            <span className="absolute -right-6 -top-2.5 text-xs text-blue-400/70">0%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <div className="text-xl sm:text-2xl bg-blue-600/20 backdrop-blur-sm p-2 rounded-full border border-blue-400/30 shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
                        💧
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-blue-500/20 filter blur-lg rounded-full" />
                  <div className="text-center mt-6">
                    <p className="text-blue-400 text-xs sm:text-sm">Estimated Level</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action section */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                <Button
                  onClick={onStartCalibration}
                  className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl font-medium shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center group"
                >
                  <Settings size={20} className="mr-2 group-hover:rotate-90 transition-transform" />
                  <span>Calibrate</span>
                </Button>
                <Button
                  onClick={onStartEstimation}
                  disabled={!isCalibrated}
                  className={`w-full py-2 sm:py-3 rounded-xl font-medium shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center group ${
                    isCalibrated
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Gauge size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                  <span>Estimate</span>
                </Button>
              </div>
              <Button
                onClick={() => setShowSteps(true)}
                variant="ghost"
                className="w-full py-2 sm:py-3 px-4 text-blue-300 hover:text-blue-100 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
              >
                <Info size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                <span>How It Works</span>
              </Button>
              <Button
                onClick={onStartCalibration}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-base sm:text-lg font-medium shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center group"
              >
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {!isCalibrated && (
                <p className="text-xs text-blue-400/60 text-center mt-2">
                  Calibrate your tank first to enable estimation
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;