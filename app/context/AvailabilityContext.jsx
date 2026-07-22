"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

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

export const EMPTY_CUSTOMER = Object.freeze({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

export const EMPTY_SERVICE_INFO = Object.freeze({
  currentProvider: "",
  switchingReason: "",
});

const STORAGE_KEY = "cw-availability-wizard-v1";

const AvailabilityContext = createContext(null);

/**
 * Flow steps (6-step wizard):
 *   1 = Enter Service Address
 *   2 = Smart Checking (running APIs)
 *   3 = Select a Plan
 *   4 = Customer Information
 *   5 = Current Service Information
 *   6 = Review Information
 */
export function AvailabilityProvider({ children }) {
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [step, setStep] = useState(1);
  const [coverageResult, setCoverageResult] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(EMPTY_CUSTOMER);
  const [currentServiceInfo, setCurrentServiceInfo] = useState(EMPTY_SERVICE_INFO);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const res = parsed.coverageResult;
        const isUnavailable = res && !res.fiber && !res.home5g && !res.mobile;

        // If the user refreshed while on an unavailable result, clear state & return to Step 1
        if (isUnavailable) {
          localStorage.removeItem(STORAGE_KEY);
          setAddress(EMPTY_ADDRESS);
          setStep(1);
          setCoverageResult(null);
          setSelectedPlan(null);
          setCustomerInfo(EMPTY_CUSTOMER);
          setCurrentServiceInfo(EMPTY_SERVICE_INFO);
        } else {
          if (parsed.address) setAddress(parsed.address);
          if (parsed.step) setStep(parsed.step);
          if (parsed.coverageResult) setCoverageResult(parsed.coverageResult);
          if (parsed.selectedPlan) setSelectedPlan(parsed.selectedPlan);
          if (parsed.customerInfo) setCustomerInfo(parsed.customerInfo);
          if (parsed.currentServiceInfo) setCurrentServiceInfo(parsed.currentServiceInfo);
        }
      }
    } catch (e) {
      console.error("Failed to load availability state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save state to localStorage whenever wizard state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        address,
        step,
        coverageResult,
        selectedPlan,
        customerInfo,
        currentServiceInfo,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save availability state to localStorage:", e);
    }
  }, [address, step, coverageResult, selectedPlan, customerInfo, currentServiceInfo, isHydrated]);

  const resetFlow = useCallback(() => {
    setAddress(EMPTY_ADDRESS);
    setStep(1);
    setCoverageResult(null);
    setSelectedPlan(null);
    setCustomerInfo(EMPTY_CUSTOMER);
    setCurrentServiceInfo(EMPTY_SERVICE_INFO);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, []);

  const value = {
    // Core flow state
    address,
    setAddress,
    step,
    setStep,
    coverageResult,
    setCoverageResult,
    selectedPlan,
    setSelectedPlan,
    customerInfo,
    setCustomerInfo,
    currentServiceInfo,
    setCurrentServiceInfo,
    // Actions
    resetFlow,
    isHydrated,
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
