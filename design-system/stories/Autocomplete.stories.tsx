"use client";

import { useState } from "react";
import { Autocomplete } from "../components/Autocomplete";
import type { Meta, StoryObj } from "@storybook/react";

const options = [
  { label: "Customer churn mitigation", value: "churn" },
  { label: "Pricing intelligence", value: "pricing" },
  { label: "Inventory forecasting", value: "inventory" },
  { label: "Fraud signal fusion", value: "fraud" },
  { label: "Lead routing", value: "leads" },
  { label: "Revenue leakage prevention", value: "revenue" },
  { label: "Marketing attribution", value: "attribution" },
  { label: "Claims triage", value: "claims" },
];

const meta: Meta<typeof Autocomplete> = {
  title: "ADS/Inputs/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const AutocompleteStory = () => {
  const [selection, setSelection] = useState<typeof options[number] | null>(null);
  return (
    <Autocomplete
      label="Select automation"
      helperText="We use this signal to suggest blueprints and datasets."
      options={options}
      value={selection}
      onChange={setSelection}
    />
  );
};

export const Default: Story = {
  render: () => <AutocompleteStory />,
};