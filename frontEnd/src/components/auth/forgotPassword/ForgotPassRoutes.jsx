import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SendOTP  from "./SendOTP";
import SetNewPassword from './Passwordreset'
import VerifyOTP from './VerifyOTP'


export default function UserRegistration() {
  
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    mobile: "",
  });

  return (
    <Routes>
      <Route
        path="/"
        element={<SendOTP userData={userData}  setUserData={setUserData}/>}
      />
      <Route
        path="verify-otp"
        element={<VerifyOTP userData={userData} setUserData={setUserData}/>}
      />
      <Route
        path="set-password"
        element={<SetNewPassword userData={userData}/>}
      />
    </Routes>
  );
}
