"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: "goal",
    title: "Pick your first win",
    question: "Which outcome matters most in the next 30 days?",
    options: [
      { id: "reduce-costs", label: "Reduce operating costs", hint: "Target finance and back-office automations." },
      { id: "improve-csat", label: "Improve customer satisfaction", hint: "Highlight support and success workflows." },
      { id: "accelerate-revenue", label: "Accelerate revenue", hint: "Recommend sales and marketing automations." },
    ],
  },
  {
    id: "systems",
    title: "Connect your systems",
    question: "Which systems should we prioritise for integrations?",
    options: [
      { id: "salesforce", label: "Salesforce", hint: "Sync pipeline stages and handoffs." },
      { id: "zendesk", label: "Zendesk", hint: "Speed up agent responses with AI suggestions." },
      { id: "netsuite", label: "NetSuite", hint: "Automate reconciliations and procurement." },
    ],
  },
  {
    id: "collaboration",
    title: "Bring your team",
    question: "How do you want teammates to join the evaluation?",
    options: [
      { id: "invite-now", label: "Invite immediately", hint: "Send personalised invites after this flow." },
      { id: "share-link", label: "Share a link", hint: "Generate a read-only tour link for stakeholders." },
      { id: "do-later", label: "I’ll do this later", hint: "Remind me in the dashboard with next best actions." },
    ],
  },
];

export default function GoalOnboardingWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const activeStep = steps[stepIndex];
  const isFinalStep = stepIndex === steps.length - 1;

  const summary = useMemo(() => {
    return steps
      .filter((step) => responses[step.id])
      .map((step) => {
        const selected = step.options.find((option) => option.id === responses[step.id]);
        return selected ? `${step.title}: ${selected.label}` : null;
      })
      .filter(Boolean)
      .join(" · ");
  }, [responses]);

  const handleSelect = (optionId) => {
    setResponses((prev) => ({ ...prev, [activeStep.id]: optionId }));
  };

  const goNext = () => {
    if (!responses[activeStep.id]) return;
    if (isFinalStep) {
      const summaryLink = document.getElementById("goal-wizard-summary-link");
      summaryLink?.focus({ preventScroll: false });
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextHover = useCallback(() => {
    const targetPath = isFinalStep
      ? `/marketplace?wizard=${encodeURIComponent(
          steps
            .filter((step) => responses[step.id])
            .map((step) => step.id)
            .join("-"),
        )}`
      : undefined;

    router.prefetch(targetPath || "/marketplace");
  }, [isFinalStep, responses, router]);

  return (
    <section className="goal-wizard" aria-labelledby="goal-wizard-heading">
      <header>
        <p className="goal-wizard__eyebrow">Guided onboarding</p>
        <h2 id="goal-wizard-heading">Map automations to your business goals</h2>
        <p>
          Answer three quick questions to build a personalised marketplace shortlist, complete with ROI exports and team
          invites.
        </p>
      </header>

      <div className="goal-wizard__progress" role="status" aria-live="polite">
        Step {stepIndex + 1} of {steps.length}
      </div>

      <div className="goal-wizard__card">
        <h3>{activeStep.title}</h3>
        <p>{activeStep.question}</p>
        <div className="goal-wizard__options" role="radiogroup" aria-label={activeStep.question}>
          {activeStep.options.map((option) => {
            const isSelected = responses[activeStep.id] === option.id;
            return (
              <label key={option.id} className="goal-wizard__option" data-selected={isSelected || undefined}>
                <input
                  type="radio"
                  name={activeStep.id}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleSelect(option.id)}
                />
                <span className="goal-wizard__option-label">{option.label}</span>
                <span className="goal-wizard__option-hint">{option.hint}</span>
              </label>
            );
          })}
        </div>
        <div className="goal-wizard__actions">
          <button type="button" className="cta-secondary" onClick={goBack} disabled={stepIndex === 0}>
            Previous
          </button>
          <button
            type="button"
            className="cta-primary"
            onClick={goNext}
            disabled={!responses[activeStep.id]}
            onMouseEnter={handleNextHover}
            onFocus={handleNextHover}
          >
            {isFinalStep ? "Review plan" : "Next"}
          </button>
        </div>
        {isFinalStep && responses[activeStep.id] ? (
          <div className="goal-wizard__summary" role="note">
            <p>Nice! We’ll pre-select marketplace modules using:</p>
            <p>{summary || "Your selections will appear here."}</p>
            <a
              className="cta-link"
              id="goal-wizard-summary-link"
              href={`/marketplace?wizard=${encodeURIComponent(summary || "custom")}`}
            >
              Continue to personalised marketplace
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}