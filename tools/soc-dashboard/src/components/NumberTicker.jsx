import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}) {
  const [num, setNum] = useState(direction === "up" ? 0 : value);
  const ref = useRef(null);

  useEffect(() => {
    // 📘 Para que entiendas: Este efecto incrementa el número gradualmente
    // Esto hace que el dashboard se sienta vivo ("dynamic design").
    let startTimestamp = null;
    let animationFrame;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smoother stop
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      if (direction === "up") {
        setNum(Math.floor(easeOutQuart * value));
      } else {
        setNum(Math.floor(value - (easeOutQuart * value)));
      }

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setNum(value);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrame = window.requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [value, direction, delay]);

  return (
    <span
      className={cn(
        "inline-block tabular-nums tracking-wider text-black dark:text-white",
        className
      )}
      ref={ref}
    >
      {num}
    </span>
  );
}
