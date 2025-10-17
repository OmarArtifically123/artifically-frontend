import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "../components/Button";
import { SegmentedControl } from "../components/SegmentedControl";
import { Tooltip } from "../components/Tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "ADS/Display/Elements",
};

export default meta;

type Story = StoryObj;

export const Showcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", width: "420px" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Avatar name="Priya Desai" status="online" />
        <div style={{ display: "grid" }}>
          <strong>Priya Desai</strong>
          <Badge tone="brand">Automation lead</Badge>
        </div>
      </div>
      <Breadcrumbs
        items={[
          { label: "Automation", href: "#" },
          { label: "Revenue", href: "#" },
          { label: "Attribution" },
        ]}
      />
      <SegmentedControl
        options={[
          { id: "status", label: "Status" },
          { id: "performance", label: "Performance" },
          { id: "integrations", label: "Integrations" },
        ]}
        value="status"
        onChange={() => {}}
      />
      <Tooltip label="Runs explainable guardrails each iteration">
        <Button variant="outline">Explainability</Button>
      </Tooltip>
    </div>
  ),
};