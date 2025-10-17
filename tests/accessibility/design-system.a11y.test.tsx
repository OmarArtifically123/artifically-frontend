import { describe, it, expect } from "vitest";
import { runA11yCheck } from "../../design-system/testing/accessibility";
import { Button } from "../../design-system/components/Button";
import { Alert } from "../../design-system/components/Alert";
import { TextField } from "../../design-system/components/TextField";
import { Tabs } from "../../design-system/components/Tabs";

const runAndAssert = async (name: string, element: JSX.Element) => {
  const results = await runA11yCheck(element);
  expect(results, `${name} should have no detectable accessibility violations`).toHaveNoViolations();
  return results;
};

describe("Artifically Design System accessibility", () => {
  it("Button has no detectable violations", async () => {
    await runAndAssert(
      "Button",
      <Button onClick={() => undefined} aria-label="Perform action">
        Perform action
      </Button>,
    );
  });

  it("Alert conveys status accessibly", async () => {
    await runAndAssert(
      "Alert",
      <Alert title="Heads up" description="Make sure to save your work." tone="warning" />,
    );
  });

  it("TextField wires helper and error text correctly", async () => {
    await runAndAssert(
      "TextField",
      <TextField
        name="email"
        type="email"
        label="Email address"
        helperText="We'll never share it."
        error="Enter a valid email"
      />,
    );
  });

  it("Tabs surface the active panel to assistive tech", async () => {
    await runAndAssert(
      "Tabs",
      <Tabs
        ariaLabel="Workflow steps"
        items={[
          {
            id: "plan",
            label: "Plan",
            content: <p>Define success metrics.</p>,
          },
          {
            id: "build",
            label: "Build",
            content: <p>Implement the solution.</p>,
          },
        ]}
      />,
    );
  });
});