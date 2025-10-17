import { Button } from "../components/Button";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "ADS/Actions/Button",
  component: Button,
  args: {
    children: "Launch automation",
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};