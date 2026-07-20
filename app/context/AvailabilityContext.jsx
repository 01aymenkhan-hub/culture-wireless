"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * Normalized address shape used across the availability flow:
 *   { formattedAddress, streetAddress, unit, city, state, zipCode, latitude, longitude, serviceType }
 */
export const EMPTY_ADDRESS = Object.freeze({
  formattedAddress: "",
  streetAddress: "",
  unit: "",
  city: "",
  state: "",
  zipCode: "",
  latitude: null,
  longitude: null,
  serviceType: null,
});

const EMPTY_FORM_DATA = Object.freeze({
  plan: null,
  customer: { firstName: "", lastName: "", phone: "", email: "" },
});

const AvailabilityContext = createContext(null);

/**
 * Flow steps:
 *   1 = Address Entry
 *   2 = Smart Checking (running APIs)
 *   3 = Results
 */
export function AvailabilityProvider({ children }) {
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [step, setStep] = useState(1);
  const [coverageResult, setCoverageResult] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const resetFlow = useCallback(() => {
    setAddress(EMPTY_ADDRESS);
    setStep(1);
    setCoverageResult(null);
    setFormData(EMPTY_FORM_DATA);
  }, []);

  const updateFormData = useCallback((section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  }, []);

  const selectPlan = useCallback((plan) => {
    setFormData((prev) => ({ ...prev, plan }));
  }, []);

  const value = {
    // Core flow state
    address,
    setAddress,
    step,
    setStep,
    coverageResult,
    setCoverageResult,
    // Form data (checkout etc.)
    formData,
    updateFormData,
    selectPlan,
    // Actions
    resetFlow,
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const ctx = useContext(AvailabilityContext);
  if (!ctx) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return ctx;
}
