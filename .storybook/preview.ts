"use client";

import type { Decorator, Preview } from "@storybook/react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import "../src/styles/global.css";
import "../src/design-system/styles.css";

type Theme = "light" | "dark";

const ThemeCanvas = ({ theme, children }: { theme: Theme; children: ReactNode }) => {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div data-theme={theme} className="ads-story-surface">
      <div className="ads-surface" style={{ width: "min(960px, 90vw)", padding: "var(--ads-spacing-scale-6)" }}>
        {children}
      </div>
    </div>
  );
};

const withDesignSystemTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as Theme) ?? "light";
  return (
    <ThemeCanvas theme={theme}>
      <Story />
    </ThemeCanvas>
  );
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Switch between light and dark design tokens",
    defaultValue: "light",
    toolbar: {
      icon: "contrast",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
    },
  },
};

const preview: Preview = {
  decorators: [withDesignSystemTheme],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: "fullscreen",
    backgrounds: {
      disable: true,
    },
  },
};

export default preview;