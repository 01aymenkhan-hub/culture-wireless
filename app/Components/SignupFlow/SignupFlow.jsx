"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelgoo } from "../../context/TelgooContext";
import WizardHeader from "../Availability/WizardHeader";
import Step1DeviceCompatibility from "./Step1DeviceCompatibility";
import Step2CoverageAndPlan from "./Step2CoverageAndPlan";
import Step3YourNumber from "./Step3YourNumber";
import Step4SimType from "./Step4SimType";
import Step5CustomerInfo from "./Step5CustomerInfo";
import Step6ReviewOrder from "./Step6ReviewOrder";

const TELGOO_STEP_LABELS = [
  "Device Compatibility",
  "Coverage & Plan",
  "Your Number",
  "SIM Type",
  "Customer Info",
  "Review Order",
];

export default function SignupFlow() {
  const router = useRouter();
  const {
    step,
    setStep,
    enrollmentData,
    updateEnrollmentData,
    clearStepData,
    resetFlow,
    isHydrated,
  } = useTelgoo();

  const handleClose = () => {
    resetFlow();
    router.push("/mobile");
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    if (step === 1) {
      handleClose();
    } else {
      // Clear data of the step being left before navigating back
      clearStepData(step);
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleCustomerInfoChange = (newInfo) => {
    updateEnrollmentData("customerInfo", newInfo);
  };

  useEffect(() => {
    if (isHydrated) {
      window.scrollTo(0, 0);
    }
  }, [step, isHydrated]);

  // Prevent flicker during SSR hydration / localStorage restoration
  if (!isHydrated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--cw-bg-2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--cw-font-sans)",
          color: "var(--cw-fg-1)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3px solid var(--cw-border-1)",
            borderTopColor: "var(--cw-purple)",
            animation: "cwSpin 0.8s linear infinite",
            marginBottom: 16,
          }}
        />
        <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--cw-fg-3)",
          }}
        >
          Restoring your session…
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cw-bg-2)" }}>
      {/* Shared Wizard Header with 6 steps */}
      <WizardHeader
        step={step}
        totalSteps={6}
        stepLabels={TELGOO_STEP_LABELS}
        onBack={handleBack}
      />

      {/* Step Renderers */}
      <main>
        {step === 1 && (
          <Step1DeviceCompatibility
            enrollmentData={enrollmentData}
            updateEnrollmentData={updateEnrollmentData}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <Step2CoverageAndPlan
            enrollmentData={enrollmentData}
            updateEnrollmentData={updateEnrollmentData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <Step3YourNumber
            enrollmentData={enrollmentData}
            updateEnrollmentData={updateEnrollmentData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <Step4SimType
            enrollmentData={enrollmentData}
            updateEnrollmentData={updateEnrollmentData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 5 && (
          <Step5CustomerInfo
            customerInfo={enrollmentData.customerInfo}
            onChange={handleCustomerInfoChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 6 && (
          <Step6ReviewOrder
            enrollmentData={enrollmentData}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}
