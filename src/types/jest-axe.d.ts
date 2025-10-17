/// <reference types="vitest" />

import type { AxeResults, ImpactValue, Result, RunOptions, Spec } from "axe-core";

export interface JestAxeConfigureOptions extends RunOptions {
  globalOptions?: Spec;
  impactLevels?: ImpactValue[];
}

export type JestAxe = (html: Element | string, options?: RunOptions) => Promise<AxeResults>;

export declare const axe: JestAxe;

export declare function configureAxe(options?: JestAxeConfigureOptions): JestAxe;

export interface AssertionsResult {
  actual: Result[];
  message(): string;
  pass: boolean;
}

export type IToHaveNoViolations = (results?: Partial<AxeResults>) => AssertionsResult;

export declare const toHaveNoViolations: {
  toHaveNoViolations: IToHaveNoViolations;
};

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }

  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): unknown;
  }
}