"use client";
import { useState, useRef } from "react";

export default function UploadForm() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Please select an image first");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        throw new Error("Prediction failed. Please try again.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function clearImage() {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .upload-card {
          background: white;
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(100, 100, 255, 0.08),
                      0 2px 15px rgba(100, 100, 255, 0.05);
          max-width: 650px;
          width: 100%;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .upload-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(102, 126, 234, 0.6),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .upload-zone {
          position: relative;
          border: 2px dashed ${dragActive 
            ? "rgba(102, 126, 234, 0.5)" 
            : "rgba(102, 126, 234, 0.25)"};
          padding: 3rem 2rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: ${dragActive
            ? "rgba(102, 126, 234, 0.05)"
            : "rgba(248, 250, 255, 0.8)"};
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-zone:hover {
          border-color: rgba(102, 126, 234, 0.5);
          background: rgba(102, 126, 234, 0.03);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.12);
        }

        .upload-content {
          text-align: center;
          width: 100%;
        }

        .preview-image {
          width: 100%;
          max-height: 400px;
          object-fit: contain;
          border-radius: 16px;
          animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .upload-icon {
          font-size: 4.5rem;
          margin-bottom: 1.5rem;
          opacity: 0.7;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 4px 10px rgba(102, 126, 234, 0.2));
        }

        .upload-text {
          font-size: 1.2rem;
          color: #2d3748;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .upload-subtext {
          font-size: 0.95rem;
          color: #718096;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          flex: 1;
          min-width: 160px;
          padding: 1.1rem 2rem;
          border-radius: 16px;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.3),
                      0 2px 10px rgba(102, 126, 234, 0.2);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(102, 126, 234, 0.4),
                      0 4px 15px rgba(102, 126, 234, 0.25);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 2px solid rgba(102, 126, 234, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(102, 126, 234, 0.05);
          border-color: rgba(102, 126, 234, 0.5);
          transform: translateY(-2px);
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-right: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
          background-size: 200% 100%;
          transition: width 0.3s ease;
          width: ${progress}%;
          box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
          animation: shimmer 2s infinite;
        }

        .result-card {
          margin-top: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(240, 147, 251, 0.03) 100%);
          border-radius: 20px;
          border: 2px solid rgba(102, 126, 234, 0.15);
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .result-title {
          font-size: 1.4rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          margin-bottom: 1rem;
          background: white;
          border-radius: 14px;
          border-left: 4px solid #667eea;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.08);
          transition: all 0.3s ease;
        }

        .result-item:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.15);
        }

        .result-label {
          font-weight: 600;
          color: #4a5568;
          font-size: 1rem;
        }

        .result-value {
          font-size: 1.15rem;
          font-weight: 800;
          color: white;
          padding: 0.6rem 1.4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .error-message {
          padding: 1.2rem;
          background: rgba(248, 113, 113, 0.08);
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 14px;
          color: #dc2626;
          margin-top: 1rem;
          animation: scaleIn 0.3s ease;
          font-weight: 600;
        }

        .image-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding: 0.9rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #4a5568;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .upload-card {
            padding: 1.75rem;
          }

          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="upload-card">
        <form onSubmit={handleSubmit} className="form-container">
          <div
            className="upload-zone"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="upload-content">
                <img src={preview} alt="preview" className="preview-image" />
                {image && (
                  <div className="image-info">
                    <span>📁 {image.name}</span>
                    <span>{(image.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-content">
                <div className="upload-icon">
                  {dragActive ? "⬇️" : "📤"}
                </div>
                <div className="upload-text">
                  {dragActive ? "Drop your image here" : "Click or drag image to upload"}
                </div>
                <div className="upload-subtext">
                  Supports JPG, PNG, WebP • Max 10MB
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <div className="button-group">
            {preview && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearImage}
                disabled={loading}
              >
                🔄 Clear
              </button>
            )}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !image}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing...
                </>
              ) : (
                "🚀 Predict"
              )}
            </button>
          </div>

          {loading && progress > 0 && (
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          )}

          {error && <div className="error-message">⚠️ {error}</div>}
        </form>

        {result && (
          <div className="result-card">
            <h3 className="result-title">🎯 Prediction Results</h3>
            <div className="result-item">
              <span className="result-label">Model 1 Prediction</span>
              <span className="result-value">{result.model1_prediction}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Model 2 Prediction</span>
              <span className="result-value">{result.model2_prediction}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}