
export function formatTime(totalSeconds: number | null): string {
    if (totalSeconds === null || isNaN(totalSeconds)) return "0s";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m ${secs}s`;
  };