import React from "react";

export const COUNTRIES = [
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "CA", flag: "🇨🇦", dial: "+1" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "IN", flag: "🇮🇳", dial: "+91" },
  { code: "AU", flag: "🇦🇺", dial: "+61" },
];

const PhoneInput = ({ id, country, onCountryChange, value, onChange, placeholder }) => {
  const selected = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];

  return (
    <div className="auth-phone">
      <label className="auth-phone-country">
        <span className="auth-phone-flag">{selected.flag}</span>
        <span>{selected.dial}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" className="auth-phone-caret">
          <path d="M6 9l6 6 6-6" />
        </svg>
        <select
          value={selected.code}
          onChange={(e) => onCountryChange(e.target.value)}
          aria-label="Country code"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code} {c.dial}
            </option>
          ))}
        </select>
      </label>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, "").slice(0, 15))}
      />
    </div>
  );
};

export default PhoneInput;
