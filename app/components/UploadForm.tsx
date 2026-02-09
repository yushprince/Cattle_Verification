"use client";
import { useState, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface MatchDetails {
  similarity_score: number;
  similarity_percentage: number;
  match_status: string;
  confidence_level: string;
  color: string;
  recommendation: string;
  match_level: string;
  label?: string;
}

interface ComparisonResult {
  success?: boolean;
  timestamp?: string;
  pair1?: MatchDetails;
  pair2?: MatchDetails;
  pair1_similarity?: number;
  pair2_similarity?: number;
  analysis?: {
    average_similarity: number;
    similarity_difference: number;
    consistency: string;
  };
  cross_comparison?: {
    muzzle_similarity: number;
    face_similarity: number;
    interpretation: string;
  };
  summary?: {
    pair1_match: string;
    pair2_match: string;
    overall_confidence: string;
  };
}

export default function FaceCompareForm() {
  const [images, setImages] = useState({
    muzzle1: null as File | null,
    face1: null as File | null,
    muzzle2: null as File | null,
    face2: null as File | null,
  });
  
  const [previews, setPreviews] = useState({
    muzzle1: null as string | null,
    face1: null as string | null,
    muzzle2: null as string | null,
    face2: null as string | null,
  });
  
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRefs = {
    muzzle1: useRef<HTMLInputElement>(null),
    face1: useRef<HTMLInputElement>(null),
    muzzle2: useRef<HTMLInputElement>(null),
    face2: useRef<HTMLInputElement>(null),
  };

  // Helper function to convert old API format to new format
  function normalizeResult(data: any): ComparisonResult {
    // Check if it's the new format
    if (data.pair1 && data.pair1.similarity_score !== undefined) {
      return data;
    }
    
    // Convert old format to new format
    const getMatchDetails = (similarity: number) => {
      const similarity_percent = similarity * 100;
      
      let match_status, confidence, color, recommendation, match_level;
      
      if (similarity >= 0.95) {
        match_status = "Excellent Match";
        confidence = "Very High";
        color = "#10b981";
        recommendation = "Strong evidence of same animal";
        match_level = "excellent";
      } else if (similarity >= 0.85) {
        match_status = "High Match";
        confidence = "High";
        color = "#22c55e";
        recommendation = "Likely the same animal";
        match_level = "high";
      } else if (similarity >= 0.70) {
        match_status = "Moderate Match";
        confidence = "Moderate";
        color = "#f59e0b";
        recommendation = "Possible match, verify manually";
        match_level = "moderate";
      } else if (similarity >= 0.50) {
        match_status = "Low Match";
        confidence = "Low";
        color = "#ef4444";
        recommendation = "Unlikely to be the same animal";
        match_level = "low";
      } else {
        match_status = "No Match";
        confidence = "Very Low";
        color = "#dc2626";
        recommendation = "Different animals";
        match_level = "none";
      }
      
      return {
        similarity_score: similarity,
        similarity_percentage: Math.round(similarity_percent * 100) / 100,
        match_status,
        confidence_level: confidence,
        color,
        recommendation,
        match_level
      };
    };

    const sim1 = data.pair1_similarity || 0;
    const sim2 = data.pair2_similarity || 0;
    const avg = (sim1 + sim2) / 2;
    const diff = Math.abs(sim1 - sim2);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      pair1: {
        label: "Pair 1: Muzzle ↔ Face",
        ...getMatchDetails(sim1)
      },
      pair2: {
        ...getMatchDetails(sim2),
        label: "Pair 2: Muzzle ↔ Face"
      },
      analysis: {
        average_similarity: Math.round(avg * 10000) / 100,
        similarity_difference: Math.round(diff * 10000) / 100,
        consistency: diff < 0.1 ? "High" : diff < 0.2 ? "Moderate" : "Low"
      },
      cross_comparison: {
        muzzle_similarity: 0,
        face_similarity: 0,
        interpretation: "Cross-comparison not available in old API format"
      },
      summary: {
        pair1_match: getMatchDetails(sim1).match_status,
        pair2_match: getMatchDetails(sim2).match_status,
        overall_confidence: getMatchDetails(sim1 > sim2 ? sim1 : sim2).confidence_level
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!API_BASE_URL) {
      setError("API URL not configured. Please check your .env.local file");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!images.muzzle1 || !images.face1 || !images.muzzle2 || !images.face2) {
      setError("Please upload all 4 images (2 muzzles + 2 faces)");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("img1", images.muzzle1);
    formData.append("img2", images.face1);
    formData.append("img3", images.muzzle2);
    formData.append("img4", images.face2);

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
      const res = await fetch(`${API_BASE_URL}/api/compare/`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        throw new Error("Comparison failed. Please try again.");
      }

      const data = await res.json();
      const normalizedData = normalizeResult(data);
      setResult(normalizedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }

  function handleImageChange(type: keyof typeof images, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFile(type, file);
    }
  }

  function processFile(type: keyof typeof images, file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setImages(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    setResult(null);
    setError(null);
  }

  function handleDrop(type: keyof typeof images, e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(type, e.dataTransfer.files[0]);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function clearAll() {
    setImages({
      muzzle1: null,
      face1: null,
      muzzle2: null,
      face2: null,
    });
    setPreviews({
      muzzle1: null,
      face1: null,
      muzzle2: null,
      face2: null,
    });
    setResult(null);
    setError(null);
    
    Object.values(fileInputRefs).forEach(ref => {
      if (ref.current) ref.current.value = "";
    });
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .compare-card {
          background: white;
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(100, 100, 255, 0.08),
                      0 2px 15px rgba(100, 100, 255, 0.05);
          max-width: 1200px;
          width: 100%;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .compare-card::before {
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
          gap: 2rem;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pairs-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .pair-section {
          background: rgba(248, 250, 255, 0.5);
          padding: 1.5rem;
          border-radius: 20px;
          border: 2px solid rgba(102, 126, 234, 0.15);
        }

        .pair-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .upload-slots {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .upload-slot {
          position: relative;
          border: 2px dashed rgba(102, 126, 234, 0.25);
          padding: 1.5rem;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-slot:hover {
          border-color: rgba(102, 126, 234, 0.5);
          background: rgba(102, 126, 234, 0.03);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }

        .upload-content {
          text-align: center;
          width: 100%;
        }

        .upload-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .upload-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          opacity: 0.7;
        }

        .upload-text {
          font-size: 0.9rem;
          color: #4a5568;
          font-weight: 600;
        }

        .preview-image {
          width: 100%;
          max-height: 160px;
          object-fit: contain;
          border-radius: 12px;
          animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-name {
          font-size: 0.75rem;
          color: #718096;
          margin-top: 0.5rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          padding: 0;
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .result-title {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          text-align: center;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .result-item {
          padding: 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 2px solid rgba(102, 126, 234, 0.1);
        }

        .result-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
        }

        .result-label {
          font-weight: 700;
          color: #4a5568;
          font-size: 1.15rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .similarity-display {
          text-align: center;
        }

        .similarity-value {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          animation: scaleIn 0.6s ease;
        }

        .match-badge {
          display: inline-block;
          padding: 0.6rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          margin: 1rem 0;
        }

        .confidence-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .similarity-bar {
          width: 100%;
          height: 12px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 1.5rem;
        }

        .similarity-bar-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px currentColor;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(102, 126, 234, 0.1);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 0.9rem;
          color: #718096;
          font-weight: 600;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #2d3748;
          font-weight: 700;
        }

        .recommendation-box {
          margin-top: 1.5rem;
          padding: 1.2rem;
          background: rgba(102, 126, 234, 0.05);
          border-left: 4px solid #667eea;
          border-radius: 10px;
        }

        .recommendation-text {
          font-size: 0.95rem;
          color: #4a5568;
          font-weight: 600;
          line-height: 1.6;
        }

        .analysis-section {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(240, 147, 251, 0.03) 100%);
          padding: 2rem;
          border-radius: 20px;
          border: 2px solid rgba(102, 126, 234, 0.15);
          margin-top: 2rem;
        }

        .analysis-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .analysis-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.05);
        }

        .analysis-card-title {
          font-size: 0.85rem;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.75rem;
        }

        .analysis-card-value {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cross-comparison {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          margin-top: 2rem;
          border: 2px solid rgba(102, 126, 234, 0.15);
        }

        .cross-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-message {
          padding: 1.2rem;
          background: rgba(248, 113, 113, 0.08);
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 14px;
          color: #dc2626;
          animation: scaleIn 0.3s ease;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .compare-card {
            padding: 1.75rem;
          }

          .pairs-container {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="compare-card">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="section-title">
            📸 Upload Images for Comparison
          </div>

          <div className="pairs-container">
            {/* Pair 1 */}
            <div className="pair-section">
              <div className="pair-title">🐕 Pair 1</div>
              <div className="upload-slots">
                {/* Muzzle 1 */}
                <div
                  className="upload-slot"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop("muzzle1", e)}
                  onClick={() => fileInputRefs.muzzle1.current?.click()}
                >
                  {previews.muzzle1 ? (
                    <div className="upload-content">
                      <img src={previews.muzzle1} alt="muzzle 1" className="preview-image" />
                      {images.muzzle1 && (
                        <div className="image-name">{images.muzzle1.name}</div>
                      )}
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-label">Muzzle</div>
                      <div className="upload-icon">🐾</div>
                      <div className="upload-text">Click or drag muzzle image</div>
                    </div>
                  )}
                  <input
                    ref={fileInputRefs.muzzle1}
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange("muzzle1", e)}
                    accept="image/*"
                  />
                </div>

                {/* Face 1 */}
                <div
                  className="upload-slot"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop("face1", e)}
                  onClick={() => fileInputRefs.face1.current?.click()}
                >
                  {previews.face1 ? (
                    <div className="upload-content">
                      <img src={previews.face1} alt="face 1" className="preview-image" />
                      {images.face1 && (
                        <div className="image-name">{images.face1.name}</div>
                      )}
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-label">Face</div>
                      <div className="upload-icon">🦴</div>
                      <div className="upload-text">Click or drag face image</div>
                    </div>
                  )}
                  <input
                    ref={fileInputRefs.face1}
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange("face1", e)}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            {/* Pair 2 */}
            <div className="pair-section">
              <div className="pair-title">🐕 Pair 2</div>
              <div className="upload-slots">
                {/* Muzzle 2 */}
                <div
                  className="upload-slot"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop("muzzle2", e)}
                  onClick={() => fileInputRefs.muzzle2.current?.click()}
                >
                  {previews.muzzle2 ? (
                    <div className="upload-content">
                      <img src={previews.muzzle2} alt="muzzle 2" className="preview-image" />
                      {images.muzzle2 && (
                        <div className="image-name">{images.muzzle2.name}</div>
                      )}
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-label">Muzzle</div>
                      <div className="upload-icon">🐾</div>
                      <div className="upload-text">Click or drag muzzle image</div>
                    </div>
                  )}
                  <input
                    ref={fileInputRefs.muzzle2}
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange("muzzle2", e)}
                    accept="image/*"
                  />
                </div>

                {/* Face 2 */}
                <div
                  className="upload-slot"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop("face2", e)}
                  onClick={() => fileInputRefs.face2.current?.click()}
                >
                  {previews.face2 ? (
                    <div className="upload-content">
                      <img src={previews.face2} alt="face 2" className="preview-image" />
                      {images.face2 && (
                        <div className="image-name">{images.face2.name}</div>
                      )}
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-label">Face</div>
                      <div className="upload-icon">🦴</div>
                      <div className="upload-text">Click or drag face image</div>
                    </div>
                  )}
                  <input
                    ref={fileInputRefs.face2}
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange("face2", e)}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="button-group">
            {(previews.muzzle1 || previews.face1 || previews.muzzle2 || previews.face2) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearAll}
                disabled={loading}
              >
                🔄 Clear All
              </button>
            )}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !images.muzzle1 || !images.face1 || !images.muzzle2 || !images.face2}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing...
                </>
              ) : (
                "🔍 Compare Faces"
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

        {result && result.pair1 && result.pair2 && (
          <div className="result-card">
            <h3 className="result-title">🎯 Detailed Comparison Results</h3>
            
            <div className="results-grid">
              {/* Pair 1 Result */}
              <div className="result-item">
                <div className="result-label">{result.pair1.label}</div>
                <div className="similarity-display">
                  <div 
                    className="similarity-value"
                    style={{ color: result.pair1.color }}
                  >
                    {result.pair1.similarity_percentage}%
                  </div>
                  <div 
                    className="match-badge"
                    style={{ 
                      backgroundColor: `${result.pair1.color}20`,
                      color: result.pair1.color
                    }}
                  >
                    {result.pair1.match_status}
                  </div>
                  <div 
                    className="confidence-badge"
                    style={{ 
                      backgroundColor: `${result.pair1.color}15`,
                      color: result.pair1.color
                    }}
                  >
                    Confidence: {result.pair1.confidence_level}
                  </div>
                  <div className="similarity-bar">
                    <div 
                      className="similarity-bar-fill"
                      style={{ 
                        width: `${result.pair1.similarity_percentage}%`,
                        backgroundColor: result.pair1.color,
                        color: result.pair1.color
                      }}
                    />
                  </div>
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <div className="detail-row">
                      <span className="detail-label">Raw Score</span>
                      <span className="detail-value">{result.pair1.similarity_score.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="recommendation-box">
                    <div className="recommendation-text">
                      💡 {result.pair1.recommendation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pair 2 Result */}
              <div className="result-item">
                <div className="result-label">{result.pair2.label}</div>
                <div className="similarity-display">
                  <div 
                    className="similarity-value"
                    style={{ color: result.pair2.color }}
                  >
                    {result.pair2.similarity_percentage}%
                  </div>
                  <div 
                    className="match-badge"
                    style={{ 
                      backgroundColor: `${result.pair2.color}20`,
                      color: result.pair2.color
                    }}
                  >
                    {result.pair2.match_status}
                  </div>
                  <div 
                    className="confidence-badge"
                    style={{ 
                      backgroundColor: `${result.pair2.color}15`,
                      color: result.pair2.color
                    }}
                  >
                    Confidence: {result.pair2.confidence_level}
                  </div>
                  <div className="similarity-bar">
                    <div 
                      className="similarity-bar-fill"
                      style={{ 
                        width: `${result.pair2.similarity_percentage}%`,
                        backgroundColor: result.pair2.color,
                        color: result.pair2.color
                      }}
                    />
                  </div>
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <div className="detail-row">
                      <span className="detail-label">Raw Score</span>
                      <span className="detail-value">{result.pair2.similarity_score.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="recommendation-box">
                    <div className="recommendation-text">
                      💡 {result.pair2.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Analysis */}
            {result.analysis && (
              <div className="analysis-section">
                <div className="analysis-title">📊 Overall Analysis</div>
                <div className="analysis-grid">
                  <div className="analysis-card">
                    <div className="analysis-card-title">Average Similarity</div>
                    <div className="analysis-card-value">{result.analysis.average_similarity}%</div>
                  </div>
                  <div className="analysis-card">
                    <div className="analysis-card-title">Consistency</div>
                    <div className="analysis-card-value">{result.analysis.consistency}</div>
                  </div>
                  <div className="analysis-card">
                    <div className="analysis-card-title">Score Difference</div>
                    <div className="analysis-card-value">{result.analysis.similarity_difference}%</div>
                  </div>
                  {result.summary && (
                    <div className="analysis-card">
                      <div className="analysis-card-title">Overall Confidence</div>
                      <div className="analysis-card-value">{result.summary.overall_confidence}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cross Comparison */}
            {result.cross_comparison && result.cross_comparison.muzzle_similarity > 0 && (
              <div className="cross-comparison">
                <div className="cross-title">🔄 Cross-Pair Comparison</div>
                <div className="detail-row">
                  <span className="detail-label">Muzzle 1 vs Muzzle 2</span>
                  <span className="detail-value">{result.cross_comparison.muzzle_similarity}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Face 1 vs Face 2</span>
                  <span className="detail-value">{result.cross_comparison.face_similarity}%</span>
                </div>
                <div className="recommendation-box">
                  <div className="recommendation-text">
                    🔍 {result.cross_comparison.interpretation}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}