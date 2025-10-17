import { Stat } from "../components/Stat";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Stat> = {
  title: "ADS/Data/Stat",
  component: Stat,
  args: {
    label: "Net revenue uplift",
    value: "$4.8M",
    helperText: "Projected uplift for the current quarter",
    delta: 18.4,
    deltaLabel: "vs last quarter",
  },
};

export default meta;

type Story = StoryObj<typeof Stat>;

export const Default: Story = {};