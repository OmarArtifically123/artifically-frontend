import { beforeEach, describe, expect, it } from 'vitest';

import { applyDesignTokens, getDesignToken } from './applyDesignTokens';

describe('applyDesignTokens', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('applies flattened tokens as CSS variables on the root element', () => {
    const result = applyDesignTokens();

    expect(result).not.toBeNull();
    expect(result?.applied['color.brand.primary']).toBeDefined();

    const cssValue = document.documentElement.style.getPropertyValue('--color-brand-primary');
    expect(cssValue.trim()).toBe(getDesignToken('color.brand.primary'));
  });

  it('syncs alias variables to their token values', () => {
    applyDesignTokens();

    const aliasValue = document.documentElement.style.getPropertyValue('--brand-primary');
    expect(aliasValue.trim()).toBe(getDesignToken('color.brand.primary'));
  });
});