import { Checkbox } from "../components/Checkbox";
import { SelectField } from "../components/SelectField";
import { Switch } from "../components/Switch";
import { TextAreaField } from "../components/TextAreaField";
import { TextField } from "../components/TextField";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "ADS/Inputs/Form Fields",
};

export default meta;

type Story = StoryObj;

export const Inputs: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", width: "360px" }}>
      <TextField label="Automation name" placeholder="Marketing attribution" helperText="Customer facing name" />
      <TextAreaField
        label="Deployment notes"
        placeholder="Outline guardrails, integration dependencies, and key telemetry."
      />
      <SelectField
        label="Primary dataset"
        placeholder="Select dataset"
        options={[
          { label: "Snowflake - finance warehouse", value: "snowflake" },
          { label: "Salesforce - leads", value: "salesforce" },
          { label: "Databricks - ml lake", value: "databricks" },
        ]}
      />
      <Checkbox label="Enable human-in-the-loop review" description="Route exceptions to the compliance queue." defaultChecked />
      <Switch label="High assurance mode" helperText="Adds verification steps and audit trails." defaultChecked />
    </div>
  ),
};