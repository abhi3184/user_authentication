import React, { useState } from "react";
import UserLogin from "./userLogin/UserLogin";
import UserEmailVerification from "./userRegistration/UserEmailVerification";
import ForgotPassword from "./forgetPassword/ForgetPassword";

export default function AuthPage() {
  const [showPage, setShowPage] = useState("login"); // default = login

  return (
    <>
    
      {showPage === "login" && (
        <UserLogin
          onForgot={() => setShowPage("forgot")}
          onVerify={() => setShowPage("verify")}
        />
      )}

      {showPage === "forgot" && (
        <ForgotPassword onBack={() => setShowPage("login")} />
      )}

      {showPage === "verify" && (
        <UserEmailVerification onBack={() => setShowPage("login")}
        onComplete={() => setShowPage("login")} />
      )}
    </>
  );
}
