import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Timer, Edit, Clock, Check, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "@/utils/formatTime";

interface ModernTimerProps {
  label: string;
  onTimeUpdate: (timeInSeconds: number | null) => void;
  initialTime?: number | null;
  description?: string;
}

interface TimeWheelProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  format?: (value: number) => string;
}

const TimeWheel: React.FC<TimeWheelProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  format = (value) => String(value).padStart(2, "0"),
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTop = useRef<number>(0);
  const itemHeight = 56; // Height of each item
  const visibleItems = 3; // Number of visible items in the wheel
  const halfVisibleItems = Math.floor(visibleItems / 2); // 1

  const values: number[] = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  // Center the selected value on mount or value change
  useEffect(() => {
    if (scrollRef.current) {
      const index = values.indexOf(value);
      if (index !== -1) {
        // Center the selected item by adjusting scrollTop
        const targetScrollTop = index * itemHeight - (visibleItems * itemHeight) / 2 + itemHeight / 2;
        scrollRef.current.scrollTop = targetScrollTop;
        lastScrollTop.current = targetScrollTop;
      }
    }
  }, [value, values]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const index = Math.round((scrollTop + (visibleItems * itemHeight) / 2 - itemHeight / 2) / itemHeight);
    const boundedIndex = Math.max(0, Math.min(values.length - 1, index));
    const newValue = values[boundedIndex];
    if (newValue !== value) {
      onChange(newValue);
      lastScrollTop.current = boundedIndex * itemHeight - (visibleItems * itemHeight) / 2 + itemHeight / 2;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || !scrollRef.current) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartY.current - touchY;
    scrollRef.current.scrollTop += diff;
    touchStartY.current = touchY;
    handleScroll();
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round((scrollTop + (visibleItems * itemHeight) / 2 - itemHeight / 2) / itemHeight);
      const boundedIndex = Math.max(0, Math.min(values.length - 1, index));
      scrollRef.current.scrollTop = boundedIndex * itemHeight - (visibleItems * itemHeight) / 2 + itemHeight / 2;
    }
  };

  const increaseValue = () => {
    const index = values.indexOf(value);
    if (index < values.length - 1) onChange(values[index + 1]);
  };

  const decreaseValue = () => {
    const index = values.indexOf(value);
    if (index > 0) onChange(values[index - 1]);
  };

  const wheelHeight = itemHeight * visibleItems;

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={increaseValue}
        className="text-gray-300 hover:text-white p-1.5 bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-full mb-2 shadow-md z-10 transition-all duration-200"
      >
        <ChevronUp size={16} />
      </motion.button>
      <div
        className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-inner sm:w-20 w-16"
        style={{ height: `${wheelHeight}px` }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0) 25%, rgba(17, 24, 39, 0) 75%, rgba(17, 24, 39, 0.95) 100%)",
          }}
        />
        <div className="absolute left-2 right-2 h-12 top-1/2 -mt-6 bg-gradient-to-b from-blue-500/10 to-blue-500/20 border border-blue-500/30 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-scroll"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "y mandatory",
          }}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ height: `${halfVisibleItems * itemHeight}px` }} />
          {values.map((val) => (
            <div
              key={val}
              className="flex items-center justify-center select-none transition-all duration-200 ease-in-out cursor-pointer"
              style={{ height: `${itemHeight}px`, scrollSnapAlign: "center" }}
              onClick={() => onChange(val)}
            >
              <motion.span
                className={`font-mono transition-all duration-200 ${
                  val === value
                    ? "text-blue-400 text-xl font-bold scale-110 drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]"
                    : "text-gray-500 text-lg opacity-70"
                }`}
                animate={val === value ? { scale: 1.1 } : { scale: 1 }}
              >
                {format(val)}
              </motion.span>
            </div>
          ))}
          <div style={{ height: `${halfVisibleItems * itemHeight}px` }} />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={decreaseValue}
        className="text-gray-300 hover:text-white p-1.5 bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-full mt-2 shadow-md z-10 transition-all duration-200"
      >
        <ChevronDown size={16} />
      </motion.button>
      <label className="text-xs sm:text-sm text-gray-400 mt-1 font-medium uppercase tracking-wide">{label}</label>
    </div>
  );
};

