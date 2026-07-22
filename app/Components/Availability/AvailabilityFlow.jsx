"use client";

import { useRouter } from "next/navigation";
import { useAvailability } from "../../context/AvailabilityContext";
import AddressEntryV2 from "./AddressEntryV2";
import SmartCheckingPage from "./SmartCheckingPage";
import ResultCombinedPage from "./ResultCombinedPage";
import ResultBothUnavailablePage from "./ResultBothUnavailablePage";

/**
 * Orchestrates the 3-step availability flow:
 *   step 1 → address entry
 *   step 2 → live API checks
 *   step 3 → results
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
    resetFlow,
  } = useAvailability();

  const handleClose = () => {
    resetFlow();
    router.push("/");
  };

  const handleAddressSubmit = (nextAddress) => {
    setAddress(nextAddress);
    setCoverageResult(null);
    setStep(2);
  };

  const handleCheckingComplete = (result) => {
    setCoverageResult(result);
    setStep(3);
  };

  const handleSelectPlan = () => {
    // Checkout is not implemented yet — reset the flow and go home for now.
    resetFlow();
    router.push("/");
  };

  if (step === 1) {
    return <AddressEntryV2 onSubmit={handleAddressSubmit} onBack={handleClose} />;
  }

  if (step === 2) {
    return (
      <SmartCheckingPage
        address={address}
        onComplete={handleCheckingComplete}
        autoAdvance
      />
    );
  }

  // step 3 — results
  const result = coverageResult ?? {
    fiber: false,
    home5g: false,
    mobile: false,
  };

  if (!result.fiber && !result.mobile && !result.home5g) {
    return (
      <ResultBothUnavailablePage
        address={address.formattedAddress}
        zip={address.zipCode}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <ResultCombinedPage
      address={address}
      fiberAvailable={result.fiber}
      home5gAvailable={result.home5g}
      home5gStatus={result.home5gStatus || "unavailable"}
      mobileAvailable={result.mobile}
      fiberDetail={result.fiberDetail}
      home5gDetail={result.home5gDetail}
      mobileDetail={result.mobileDetail}
      onSelectPlan={handleSelectPlan}
      onBack={() => setStep(1)}
    />
  );
}
