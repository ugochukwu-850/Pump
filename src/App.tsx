import React, { useEffect, useState } from "react";
import "./App.css";
import WelcomeScreen from "./components/WelcomeScreen";
import CalibrationScreen from "./components/CalibrationScreen";
import EstimationScreen from "./components/EstimationScreen";
import { CalibrationData, EstimationData } from "./types";
import { load } from "@tauri-apps/plugin-store";

const App: React.FC = () => {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showEstimation, setShowEstimation] = useState(false);
  const [calibrationData, setCalibrationData] = useState<CalibrationData>({
    emptyToFullTime: null,
    containerFillTime: null,
    containerVolume: null,
  });

  const [estimationData, setEstimationData] = useState<EstimationData>({
    currentContainerFillTime: null,
    estimatedTimeToFill: null,
    tankPercentageFull: null,
  });

  const handleStartCalibration = () => {
    setShowWelcome(false);
    setShowCalibration(true);
    setShowEstimation(false);
  };

  const handleStartEstimation = () => {
    setShowWelcome(false);
    setShowCalibration(false);
    setShowEstimation(true);
  };

  const handleCalibrationComplete = () => {
    setIsCalibrated(true);
    setShowWelcome(true);
    setShowCalibration(false);
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setShowCalibration(false);
    setShowEstimation(false);
  };


  // Initialize Tauri Store

  // Load stored calibration data on component mount
  useEffect(() => {

    const loadCalibrationData = async () => {
      const store = await load("calibration-data.json", { autoSave: true });

      try {
        // Get stored data
        const storedData = await store.get<CalibrationData>("calibration");

        if (storedData) {
          setCalibrationData(storedData);
          // If all calibration values exist, set isCalibrated to true
          if (
            storedData.emptyToFullTime !== null &&
            storedData.containerFillTime !== null &&
            storedData.containerVolume !== null
          ) {
            setIsCalibrated(true);
          }
        }
      } catch (error) {
        console.log("Failed to load calibration data:", error);
      }
    };

    loadCalibrationData();
  }, []); // Empty dependency array means this runs once on mount

  // Save calibration data whenever it changes
  useEffect(() => {
    const saveCalibrationData = async () => {
      try {
        const store = await load("calibration-data.json", { autoSave: true });

        await store.set("calibration", calibrationData);
        await store.save(); // Persist changes to disk

        // Update isCalibrated status based on complete data
        setIsCalibrated(
          calibrationData.emptyToFullTime !== null &&
          calibrationData.containerFillTime !== null &&
          calibrationData.containerVolume !== null
        );
      } catch (error) {
        console.log("Failed to save calibration data:", error);
      }
    };

    saveCalibrationData();
  }, [calibrationData]); // Runs whenever calibrationData changes


  return (
    <div className="h-screen overflow-scroll min-w-screen">
      {showWelcome && (
        <WelcomeScreen
          onStartCalibration={handleStartCalibration}
          onStartEstimation={handleStartEstimation}
          isCalibrated={isCalibrated}
        />
      )}
      {showCalibration && (
        <CalibrationScreen
          calibrationData={calibrationData}
          setCalibrationData={setCalibrationData}
          onComplete={handleCalibrationComplete}
          onBackToWelcome={handleBackToWelcome}
        />
      )}
      {showEstimation && (
        <EstimationScreen
          calibrationData={calibrationData}
          estimationData={estimationData}
          setEstimationData={setEstimationData}
          onBackToWelcome={handleBackToWelcome}
        />
      )}
    </div>
  );
};

export default App;