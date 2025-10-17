import { AppLayout } from "../components/AppLayout";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Tabs } from "../components/Tabs";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AppLayout> = {
  title: "ADS/Structure/AppLayout",
  component: AppLayout,
};

export default meta;

type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  render: () => (
    <AppLayout
      sidebar={
        <nav style={{ display: "grid", gap: "0.75rem" }}>
          <Button variant="ghost">Overview</Button>
          <Button variant="ghost">Playbooks</Button>
          <Button variant="ghost">Deployments</Button>
          <Button variant="ghost">Telemetry</Button>
        </nav>
      }
      header={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>Automation Portfolio</h2>
            <p style={{ margin: 0 }}>
              <Badge>38 automations live</Badge>
            </p>
          </div>
          <Button>Launch automation</Button>
        </div>
      }
    >
      <Tabs
        items={[
          { id: "roi", label: "ROI", content: <p>High impact automations prioritized by value.</p> },
          { id: "adoption", label: "Adoption", content: <p>Adoption momentum across teams.</p> },
          { id: "quality", label: "Quality", content: <p>Quality and resilience metrics at a glance.</p> },
        ]}
      />
    </AppLayout>
  ),
};