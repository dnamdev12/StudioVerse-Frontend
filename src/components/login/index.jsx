import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../auth/AuthLayout";
import PhoneInput, { COUNTRIES } from "../auth/PhoneInput";

const Login = () => {
  const [country, setCountry] = useState("US");
  const [mobile, setMobile] = useState("");

  const isValid = mobile.length >= 7;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    const dial = COUNTRIES.find((c) => c.code === country).dial;
    // TODO: call the backend to send a verification code to `${dial}${mobile}`.
    toast.info(`Verification code will be sent to ${dial} ${mobile}`);
  };

  return (
    <AuthLayout initialSlide={1}>
      <div className="auth-login">
        <h1 className="auth-title">Welcome to Reeltrak</h1>
        <p className="auth-subtitle">
          Enter your mobile number and we will text you a verification code
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-mobile">
              Mobile Number<span className="req">*</span>
            </label>
            <PhoneInput
              id="login-mobile"
              country={country}
              onCountryChange={setCountry}
              value={mobile}
              onChange={setMobile}
              placeholder="Enter your number"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={!isValid}>
            Next
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account yet? <Link to="/signup">Signup Now</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
