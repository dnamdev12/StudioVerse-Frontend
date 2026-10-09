import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../auth/AuthLayout";
import PhoneInput, { COUNTRIES } from "../auth/PhoneInput";
import { signupUser } from "../../api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form) => {
  const errors = {};
  if (form.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (form.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
  if (form.mobile.length < 7) errors.mobile = "Enter a valid mobile number";
  if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
};

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "US",
    mobile: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const errors = validate(form);
  const canSubmit = agreed && !submitting && Object.keys(errors).length === 0;

  const set = (name) => (value) => setForm((f) => ({ ...f, [name]: value }));
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));
  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const dial = COUNTRIES.find((c) => c.code === form.country).dial;
    setSubmitting(true);
    try {
      const data = await signupUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobile: `${dial}${form.mobile}`,
        password: form.password,
      });
      toast.success(data.message || "Account created");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const textField = (name, label, placeholder, type = "text") => (
    <div className={`auth-field ${errorFor(name) ? "has-error" : ""}`}>
      <label className="auth-label" htmlFor={`signup-${name}`}>
        {label}<span className="req">*</span>
      </label>
      <input
        id={`signup-${name}`}
        className="auth-input"
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => set(name)(e.target.value)}
        onBlur={blur(name)}
      />
      {errorFor(name) && <span className="auth-error">{errorFor(name)}</span>}
    </div>
  );

  return (
    <AuthLayout initialSlide={4}>
      <div className="auth-signup">
        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Get started by filling in your details below.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {textField("firstName", "First Name", "Enter your first name")}
          {textField("lastName", "Last Name", "Enter your last name")}
          {textField("email", "Email", "Enter your email", "email")}

          <div className={`auth-field ${errorFor("mobile") ? "has-error" : ""}`} onBlur={blur("mobile")}>
            <label className="auth-label" htmlFor="signup-mobile">
              Mobile Number<span className="req">*</span>
            </label>
            <PhoneInput
              id="signup-mobile"
              country={form.country}
              onCountryChange={set("country")}
              value={form.mobile}
              onChange={set("mobile")}
              placeholder="Enter mobile number"
            />
            {errorFor("mobile") && <span className="auth-error">{errorFor("mobile")}</span>}
          </div>

          {textField("password", "Password", "Create a password", "password")}

          <label className="auth-check">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              By creating an account, you agree to ReelTrak{" "}
              <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy.</a>
            </span>
          </label>

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            {submitting ? "Creating account..." : "Next"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
