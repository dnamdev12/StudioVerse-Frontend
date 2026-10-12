import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createStudio, getStudio, updateStudio } from "../../api";
import FileDrop from "./FileDrop";
import LocationSearch from "./LocationSearch";
import "./studios.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  location: "",
  locationName: "",
  addressLine1: "",
  addressLine2: "",
  zip: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
};

const REQUIRED = {
  location: "Location is required",
  locationName: "Location name is required",
  addressLine1: "Address line 1 is required",
  zip: "Zip / postal code is required",
  city: "City is required",
  state: "State is required",
};

const inRange = (value, max) => {
  const n = Number(value);
  return value.trim() !== "" && !Number.isNaN(n) && Math.abs(n) <= max;
};

const validate = (form) => {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Studio name must be at least 2 characters";
  for (const [field, message] of Object.entries(REQUIRED)) {
    if (!form[field].trim()) errors[field] = message;
  }
  if (!inRange(form.latitude, 90)) errors.latitude = "Latitude must be between -90 and 90";
  if (!inRange(form.longitude, 180)) errors.longitude = "Longitude must be between -180 and 180";
  return errors;
};

// Turn a studio from the API back into form values (all strings for inputs).
const studioToForm = (studio) => ({
  name: studio.name,
  description: studio.description || "",
  ...Object.fromEntries(
    Object.keys(EMPTY_FORM)
      .filter((key) => key in studio.address)
      .map((key) => [key, String(studio.address[key] ?? "")]),
  ),
});

// One component for both pages: /studios/create and /studios/:id/edit.
const StudioForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Newly chosen files, and the files the studio already had (edit mode).
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [existingDocument, setExistingDocument] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeDocument, setRemoveDocument] = useState(false);

  // Edit mode: load the studio and fill the form.
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getStudio(id)
      .then(({ studio }) => {
        if (cancelled) return;
        setForm(studioToForm(studio));
        setExistingImage(studio.image);
        setExistingDocument(studio.document);
      })
      .catch((err) => {
        toast.error(err.message);
        navigate("/studios", { replace: true });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const errors = validate(form);
  const canSubmit = !submitting && Object.keys(errors).length === 0;

  const set = (name) => (value) => setForm((f) => ({ ...f, [name]: value }));
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));
  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value.trim()));
    if (imageFile) data.append("image", imageFile);
    if (documentFile) data.append("document", documentFile);
    if (removeImage) data.append("removeImage", "true");
    if (removeDocument) data.append("removeDocument", "true");

    setSubmitting(true);
    try {
      const res = isEdit ? await updateStudio(id, data) : await createStudio(data);
      toast.success(res.message);
      navigate("/studios");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, { required = true, children } = {}) => (
    <div className={`studio-field ${errorFor(name) ? "has-error" : ""}`}>
      <label className="studio-label" htmlFor={`studio-${name}`}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      {children}
      {errorFor(name) && <span className="studio-error">{errorFor(name)}</span>}
    </div>
  );

  const textField = (name, label, placeholder, options = {}) =>
    field(name, label, {
      ...options,
      children: (
        <input
          id={`studio-${name}`}
          className="studio-input"
          inputMode={options.inputMode}
          placeholder={placeholder}
          value={form[name]}
          onChange={(e) => set(name)(e.target.value)}
          onBlur={blur(name)}
        />
      ),
    });

  const title = isEdit ? "Edit Studio" : "Create Studio";

  if (loading) return <p className="studio-muted">Loading studio...</p>;

  return (
    <div className="studio-page">
      <h1 className="studio-title">{title}</h1>
      <nav className="studio-breadcrumb">
        <Link to="/studios">Studio Management</Link>
        <span aria-hidden="true">›</span>
        <span className="is-current">{title}</span>
      </nav>

      <form onSubmit={handleSubmit} noValidate>
        <section className="studio-section">
          <h2 className="studio-section-title">Studio Detail</h2>
          <div className="studio-grid studio-grid--1">
            {textField("name", "Studio Name", "Enter studio name")}
          </div>
          {field("description", "Description", {
            required: false,
            children: (
              <textarea
                id="studio-description"
                className="studio-input studio-textarea"
                placeholder="Description"
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
              />
            ),
          })}
        </section>

        <section className="studio-section">
          <h2 className="studio-section-title">Studio Address</h2>
          <div className="studio-grid">
            {field("location", "Location", {
              children: (
                <LocationSearch
                  id="studio-location"
                  placeholder="Select address"
                  value={form.location}
                  onChange={set("location")}
                  onBlur={blur("location")}
                  onSelect={(address) => setForm((f) => ({ ...f, ...address }))}
                />
              ),
            })}
            {textField("locationName", "Location Name", "Enter Location Name")}
            {textField("addressLine1", "Address Line 1", "Enter Address Line 1")}
            {textField("addressLine2", "Address Line 2", "Enter address line 2", { required: false })}
            {textField("zip", "Zip / Postal code", "Enter zip / postal code")}
            {textField("city", "City/Town", "Enter city")}
            {textField("state", "State", "Enter state")}
            {textField("latitude", "Latitude", "Enter Latitude", { inputMode: "decimal" })}
            {textField("longitude", "Longitude", "Enter Longitude", { inputMode: "decimal" })}
          </div>
        </section>

        <section className="studio-section">
          <h2 className="studio-section-title">Attach Studio Image</h2>
          <p className="studio-info">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 11v6M12 7.5v.5" />
            </svg>
            Upload this image in a 2:1 aspect ratio as it will be displayed on the studio
            detail page as a feature graphic.
          </p>
          <FileDrop
            label="Add Image"
            hint="Check the image upload guideline before uploading the image (Recommended)."
            accept="image/jpeg,image/png,image/webp"
            isImage
            file={imageFile}
            existing={existingImage}
            onChange={setImageFile}
            onRemove={() => {
              if (imageFile) return setImageFile(null);
              setExistingImage(null);
              setRemoveImage(true);
            }}
          />
        </section>

        <section className="studio-section">
          <h2 className="studio-section-title">Attach Document</h2>
          <FileDrop
            label="Add Document"
            hint="PDF, Word or image files up to 10 MB."
            accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
            file={documentFile}
            existing={existingDocument}
            onChange={setDocumentFile}
            onRemove={() => {
              if (documentFile) return setDocumentFile(null);
              setExistingDocument(null);
              setRemoveDocument(true);
            }}
          />
        </section>

        <div className="studio-actions">
          <button type="button" className="studio-btn studio-btn--outline" onClick={() => navigate("/studios")}>
            Cancel
          </button>
          <button type="submit" className="studio-btn studio-btn--primary" disabled={!canSubmit}>
            {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudioForm;
