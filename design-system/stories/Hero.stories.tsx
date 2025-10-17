import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Hero } from "../components/Hero";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Hero> = {
  title: "ADS/Surfaces/Hero",
  component: Hero,
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    eyebrow: "Trusted by 180+ enterprises",
    title: "Orchestrate intelligent automation that adapts in real time",
    description: "Artifically Design System distills enterprise AI expertise into accessible components, enabling faster launches with governance baked in.",
    actions: (
      <>
        <Button>Book a strategy session</Button>
        <Button variant="ghost">Explore documentation</Button>
      </>
    ),
    media: (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Avatar name="Alex Morgan" status="online" />
        <div>
          <Badge>Automation Strategist</Badge>
          <p style={{ margin: 0, fontSize: "0.75rem" }}>Avg. go-live time: 12 days</p>
        </div>
      </div>
    ),
  },
};