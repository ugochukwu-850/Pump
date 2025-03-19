export interface CalibrationData {
  emptyToFullTime: number | null;
  containerFillTime: number | null;
  containerVolume: number | null;
}

export interface EstimationData {
  currentContainerFillTime: number | null;
  estimatedTimeToFill: number | null;
  tankPercentageFull: number | null;
}


export interface WelcomeScreenProps {
  onStartCalibration: () => void;
  onStartEstimation: () => void;
  isCalibrated: boolean;
}