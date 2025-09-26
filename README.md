# Fullstack Authentication Project

This is a **fullstack project** built with **React (frontend)** and **FastAPI (backend)**.  
It includes JWT authentication, protected routes, and user management.
---

## 📂 Project Structure

frontend/ # React + Vite app
backend/ # FastAPI app
screenshots/ # Project screenshots
README.md

---

## Features

-  JWT Authentication (Login, Register, Logout)
-  User Management (CRUD)
-  Protected Routes (Frontend & Backend)
-  Email OTP for password reset
-  Modern UI (React + Tailwind)
-  FastAPI + SQLAlchemy backend
-  Password Format & Security
----We use **bcrypt** for password hashing to ensure strong security
---


## Getting Started

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn index:app --reload
API will run at: http://localhost:8000

---


### FrontEnd (FastAPI)
cd frontend
npm install
npm run dev
Frontend will run at: http://localhost:5173

## 📸 Screenshots

### Login Page
https://github.com/abhi3184/user_authentication/blob/main/screenshots/login.png?raw=true

### Dashboard
[![Dashboard](screenshots/login.png)](https://github.com/abhi3184/user_authentication/blob/dc4fbb648529c93a9820127123f8f9db850510ea/screenshots/dashboard.png)

### ForgetPassword Flow
![ForgetPassword](./screenshots/forgetPassword.png)
![VerifyOtps](./screenshots/verify_otps.png)
![SetPassword](./screenshots/setpassword.png)

### Registration
![Registration](./screenshots/registration_send_otp.png)
![Registration](./screenshots/registration_verify_email_otp.png)
![Registration](./screenshots/registration_send_mobile_otp.png)
![Registration](./screenshots/verify_mobile_otp.png)
![SetPassword](./screenshots/setpassword.png)






