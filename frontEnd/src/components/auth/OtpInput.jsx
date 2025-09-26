import React, { useState } from "react";
import OTPInput from "react-otp-input";

export default function OtpBox({ value, onChange }) {
  const [otp, setOtp] = useState("");

  return (
    <div>
      <OTPInput
        value={value}  
        onChange={onChange}
        numInputs={6}
        renderInput={(props) => <input {...props} />}
        containerStyle={{
          display: "flex",
          justifyContent: "center",
          gap: "10px", // space between boxes
        }}
        inputStyle={{
          width: "3rem",
          height: "3.2rem",
          fontSize: "1.5rem",
          borderRadius: "10px",
          border: "2px solid #e0e0e0",
          textAlign: "center",
          outline: "none",
          transition: "all 0.2s ease-in-out",
        }}
        focusStyle={{
          border: "2px solid #4F46E5", // Indigo border on focus
          boxShadow: "0 0 6px rgba(79,70,229,0.4)",
        }}
      />

    </div>
  );
}
