"use client";

import { useSpring, animated } from "react-spring";

const AnimatedNumber = ({ value, precision = 0, prefix = "", suffix = "" }) => {
  const props = useSpring({
    number: value,
    from: { number: 0 },
    config: { duration: 800 },
  });

  return (
    <animated.span>
      {props.number.to((n) => {
        const formatted = Number(n.toFixed(precision)).toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
        return `${prefix}${formatted}${suffix}`;
      })}
    </animated.span>
  );
};

export default AnimatedNumber;