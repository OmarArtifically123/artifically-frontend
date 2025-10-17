import { useEffect } from "react";
import { Button } from "../components/Button";
import { ToastStack, useToastController } from "../components/Toast";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "ADS/Feedback/Toast",
};

export default meta;

type Story = StoryObj;

const ToastPlayground = () => {
  const controller = useToastController();
  const { push } = controller;

  useEffect(() => {
    push({
      title: "Launch scheduled",
      description: "Automation will deploy to production at 09:00 UTC.",
      tone: "success",
    });
  }, [push]);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Button
        onClick={() =>
          push({
            title: "Lead intelligence activated",
            description: "Signals are now flowing into Salesforce.",
            tone: "info",
          })
        }
      >
        Trigger toast
      </Button>
      <ToastStack controller={controller} />
    </div>
  );
};

export const Playground: Story = {
  render: () => <ToastPlayground />,
};