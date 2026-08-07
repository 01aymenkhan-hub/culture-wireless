"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const EMPTY_CUSTOMER_INFO = Object.freeze({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

export const EMPTY_ENROLLMENT = Object.freeze({
  // Step 1: Device Compatibility
  brand: "",
  model: "",
  isEsim: false,

  // Step 2: Coverage & Plan
  zipCode: "",
  enrollmentId: "",
  selectedPlan: null,

  // Step 3: Your Number
  numberChoice: "new",
  portNumber: "",
  portCarrier: "",
  portAccountNumber: "",
  portPin: "",
  areaCode: "404",
  selectedNewNumber: "",

  // Step 4: SIM Type
  simType: "esim",

  // Step 5: Customer Info
  customerInfo: EMPTY_CUSTOMER_INFO,
});

const STORAGE_KEY = "cw-telgoo-wizard-v1";

const TelgooContext = createContext(null);

export function TelgooProvider({ children }) {
  const [step, setStep] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState(EMPTY_ENROLLMENT);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.enrollmentData) setEnrollmentData(parsed.enrollmentData);
      }
    } catch (e) {
      console.error("Failed to load Telgoo wizard state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save state to localStorage on updates
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        step,
        enrollmentData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save Telgoo wizard state to localStorage:", e);
    }
  }, [step, enrollmentData, isHydrated]);

  const updateEnrollmentData = useCallback((key, value) => {
    setEnrollmentData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Clears data entered on a specific step when navigating backward
  const clearStepData = useCallback((stepNumber) => {
    setEnrollmentData((prev) => {
      const next = { ...prev };
      if (stepNumber === 1) {
        next.brand = "";
        next.model = "";
        next.isEsim = false;
      } else if (stepNumber === 2) {
        next.zipCode = "";
        next.enrollmentId = "";
        next.selectedPlan = null;
      } else if (stepNumber === 3) {
        next.numberChoice = "new";
        next.portNumber = "";
        next.portCarrier = "";
        next.portAccountNumber = "";
        next.portPin = "";
        next.areaCode = "404";
        next.selectedNewNumber = "";
      } else if (stepNumber === 4) {
        next.simType = "esim";
      } else if (stepNumber === 5) {
        next.customerInfo = EMPTY_CUSTOMER_INFO;
      }
      return next;
    });
  }, []);

  const resetFlow = useCallback(() => {
    setStep(1);
    setEnrollmentData(EMPTY_ENROLLMENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, []);

  const value = {
    step,
    setStep,
    enrollmentData,
    setEnrollmentData,
    updateEnrollmentData,
    clearStepData,
    resetFlow,
    isHydrated,
  };

  return (
    <TelgooContext.Provider value={value}>
      {children}
    </TelgooContext.Provider>
  );
}

export function useTelgoo() {
  const ctx = useContext(TelgooContext);
  if (!ctx) {
    throw new Error("useTelgoo must be used within a TelgooProvider");
  }
  return ctx;
}
