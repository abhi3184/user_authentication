import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SendEmailOTP from "./SendEmailOTP";
import VerifyEmailOTP from "./VerifyEmailOTP";
import SendMobileOTP from "./SendMobileOTP";
import VerifyMobileOTP from "./VerifyMobileOTP";
import NewPasswordForm from "./Password";


export default function UserRegistration() {
  
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    mobile: "",
  });

  return (
    <Routes>
      {/* Step 1: Send Email OTP */}
      <Route
        path="/"
        element={<SendEmailOTP userData={userData} setUserData={setUserData} />}
      />

      {/* Step 2: Verify Email OTP */}
      <Route
        path="verify-email-otp"
        element={<VerifyEmailOTP userData={userData} />}
      />

      {/* Step 3: Send Mobile OTP */}
      <Route
        path="send-mobile-otp"
        element={<SendMobileOTP userData={userData} setUserData={setUserData} />}
      />

      {/* Step 4: Verify Mobile OTP */}
      <Route
        path="verify-mobile-otp"
        element={<VerifyMobileOTP userData={userData} />}
      />

      {/* Step 5: Set Password */}
      <Route
        path="set-password"
        element={<NewPasswordForm userData={userData} />}
      />
    </Routes>
  );
}
