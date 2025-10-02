export const space = (token, factor = 1) => {
  const normalizedToken = token.startsWith("space-") ? token : `space-${token}`;
  const numericFactor = Number(factor);
  if (!Number.isFinite(numericFactor) || numericFactor === 1) {
    return `var(--${normalizedToken})`;
  }
  return `calc(var(--${normalizedToken}) * ${numericFactor})`;
};

export const spaceClamp = (minToken, maxToken, weight = 1) => {
  const normalizedMin = minToken.startsWith("space-") ? minToken : `space-${minToken}`;
  const normalizedMax = maxToken.startsWith("space-") ? maxToken : `space-${maxToken}`;
  const numericWeight = Number(weight);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0) {
    return `var(--${normalizedMin})`;
  }
  return `max(var(--${normalizedMin}), calc(var(--${normalizedMax}) / ${numericWeight}))`;
};