const ModernTimer: React.FC<ModernTimerProps> = ({ label, onTimeUpdate, initialTime, description }) => {
  const [mode, setMode] = useState<"stopwatch" | "manual">("stopwatch");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(initialTime ? initialTime * 1000 : 0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (initialTime !== null && initialTime !== undefined) {
      const hrs = Math.floor(initialTime / 3600);
      const mins = Math.floor((initialTime % 3600) / 60);
      const secs = Math.floor(initialTime % 60);
      setHours(hrs);
      setMinutes(mins);
      setSeconds(secs);
      setElapsedTime(initialTime * 1000);
    }
  }, [initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      const startTime = Date.now() - elapsedTime;
      interval = setInterval(() => {
        const currentElapsed = Date.now() - startTime;
        setElapsedTime(currentElapsed);
        onTimeUpdate(Math.floor(currentElapsed / 1000));
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const handleModeSwitch = () => {
    if (isRunning) setIsRunning(false);
    if (mode === "stopwatch") {
      const totalSeconds = Math.floor(elapsedTime / 1000);
      setHours(Math.floor(totalSeconds / 3600));
      setMinutes(Math.floor((totalSeconds % 3600) / 60));
      setSeconds(Math.floor(totalSeconds % 60));
    }
    setMode((prev) => (prev === "stopwatch" ? "manual" : "stopwatch"));
  };

  const submitManualTime = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setElapsedTime(totalSeconds * 1000);
    onTimeUpdate(totalSeconds);
    setMode("stopwatch");
  };

  const formatMilliseconds = (ms: number) => {
    return Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0");
  };

  return (
    <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl overflow-hidden max-w-md mx-auto">
      <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-br from-gray-800 to-gray-900">
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <Clock size={18} className={`text-blue-400 ${isRunning ? "animate-pulse" : ""}`} />
          {label}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleModeSwitch}
          className="bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 flex items-center gap-2 rounded-full shadow-md transition-all duration-200"
        >
          {mode === "stopwatch" ? <Edit size={14} /> : <Timer size={14} />}
          {mode === "stopwatch" ? "Manual" : "Stopwatch"}
        </motion.button>
      </div>

      {description && (
        <div className="px-4 sm:px-6 py-2 border-b border-gray-800 bg-gray-850">
          <p className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
            <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">TIP</span>
            {description}
          </p>
        </div>
      )}

      <div className="p-4 sm:p-6 bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {mode === "stopwatch" ? (
              <>
                <motion.div
                  className="bg-gray-850 rounded-xl p-4 shadow-lg border border-gray-800"
                  whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="text-center">
                      <span
                        className={`text-2xl sm:text-3xl font-mono font-semibold ${
                          isRunning ? "text-blue-400" : "text-white"
                        }`}
                      >
                        {String(Math.floor(elapsedTime / 3600000)).padStart(2, "0")}
                      </span>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">HOURS</div>
                    </div>
                    <span className="text-2xl sm:text-3xl text-blue-400 pb-3">:</span>
                    <div className="text-center">
                      <span
                        className={`text-2xl sm:text-3xl font-mono font-semibold ${
                          isRunning ? "text-blue-400" : "text-white"
                        }`}
                      >
                        {String(Math.floor((elapsedTime % 3600000) / 60000)).padStart(2, "0")}
                      </span>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">MINUTES</div>
                    </div>
                    <span className="text-2xl sm:text-3xl text-blue-400 pb-3">:</span>
                    <div className="text-center">
                      <span
                        className={`text-2xl sm:text-3xl font-mono font-semibold ${
                          isRunning ? "text-blue-400" : "text-white"
                        }`}
                      >
                        {String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, "0")}
                      </span>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">SECONDS</div>
                    </div>
                    <span className="text-2xl sm:text-3xl text-blue-400 pb-3">.</span>
                    <div className="text-center">
                      <span
                        className={`text-2xl sm:text-3xl font-mono font-semibold ${
                          isRunning ? "text-blue-400" : "text-white"
                        }`}
                      >
                        {formatMilliseconds(elapsedTime)}
                      </span>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">MS</div>
                    </div>
                  </div>
                </motion.div>

                {isRunning && (
                  <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute h-full bg-blue-500"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      style={{ width: "50%" }}
                    />
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRunning(true)}
                      className="bg-green-600 text-white hover:bg-green-700 py-2 sm:py-3 px-6 flex gap-2 items-center justify-center rounded-full shadow-md transition-all duration-200"
                    >
                      <Play size={16} /> Start
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRunning(false)}
                      className="bg-amber-600 text-white hover:bg-amber-700 py-2 sm:py-3 px-6 flex gap-2 items-center justify-center rounded-full shadow-md transition-all duration-200"
                    >
                      <Pause size={16} /> Pause
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsRunning(false);
                      setElapsedTime(0);
                      onTimeUpdate(0);
                    }}
                    className="bg-gray-800 text-white hover:bg-gray-700 py-2 sm:py-3 px-6 flex gap-2 items-center justify-center rounded-full shadow-md transition-all duration-200"
                  >
                    <RotateCcw size={16} /> Reset
                  </motion.button>
                </div>

                {elapsedTime > 0 && !isRunning && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <div className="bg-gray-800/50 border border-gray-700/50 px-4 py-1.5 rounded-full text-sm sm:text-base text-gray-300 flex items-center gap-2 shadow-sm">
                      <Check size={14} className="text-green-400" />
                      {formatTime(elapsedTime / 1000)}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <motion.div
                  className="bg-gray-850 rounded-xl p-4 shadow-lg border border-gray-800"
                  whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
                >
                  <div className="flex justify-center items-center gap-3">
                    <TimeWheel value={hours} onChange={setHours} min={0} max={99} step={1} label="HOURS" />
                    <div className="text-blue-400 text-2xl font-semibold mb-3">:</div>
                    <TimeWheel value={minutes} onChange={setMinutes} min={0} max={59} step={1} label="MINUTES" />
                    <div className="text-blue-400 text-2xl font-semibold mb-3">:</div>
                    <TimeWheel value={seconds} onChange={setSeconds} min={0} max={59} step={1} label="SECONDS" />
                  </div>
                </motion.div>
                <div className="text-center text-gray-300 text-sm sm:text-base bg-gray-800/30 py-2 px-4 rounded-full border border-gray-700/50 shadow-inner">
                  Total: {formatTime(hours * 3600 + minutes * 60 + seconds)}
                </div>
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitManualTime}
                    className="bg-blue-600 text-white hover:bg-blue-700 py-2 sm:py-3 px-6 flex gap-2 items-center justify-center rounded-full shadow-md transition-all duration-200"
                  >
                    <Check size={16} /> Apply
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode("stopwatch")}
                    className="bg-gray-800 text-white hover:bg-gray-700 py-2 sm:py-3 px-6 flex gap-2 items-center justify-center rounded-full shadow-md transition-all duration-200"
                  >
                    <RotateCcw size={16} /> Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernTimer;