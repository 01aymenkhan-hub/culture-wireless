"use client";

import React from "react";
import { Ico } from "../Icons";

export default function StepIndicator({ currentStep, onStepClick }) {
  const steps = [
    { num: 1, label: "Device" },
    { num: 2, label: "Coverage & Plan" },
    { num: 3, label: "Your Number" },
    { num: 4, label: "SIM Type" },
    { num: 5, label: "Review" },
  ];

  const currentLabel = steps.find((s) => s.num === currentStep)?.label || "";

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-4">
      {/* Current Step Title Banner on Mobile */}
      <div className="sm:hidden text-center mb-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--cw-purple)] block mb-0.5">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--cw-fg-1)]">
          {currentLabel}
        </span>
      </div>

      {/* Steps track */}
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-4 sm:top-4.5 -translate-y-1/2 h-0.5 bg-[var(--cw-border-1)] z-0" />

        {/* Active progress fill line */}
        <div
          className="absolute left-0 top-4 sm:top-4.5 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[var(--cw-purple)] to-[#4ade80] transition-all duration-300 z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;

          return (
            <div
              key={step.num}
              onClick={() => isCompleted && onStepClick && onStepClick(step.num)}
              className={`relative z-10 flex flex-col items-center group ${
                isCompleted ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                  isCurrent
                    ? "bg-[var(--cw-purple)] border-[#a855f7] text-white shadow-[0_0_16px_rgba(168,85,247,0.4)] scale-110"
                    : isCompleted
                    ? "bg-[#16a34a] border-[#4ade80] text-white"
                    : "bg-[var(--cw-bg-3)] border-[var(--cw-border-1)] text-[var(--cw-fg-3)]"
                }`}
              >
                {isCompleted ? (
                  <Ico n="check" size={13} color="#ffffff" sw={3} />
                ) : (
                  <span>{step.num}</span>
                )}
              </div>

              {/* Step Label (desktop / tablet) */}
              <span
                className={`mt-2 text-xs font-semibold tracking-wide transition-colors ${
                  isCurrent
                    ? "text-[var(--cw-purple)] font-bold"
                    : isCompleted
                    ? "text-[var(--cw-fg-2)]"
                    : "text-[var(--cw-fg-3)]"
                } hidden sm:inline-block`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
