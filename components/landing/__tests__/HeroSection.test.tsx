import React from 'react';
import './setupDom';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HeroSection from '../HeroSection';


vi.mock('../HeroBackground', () => ({
  default: () => <div data-testid="hero-background" />,
}));

vi.mock('../ProductPreview3D', () => ({
  default: ({ label }: { label: string }) => <div data-testid="product-preview">{label}</div>,
}));

vi.mock('../ScrollIndicator', () => ({
  default: () => <div data-testid="scroll-indicator" />,
}));

vi.mock('../HeroRoiCalculator', () => ({
  default: () => <div data-testid="hero-roi" />,
}));

describe('HeroSection', () => {
  it('renders headline, actions and trusted logos', () => {
    const handlePrimary = vi.fn();
    const handleSecondary = vi.fn();

    render(
      <HeroSection
        onPrimary={handlePrimary}
        onSecondary={handleSecondary}
        demoDialogId="demo-dialog"
        demoOpen={false}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: /deploy enterprise ai automations in minutes/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /start free trial/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /watch demo/i })).toBeInTheDocument();

    expect(screen.getByText(/trusted by teams shipping ai in production/i)).toBeInTheDocument();
    expect(screen.getAllByText(/northwind/i).length).toBeGreaterThan(0);
  });
});