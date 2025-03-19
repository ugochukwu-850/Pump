import React, { useCallback, useState } from "react";
import { Gauge, Clock, Activity, Droplets, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import ModernTimer from "./ModernTimer";
import { CalibrationData, EstimationData } from "../types";
import { formatTime } from "@/utils/formatTime";

interface EstimationScreenProps {
  calibrationData: CalibrationData;
  estimationData: EstimationData;
  setEstimationData: React.Dispatch<React.SetStateAction<EstimationData>>;
  onBackToWelcome: () => void;
}

const EstimationScreen: React.FC<EstimationScreenProps> = ({
  calibrationData,
  estimationData,
  setEstimationData,
  onBackToWelcome,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const calculateEstimation = useCallback(
    (currentTime: number | null) => {
      if (
        currentTime !== null &&
        currentTime > 0 &&
        calibrationData.containerFillTime &&
        calibrationData.emptyToFullTime
      ) {
        const fillRatio = currentTime / calibrationData.containerFillTime;
        const tankPercentageFull = Math.min(Math.max(100 / fillRatio, 0), 100);
        const remainingPercentage = 100 - tankPercentageFull;
        const estimatedTimeToFill =
          (remainingPercentage / 100) * calibrationData.emptyToFullTime;

        setEstimationData({
          currentContainerFillTime: currentTime,
          estimatedTimeToFill: estimatedTimeToFill > 0 ? estimatedTimeToFill : 0,
          tankPercentageFull,
        });

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      } else {
        setEstimationData({
          currentContainerFillTime: currentTime,
          estimatedTimeToFill: null,
          tankPercentageFull: null,
        });
      }
    },
    [calibrationData, setEstimationData]
  );

  const handleCurrentContainerFillTimeUpdate = (time: number | null) =>
    calculateEstimation(time);

  return (
    <div className="h-full min-w-full bg-gray-950 text-blue-50 flex flex-col">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 opacity-70" />

      {/* Fluid animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/3 -left-12 w-40 h-40 rounded-full bg-blue-400/5 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 pb-2 flex flex-row space-x-2 justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToWelcome}
            className="rounded-full text-blue-300 hover:text-blue-200 hover:bg-blue-900/30"
          >
            <Home size={20} />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-blue-50">
            Tank <span className="text-blue-400">Estimation</span>
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 text-sm sm:text-base"
          >
            {showDetails ? "Hide" : "Details"}
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 px-4 sm:px-6 overflow-y-auto pb-6">
          {/* Tank visualization */}
          <div className="pt-4 pb-6">
            <div className="relative w-48 sm:w-64 mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full filter blur-xl transform scale-150" />
                <div className="aspect-square rounded-full border-2 border-blue-400/20 p-4 bg-gray-900/40 backdrop-blur-sm relative overflow-hidden">
                  <div className="aspect-square w-full rounded-full border border-blue-300/30 relative overflow-hidden flex items-end justify-center">
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000"
                      initial={{ height: "0%" }}
                      animate={{
                        height: `${estimationData.tankPercentageFull || 0}%`,
                        y: isAnimating ? [2, -2, 2] : 0,
                      }}
                      transition={{
                        height: { duration: 1, ease: "easeOut" },
                        y: { duration: 0.3, repeat: 3, repeatType: "mirror" },
                      }}
                    >
                      <div className="absolute inset-x-0 top-0 h-4 bg-blue-300/20 rounded-full transform -translate-y-1/2 animate-pulse" />
                      <div className="absolute inset-x-0 top-0 h-3 bg-blue-300/30 rounded-full transform -translate-y-2/3 animate-pulse" style={{ animationDelay: "0.7s" }} />
                      <div className="absolute bottom-4 left-1/4 w-1 h-1 rounded-full bg-blue-200/40 animate-ping" style={{ animationDuration: "1.8s" }} />
                      <div className="absolute bottom-6 left-2/3 w-2 h-2 rounded-full bg-blue-200/30 animate-ping" style={{ animationDuration: "2.3s" }} />
                      <div className="absolute bottom-10 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-200/50 animate-ping" style={{ animationDuration: "1.5s" }} />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-3xl sm:text-4xl font-bold text-blue-50/80 drop-shadow-lg backdrop-blur-sm bg-blue-900/10 px-4 py-1 rounded-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: isAnimating ? [1, 1.1, 1] : 1,
                          opacity: 1,
                        }}
                        transition={{
                          scale: { duration: 0.5 },
                          opacity: { duration: 0.3 },
                        }}
                      >
                        {estimationData.tankPercentageFull?.toFixed(1) || 0}%
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                      <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                        <span className="absolute -right-6 sm:-right-8 -top-2.5 text-xs text-blue-400/70">100%</span>
                      </div>
                      <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                        <span className="absolute -right-5 sm:-right-6 -top-2.5 text-xs text-blue-400/70">75%</span>
                      </div>
                      <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                        <span className="absolute -right-5 sm:-right-6 -top-2.5 text-xs text-blue-400/70">50%</span>
                      </div>
                      <div className="border-t border-dashed border-blue-400/20 h-0 relative">
                        <span className="absolute -right-5 sm:-right-6 -top-2.5 text-xs text-blue-400/70">25%</span>
                      </div>
                      <div className="border-t border-blue-400/20 h-0 relative">
                        <span className="absolute -right-5 sm:-right-6 -top-2.5 text-xs text-blue-400/70">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-blue-500/20 filter blur-lg rounded-full"
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />
                <div className="text-center mt-8">
                  <p className="text-blue-400 text-sm sm:text-base">Tank Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/20 shadow-lg overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-blue-900/50">
                      <Clock size={16} className="text-blue-400" />
                    </div>
                    <span className="text-sm sm:text-base text-blue-200">Time to Fill</span>
                  </div>
                  <motion.div
                    className="text-xl sm:text-2xl font-semibold text-blue-50 mt-1"
                    animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {formatTime(estimationData.estimatedTimeToFill)}
                  </motion.div>
                </CardContent>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/20 shadow-lg overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-blue-900/50">
                      <Droplets size={16} className="text-blue-400" />
                    </div>
                    <span className="text-sm sm:text-base text-blue-200">Current Fill</span>
                  </div>
                  <motion.div
                    className="text-xl sm:text-2xl font-semibold text-blue-50 mt-1"
                    animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {formatTime(estimationData.currentContainerFillTime)}
                  </motion.div>
                </CardContent>
                <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-500" />
              </Card>
            </motion.div>
          </div>

          {/* Details Panel (Conditional) */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-4"
              >
                <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-blue-500/10 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="text-blue-400 text-sm sm:text-base font-medium mb-3">Calibration Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-blue-100/70">Container Fill Time</p>
                        <p className="text-sm sm:text-base font-medium text-blue-50 flex items-center gap-1">
                          <Clock size={14} className="text-blue-400" />
                          {formatTime(calibrationData.containerFillTime || 0)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-blue-100/70">Empty to Full Time</p>
                        <p className="text-sm sm:text-base font-medium text-blue-50 flex items-center gap-1">
                          <Activity size={14} className="text-blue-400" />
                          {formatTime(calibrationData.emptyToFullTime || 0)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-blue-100/70">Flow Rate</p>
                        <p className="text-sm sm:text-base font-medium text-blue-50 flex items-center gap-1">
                          <Droplets size={14} className="text-blue-400" />
                          {calibrationData.containerVolume
                            ? `${(calibrationData.containerVolume / (calibrationData.containerFillTime || 1) * 60).toFixed(1)} L/min`
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-blue-100/70">Container Volume</p>
                        <p className="text-sm sm:text-base font-medium text-blue-50 flex items-center gap-1">
                          <Gauge size={14} className="text-blue-400" />
                          {calibrationData.containerVolume
                            ? `${calibrationData.containerVolume.toFixed(1)} L`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timer component */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/80 to-blue-950/40 border border-blue-500/20 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-blue-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-blue-50">Measure Container Fill</h2>
                </div>
                <ModernTimer
                  label="Current Fill Time"
                  onTimeUpdate={handleCurrentContainerFillTimeUpdate}
                  initialTime={estimationData.currentContainerFillTime}
                  description="Time how long it takes to fill your test container now."
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EstimationScreen;