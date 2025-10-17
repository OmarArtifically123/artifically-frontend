"use client";

import { useState } from "react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Modal> = {
  title: "ADS/Feedback/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalStory = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch request access</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Request automation access"
        description="Provide a brief summary of the outcome you're targeting. We'll tailor deployment steps and invite the right teammates."
        primaryAction={{
          label: "Submit request",
          onClick: () => setOpen(false),
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setOpen(false),
        }}
      >
        <p>
          Automations typically deploy in under 14 days with guardrails for security, governance, and change management built in by default.
        </p>
      </Modal>
    </>
  );
};

export const Basic: Story = {
  render: () => <ModalStory />,
};