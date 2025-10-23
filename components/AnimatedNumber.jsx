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
        const base = precision > 0 ? Number(n.toFixed(precision)) : Number(n.toFixed(0));
        const localized = base.toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
        return `${prefix}${localized}${suffix}`;
      })}
    </animated.span>
  );
};

export default AnimatedNumber;