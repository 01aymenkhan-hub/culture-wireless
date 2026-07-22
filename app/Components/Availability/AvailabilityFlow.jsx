"use client";

import { useRouter } from "next/navigation";
import { useAvailability } from "../../context/AvailabilityContext";
import WizardHeader from "./WizardHeader";
import AddressEntryV2 from "./AddressEntryV2";
import SmartCheckingPage from "./SmartCheckingPage";
import Step3SelectPlan from "./Step3SelectPlan";
import Step4CustomerInfo from "./Step4CustomerInfo";
import Step5CurrentService from "./Step5CurrentService";
import Step6ReviewOrder from "./Step6ReviewOrder";
import ResultBothUnavailablePage from "./ResultBothUnavailablePage";
import { useEffect } from "react";

/**
 * Orchestrates the complete 6-step availability wizard flow:
 *   Step 1 → Enter Service Address
 *   Step 2 → Smart Checking (live coverage & fiber APIs)
 *   Step 3 → Select a Plan (Fiber, 5G Home, 5G Mobile)
 *   Step 4 → Customer Information (First/Last name, Email, Phone)
 *   Step 5 → Current Service Details (Current Provider, Switching Reason)
 *   Step 6 → Review Order & Summary
 *
 * Back Navigation Rules:
 *   Step 3 Back → Step 1 (skips Step 2 processing)
 *   Step 4 Back → Step 3
 *   Step 5 Back → Step 4
 *   Step 6 Back → Step 5
 */
export default function AvailabilityFlow() {
  const router = useRouter();
  const {
    step,
    setStep,
    address,
    setAddress,
    coverageResult,
    setCoverageResult,
    selectedPlan,
    setSelectedPlan,
    customerInfo,
    setCustomerInfo,
    currentServiceInfo,
    setCurrentServiceInfo,
    resetFlow,
    isHydrated,
  } = useAvailability();

  const handleClose = () => {
    resetFlow();
    router.push("/");
  };

  const handleAddressSubmit = (nextAddress) => {
    setAddress(nextAddress);
    setCoverageResult(null);
    setSelectedPlan(null);
    setStep(2);
  };

  const handleCheckingComplete = (result) => {
    setCoverageResult(result);
    setStep(3);
  };

  const handleStep3Next = () => {
    setStep(4);
  };

  const handleStep4Next = () => {
    setStep(5);
  };

  const handleStep5Next = () => {
    setStep(6);
  };

  const handleOrderComplete = () => {
    resetFlow();
    router.push("/");
  };

  useEffect(() => {
    if (isHydrated) {
      window.scrollTo(0, 0);
    }
  }, [isHydrated]);

  // Back Navigation Handlers according to exact rules
  const handleBackFromStep3 = () => setStep(1); // Skip step 2
  const handleBackFromStep4 = () => setStep(3);
  const handleBackFromStep5 = () => setStep(4);
  const handleBackFromStep6 = () => setStep(5);

  const isUnavailable =
    coverageResult &&
    !coverageResult.fiber &&
    !coverageResult.home5g &&
    !coverageResult.mobile;

  // Prevent flicker of Step 1 during SSR hydration / localStorage restoration
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

  // Render ResultBothUnavailablePage if no services are available at step 3+
  if (step >= 3 && isUnavailable) {
    return (
      <ResultBothUnavailablePage
        address={address?.formattedAddress || address?.streetAddress || "Your address"}
        zip={address?.zipCode || ""}
        onBack={() => {
          resetFlow();
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cw-bg-2)" }}>
      {/* Wizard Header displaying step indicator (Step X of 6) */}
      <WizardHeader
        step={step}
        onBack={
          step === 3
            ? handleBackFromStep3
            : step === 4
              ? handleBackFromStep4
              : step === 5
                ? handleBackFromStep5
                : step === 6
                  ? handleBackFromStep6
                  : handleClose
        }
        hideBack={step === 2}
      />

      {/* Step 1 — Enter Service Address */}
      {step === 1 && (
        <AddressEntryV2 onSubmit={handleAddressSubmit} onBack={handleClose} />
      )}

      {/* Step 2 — Smart Checking */}
      {step === 2 && (
        <SmartCheckingPage
          address={address}
          onComplete={handleCheckingComplete}
          autoAdvance
        />
      )}

      {/* Step 3 — Select a Plan */}
      {step === 3 && (
        <Step3SelectPlan
          address={address}
          coverageResult={coverageResult}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onNext={handleStep3Next}
          onBack={handleBackFromStep3}
        />
      )}

      {/* Step 4 — Customer Information */}
      {step === 4 && (
        <Step4CustomerInfo
          customerInfo={customerInfo}
          onChange={setCustomerInfo}
          onNext={handleStep4Next}
          onBack={handleBackFromStep4}
        />
      )}

      {/* Step 5 — Current Service Details */}
      {step === 5 && (
        <Step5CurrentService
          currentServiceInfo={currentServiceInfo}
          onChange={setCurrentServiceInfo}
          onNext={handleStep5Next}
          onBack={handleBackFromStep5}
        />
      )}

      {/* Step 6 — Review Order */}
      {step === 6 && (
        <Step6ReviewOrder
          address={address}
          selectedPlan={selectedPlan}
          customerInfo={customerInfo}
          currentServiceInfo={currentServiceInfo}
          onComplete={handleOrderComplete}
          onBack={handleBackFromStep6}
        />
      )}
    </div>
  );
}
