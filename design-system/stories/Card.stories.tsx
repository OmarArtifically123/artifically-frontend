import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "ADS/Surfaces/Card",
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Revenue anomaly detection",
    subtitle: "Monitor transactional anomalies across enterprise sources.",
    actions: <Button variant="ghost">Preview automation</Button>,
    children: (
      <ul>
        <li>Connect to Snowflake, BigQuery, and Databricks in minutes.</li>
        <li>Adaptive detection reduces alert noise by 42%.</li>
        <li>Partners with risk and finance workflows out of the box.</li>
      </ul>
    ),
    footer: [<Badge key="1">Finance</Badge>, <Badge key="2" tone="success">Live</Badge>],
  },
};