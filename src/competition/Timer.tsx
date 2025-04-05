import { useState, useEffect } from "react";

type TimerProps = {
  initialTime: number; // in seconds
  onComplete?: () => void;
};

const Timer = ({ initialTime, onComplete }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer">
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
