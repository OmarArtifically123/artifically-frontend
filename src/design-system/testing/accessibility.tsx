import type { ReactElement } from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";

export interface A11yCheckOptions {
  axeOptions?: Parameters<typeof axe>[1];
}

export const runA11yCheck = async (ui: ReactElement, { axeOptions }: A11yCheckOptions = {}) => {
  const result = render(ui);
  try {
    const report = await axe(result.container, axeOptions);
    return report;
  } finally {
    cleanup();
  }
};