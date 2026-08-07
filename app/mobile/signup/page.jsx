"use client";

import React from "react";
import { TelgooProvider } from "../../context/TelgooContext";
import SignupFlow from "../../Components/SignupFlow/SignupFlow";

export default function MobileSignupPage() {
  return (
    <TelgooProvider>
      <SignupFlow />
    </TelgooProvider>
  );
}
