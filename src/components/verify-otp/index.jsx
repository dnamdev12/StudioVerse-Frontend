import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../auth/AuthLayout";
import { loginUser, verifyOtp } from "../../api";
import { saveSession } from "../../auth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60; // matches the backend's 1 minute resend wait

const VerifyOtp = () => {
  const { state } = useLocation();
  const mobile = state?.mobile;
  const navigate = useNavigate();

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputs = useRef([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Opened directly (e.g. refresh) without a number from the login step.
  if (!mobile) return <Navigate to="/login" replace />;

  const otp = digits.join("");
  const canSubmit = otp.length === OTP_LENGTH && !submitting;

  const focus = (i) => inputs.current[Math.max(0, Math.min(i, OTP_LENGTH - 1))]?.focus();

  const fillFrom = (start, value) => {
    const chars = value.replace(/\D/g, "").slice(0, OTP_LENGTH - start).split("");
    if (!chars.length) return;
    setDigits((d) => {
      const next = [...d];
      chars.forEach((c, k) => (next[start + k] = c));
      return next;
    });
    focus(start + chars.length);
  };

  const handleChange = (i) => (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setDigits((d) => d.map((v, k) => (k === i ? "" : v)));
      return;
    }
    // Typing over a filled box gives "old + new"; keep only the new digit.
    // Longer values come from SMS autofill and are spread across the boxes.
    fillFrom(i, digits[i] && value.length === 2 ? value.replace(digits[i], "") : value);
  };

  const handleKeyDown = (i) => (e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setDigits((d) => d.map((v, k) => (k === i - 1 ? "" : v)));
      focus(i - 1);
    } else if (e.key === "ArrowLeft") {
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      focus(i + 1);
    }
  };

  const handlePaste = (i) => (e) => {
    e.preventDefault();
    fillFrom(i, e.clipboardData.getData("text"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const data = await verifyOtp({ mobile, otp });
      saveSession(data);
      toast.success(data.message || "Logged in");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message);
      setDigits(Array(OTP_LENGTH).fill(""));
      focus(0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    try {
      const data = await loginUser({ mobile });
      toast.success(data.message || "OTP sent");
      setDigits(Array(OTP_LENGTH).fill(""));
      setResendIn(RESEND_SECONDS);
      focus(0);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AuthLayout initialSlide={1}>
      <div className="auth-login">
        <h1 className="auth-title">Verify your number</h1>
        <p className="auth-subtitle">
          Enter the 6-digit code we sent to <strong>{mobile}</strong>
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-otp" role="group" aria-label="One-time password">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                className="auth-otp-box"
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={OTP_LENGTH}
                value={digit}
                onChange={handleChange(i)}
                onKeyDown={handleKeyDown(i)}
                onPaste={handlePaste(i)}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            {submitting ? "Verifying..." : "Verify & Login"}
          </button>
        </form>

        <p className="auth-switch">
          Didn&apos;t get the code?{" "}
          {resendIn > 0 ? (
            <span className="auth-muted">Resend in {resendIn}s</span>
          ) : (
            <button type="button" className="auth-link-btn" onClick={handleResend}>
              Resend OTP
            </button>
          )}
        </p>
        <p className="auth-switch auth-switch--tight">
          <Link to="/login">Change mobile number</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
