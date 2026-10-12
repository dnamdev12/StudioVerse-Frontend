import React, { useEffect, useRef, useState } from "react";
import { fileUrl } from "../../api";

// Dashed upload box. `file` is a newly chosen File, `existing` is a file the
// studio already has ({ url, originalName }). Shows a preview of whichever is set.
const FileDrop = ({ label, hint, accept, isImage, file, existing, onChange, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Make a temporary URL so a chosen image can be previewed before upload.
  useEffect(() => {
    if (!file || !isImage) return setPreviewUrl("");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  const pick = (chosen) => {
    if (chosen) onChange(chosen);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const name = file?.name || existing?.originalName;
  const imageSrc = previewUrl || (isImage && existing ? fileUrl(existing.url) : "");

  return (
    <div className="file-drop-wrap">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = ""; // allow picking the same file again
        }}
      />

      {name ? (
        <div className="file-drop file-drop--filled">
          {imageSrc ? (
            <img src={imageSrc} alt={name} className="file-drop-preview" />
          ) : (
            <div className="file-drop-doc">
              <FileIcon />
              {existing && !file ? (
                <a href={fileUrl(existing.url)} target="_blank" rel="noreferrer">
                  {name}
                </a>
              ) : (
                <span>{name}</span>
              )}
            </div>
          )}
          <div className="file-drop-actions">
            <button type="button" onClick={() => inputRef.current.click()}>
              Replace
            </button>
            <button type="button" className="danger" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`file-drop ${dragging ? "is-dragging" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <ImageAddIcon />
          <strong>{label}</strong>
          <em>{hint}</em>
        </button>
      )}
    </div>
  );
};

const ImageAddIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" className="file-drop-icon">
    <path d="M14 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6M4 16l4-4 4 4 3-3 5 5M18 2v6M15 5h6" />
    <circle cx="9" cy="8.5" r="1.5" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" className="file-drop-icon">
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

export default FileDrop;
