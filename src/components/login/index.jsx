import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../auth/AuthLayout";
import PhoneInput, { COUNTRIES } from "../auth/PhoneInput";
import { loginUser } from "../../api";

const Login = () => {
  const [country, setCountry] = useState("US");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValid = mobile.length >= 7 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    const dial = COUNTRIES.find((c) => c.code === country).dial;
    const fullMobile = `${dial}${mobile}`;

    setSubmitting(true);
    try {
      const data = await loginUser({ mobile: fullMobile });
      toast.success(data.message || "OTP sent");
      navigate("/verify-otp", { state: { mobile: fullMobile } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout initialSlide={1}>
      <div className="auth-login">
        <h1 className="auth-title">Welcome to StudioVerse</h1>
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
            {submitting ? "Sending OTP..." : "Next"}
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
