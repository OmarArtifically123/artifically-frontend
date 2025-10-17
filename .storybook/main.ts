import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/design-system/**/*.stories.@(tsx|ts)",
    "../src/components/**/*.stories.@(tsx|ts)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  features: {
    experimentalRSC: false
  },
  docs: {
    autodocs: "tag"
  },
  async viteFinal(config) {
    config.build = config.build ?? {};
    config.build.target = "es2020";
    config.optimizeDeps = config.optimizeDeps ?? {};
    config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions ?? {};
    config.optimizeDeps.esbuildOptions.target = "es2020";
    return config;
  }
};

export default config;