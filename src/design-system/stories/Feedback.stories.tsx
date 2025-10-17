import { Alert } from "../components/Alert";
import { ProgressBar } from "../components/ProgressBar";
import { Skeleton } from "../components/Skeleton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "ADS/Feedback/Status",
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.25rem", width: "420px" }}>
      <Alert
        tone="warning"
        title="Dataset refresh paused"
        description="Snowflake maintenance detected. We'll resume automated scoring once the job completes."
      />
      <ProgressBar value={72} />
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <Skeleton height="1.75rem" />
        <Skeleton height="1.75rem" />
        <Skeleton height="1.75rem" />
      </div>
    </div>
  ),
};