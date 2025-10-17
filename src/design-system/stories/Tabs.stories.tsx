import { Tabs } from "../components/Tabs";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tabs> = {
  title: "ADS/Navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "overview",
        label: "Overview",
        content: <p>At-a-glance summary of automation coverage and KPIs.</p>,
      },
      {
        id: "datasets",
        label: "Datasets",
        content: <p>View data sources, contracts, and refresh cadences.</p>,
      },
      {
        id: "alerts",
        label: "Alerts",
        content: <p>Governance, guardrails, and break-glass procedures.</p>,
      },
    ],
  },
};