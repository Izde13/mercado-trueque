import React, { useCallback, useMemo, useRef, useState } from "react";
import "./UploadMedia.css";

const DEFAULT_ACCEPT = "image/*";
const bytesToMB = (b) => +(b / (1024 * 1024)).toFixed(2);

const UploadMedia = ({
  title = "Upload files",
  subtitle = "Select and upload the files of your choice",
  accept = DEFAULT_ACCEPT,
  maxSizeMB = 50,
  multiple = true,
  onChange,
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const imageExts = useMemo(() => [".jpg", ".jpeg", ".png", ".webp", ".gif"], []);
  const isImage = (file) => {
    const t = (file.type || "").toLowerCase();
    return t.startsWith("image/") || imageExts.some((ext) => file.name.toLowerCase().endsWith(ext));
  };

  const validateFiles = useCallback(
    (picked) => {
      const ok = [], errs = [];
      [...picked].forEach((file) => {
        if (!isImage(file)) {
          errs.push(`“${file.name}” no es una imagen válida.`);
          return;
        }
        if (bytesToMB(file.size) > maxSizeMB) {
          errs.push(`“${file.name}” supera ${maxSizeMB}MB.`);
          return;
        }
        ok.push(file);
      });
      return { ok, errs };
    },
    [maxSizeMB]
  );

  const applyFiles = useCallback(
    (picked) => {
      const { ok, errs } = validateFiles(picked);
      setErrors(errs);
      setFiles((prev) => {
        const next = multiple ? [...prev, ...ok] : ok.slice(0, 1);
        onChange?.(next);
        return next;
      });
    },
    [multiple, onChange, validateFiles]
  );

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) applyFiles(e.dataTransfer.files);
  };

  const onBrowse = (e) => {
    if (e.target.files?.length) applyFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      onChange?.(next);
      return next;
    });
  };

  return (
    <section className="um-card">
      <header className="um-header">
        <h2 className="um-title">{title}</h2>
        <p className="um-subtitle">{subtitle}</p>
      </header>

      <div
        className={`um-dropzone ${dragActive ? "is-drag" : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        aria-label="Elige una imagen o arrástrala aquí"
      >
        <CloudIcon />

        <p className="um-drop-hint">
          Choose an image or drag &amp; drop it here
        </p>
        <p className="um-drop-meta">
          JPG, PNG, WEBP, GIF · hasta {maxSizeMB}MB
        </p>

        <button
          type="button"
          className="um-browse"
          onClick={() => inputRef.current?.click()}
        >
          Browse File
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onBrowse}
          className="um-input"
        />
      </div>

      {files.length > 0 && (
        <ul className="um-filelist">
          {files.map((file, idx) => (
            <li key={idx} className="um-fileitem">
              <div className="um-thumb">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                />
              </div>
              <div className="um-fileinfo">
                <span className="um-filename" title={file.name}>
                  {file.name}
                </span>
                <span className="um-filesize">{bytesToMB(file.size)} MB</span>
              </div>
              <button
                type="button"
                className="um-remove"
                onClick={() => removeFile(idx)}
                aria-label={`Quitar ${file.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors.length > 0 && (
        <div className="um-errors" role="alert">
          {errors.map((m, i) => (
            <p key={i}>• {m}</p>
          ))}
        </div>
      )}

      <div className="um-footerbar" aria-hidden="true" />
    </section>
  );
};

export default UploadMedia;

/* ==== Icono nube ==== */
function CloudIcon() {
  return (
    <svg
      className="um-cloud"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M6.5 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.9 7a4.6 4.6 0 0 1 .6 9.16H6.5zm6-4.5V9.75a.75.75 0 0 0-1.5 0V13.5L9.53 11.0a.75.75 0 1 0-1.06 1.06l3.0 3.0a.75.75 0 0 0 1.06 0l3.0-3.0a.75.75 0 0 0-1.06-1.06L12.5 13.5z" />
    </svg>
  );
}
