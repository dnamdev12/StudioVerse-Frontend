import React, { useEffect, useRef, useState } from "react";

// Free address search from OpenStreetMap (no API key needed).
const SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const DEBOUNCE_MS = 500;

// Convert an OpenStreetMap result into our form's address fields.
const toAddress = (place) => {
  const a = place.address || {};
  return {
    location: place.display_name,
    locationName: place.name || place.display_name.split(",")[0],
    addressLine1: [a.house_number, a.road].filter(Boolean).join(" ") || a.neighbourhood || "",
    zip: a.postcode || "",
    city: a.city || a.town || a.village || a.county || "",
    state: a.state || "",
    latitude: Number(place.lat).toFixed(6),
    longitude: Number(place.lon).toFixed(6),
  };
};

const LocationSearch = ({ id, value, onChange, onSelect, onBlur, placeholder }) => {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const typedRef = useRef(false); // only search when the user typed, not when a value is filled in
  const wrapRef = useRef(null);

  // Search a short while after the user stops typing.
  useEffect(() => {
    if (!typedRef.current || value.trim().length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: value,
          format: "jsonv2",
          addressdetails: "1",
          limit: "5",
        });
        const res = await fetch(`${SEARCH_URL}?${params}`, { signal: controller.signal });
        setResults(await res.json());
        setOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (place) => {
    typedRef.current = false;
    setOpen(false);
    setResults([]);
    onSelect(toAddress(place));
  };

  return (
    <div className="location-search" ref={wrapRef}>
      <input
        id={id}
        className="studio-input"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(e) => {
          typedRef.current = true;
          onChange(e.target.value);
        }}
        onFocus={() => results.length && setOpen(true)}
        onBlur={onBlur}
      />
      <svg viewBox="0 0 24 24" width="22" height="22" className="location-search-icon">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>

      {open && (loading || results.length > 0) && (
        <ul className="location-results">
          {loading && <li className="location-results-note">Searching...</li>}
          {!loading &&
            results.map((place) => (
              <li key={place.place_id}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(place)}>
                  {place.display_name}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
