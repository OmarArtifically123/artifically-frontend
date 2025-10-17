import type { Preview } from "@storybook/react";
import "../src/styles/global.css";
import "../src/design-system/styles.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "var(--ads-color-semantic-background-surface, #ffffff)" },
        { name: "muted", value: "var(--ads-color-semantic-background-muted, #f8fafc)" },
      ],
    },
  },
};

export default preview;