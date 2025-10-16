import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { toast, ToastHost } from "../Toast";

describe("ToastHost", () => {
  it("exposes an aria live region for announcements", async () => {
    render(
      <ThemeProvider>
        <ToastHost />
      </ThemeProvider>,
    );

    const liveRegion = await screen.findByRole("status");

    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
    expect(liveRegion).toHaveAttribute("aria-label", "Notifications");

    await act(async () => {
      toast("Automation added to workspace", { type: "success" });
    });

    await waitFor(() => {
      expect(screen.getByText("Automation added to workspace")).toBeInTheDocument();
    });
  });
});