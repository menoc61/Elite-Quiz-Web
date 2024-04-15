import React, { useState, useEffect } from "react";
import { Animate } from "react-move";

const AnimatedProgressProvider = ({ valueStart, repeat, duration, easingFunction, valueEnd, children }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [intervalId, setIntervalId] = useState(undefined);

  useEffect(() => {
    if (repeat) {
      const id = setInterval(() => {
        setIsAnimated(!isAnimated);
      }, duration * 1000);
      setIntervalId(id);
    } else {
      setIsAnimated(!isAnimated);
    }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Animate
      start={() => ({
        value: valueStart,
      })}
      update={() => ({
        value: [isAnimated ? valueEnd : valueStart],
        timing: {
          duration: duration * 1000,
          ease: easingFunction,
        },
      })}
    >
      {({ value }) => children(value)}
    </Animate>
  );
};

AnimatedProgressProvider.defaultProps = {
  valueStart: 0,
};

export default AnimatedProgressProvider;
