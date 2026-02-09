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

  function normalizeResult(data: any): ComparisonResult {
    if (data.pair1 && data.pair1.similarity_score !== undefined) {
      return data;
    }
    
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
        label: "Pair 1",
        ...getMatchDetails(sim1)
      },
      pair2: {
        ...getMatchDetails(sim2),
        label: "Pair 2"
      },
      analysis: {
        average_similarity: Math.round(avg * 10000) / 100,
        similarity_difference: Math.round(diff * 10000) / 100,
        consistency: diff < 0.1 ? "High" : diff < 0.2 ? "Moderate" : "Low"
      },
      cross_comparison: {
        muzzle_similarity: 0,
        face_similarity: 0,
        interpretation: "Cross-comparison not available"
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
      setError("API URL not configured");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!images.muzzle1 || !images.face1 || !images.muzzle2 || !images.face2) {
      setError("Please upload all 4 images");
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
        throw new Error("Comparison failed");
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
        .compare-card {
          background: white;
          padding: 1rem;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          max-width: 100%;
          width: 100%;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .upload-item {
          position: relative;
        }

        .upload-slot {
          position: relative;
          border: 1.5px dashed #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .upload-slot:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .upload-slot:active {
          transform: scale(0.98);
        }

        .upload-content {
          text-align: center;
          padding: 0.5rem;
        }

        .upload-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .upload-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.25rem;
        }

        .upload-text {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 500;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .image-badge {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(102, 126, 234, 0.9);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          z-index: 1;
        }

        .pair-divider {
          grid-column: 1 / -1;
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 0.5rem 0;
        }

        .button-group {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 10px;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 1.5px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f8f9ff;
          border-color: #667eea;
        }

        .loading-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.6s linear infinite;
          margin-right: 0.4rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .progress-bar {
          width: 100%;
          height: 3px;
          background: #f3f4f6;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
          width: ${progress}%;
        }

        .error-message {
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .result-card {
          margin-top: 1.5rem;
        }

        .result-title {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          text-align: center;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .result-item {
          padding: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          border: 1px solid #f3f4f6;
        }

        .result-label {
          font-weight: 700;
          color: #374151;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .similarity-value {
          font-size: 2rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .match-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }

        .confidence-badge {
          display: inline-block;
          padding: 0.25rem 0.6rem;
          border-radius: 5px;
          font-size: 0.65rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .similarity-bar {
          width: 100%;
          height: 6px;
          background: #f3f4f6;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 0.75rem;
        }

        .similarity-bar-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.75rem;
        }

        .detail-label {
          color: #6b7280;
          font-weight: 600;
        }

        .detail-value {
          color: #111827;
          font-weight: 700;
        }

        .recommendation-box {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f8f9ff;
          border-left: 3px solid #667eea;
          border-radius: 6px;
        }

        .recommendation-text {
          font-size: 0.75rem;
          color: #374151;
          font-weight: 600;
          line-height: 1.4;
        }

        .analysis-section {
          background: #fafbff;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-top: 1rem;
        }

        .analysis-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .analysis-card {
          background: white;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #f3f4f6;
        }

        .analysis-card-title {
          font-size: 0.65rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.4rem;
        }

        .analysis-card-value {
          font-size: 1.3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 640px) {
          .compare-card {
            padding: 0.75rem;
            border-radius: 12px;
          }

          .upload-grid {
            gap: 0.5rem;
          }

          .upload-icon {
            font-size: 1.2rem;
          }

          .upload-label {
            font-size: 0.6rem;
          }

          .upload-text {
            font-size: 0.65rem;
          }

          .btn {
            padding: 0.65rem;
            font-size: 0.8rem;
          }

          .similarity-value {
            font-size: 1.75rem;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 641px) {
          .compare-card {
            padding: 1.5rem;
          }

          .upload-grid {
            grid-template-columns: repeat(4, 1fr);
            max-width: 600px;
            margin: 0 auto;
          }

          .pair-divider {
            display: none;
          }
        }
      `}</style>

      <div className="compare-card">
        <form onSubmit={handleSubmit}>
          <div className="upload-grid">
            {/* Pair 1 - Muzzle */}
            <div className="upload-item">
              <div
                className="upload-slot"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop("muzzle1", e)}
                onClick={() => fileInputRefs.muzzle1.current?.click()}
              >
                {previews.muzzle1 ? (
                  <>
                    <div className="image-badge">P1 🐾</div>
                    <img src={previews.muzzle1} alt="muzzle 1" className="preview-image" />
                  </>
                ) : (
                  <div className="upload-content">
                    <div className="upload-icon">🐾</div>
                    <div className="upload-label">Pair 1</div>
                    <div className="upload-text">Muzzle</div>
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
            </div>

            {/* Pair 1 - Face */}
            <div className="upload-item">
              <div
                className="upload-slot"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop("face1", e)}
                onClick={() => fileInputRefs.face1.current?.click()}
              >
                {previews.face1 ? (
                  <>
                    <div className="image-badge">P1 🦴</div>
                    <img src={previews.face1} alt="face 1" className="preview-image" />
                  </>
                ) : (
                  <div className="upload-content">
                    <div className="upload-icon">🦴</div>
                    <div className="upload-label">Pair 1</div>
                    <div className="upload-text">Face</div>
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

            <div className="pair-divider"></div>

            {/* Pair 2 - Muzzle */}
            <div className="upload-item">
              <div
                className="upload-slot"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop("muzzle2", e)}
                onClick={() => fileInputRefs.muzzle2.current?.click()}
              >
                {previews.muzzle2 ? (
                  <>
                    <div className="image-badge">P2 🐾</div>
                    <img src={previews.muzzle2} alt="muzzle 2" className="preview-image" />
                  </>
                ) : (
                  <div className="upload-content">
                    <div className="upload-icon">🐾</div>
                    <div className="upload-label">Pair 2</div>
                    <div className="upload-text">Muzzle</div>
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
            </div>

            {/* Pair 2 - Face */}
            <div className="upload-item">
              <div
                className="upload-slot"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop("face2", e)}
                onClick={() => fileInputRefs.face2.current?.click()}
              >
                {previews.face2 ? (
                  <>
                    <div className="image-badge">P2 🦴</div>
                    <img src={previews.face2} alt="face 2" className="preview-image" />
                  </>
                ) : (
                  <div className="upload-content">
                    <div className="upload-icon">🦴</div>
                    <div className="upload-label">Pair 2</div>
                    <div className="upload-text">Face</div>
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

          <div className="button-group">
            {(previews.muzzle1 || previews.face1 || previews.muzzle2 || previews.face2) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearAll}
                disabled={loading}
              >
                Clear
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
                "Compare"
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
            <h3 className="result-title">Results</h3>
            
            <div className="results-grid">
              {/* Pair 1 Result */}
              <div className="result-item">
                <div className="result-label">{result.pair1.label}</div>
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
                <div className="similarity-bar">
                  <div 
                    className="similarity-bar-fill"
                    style={{ 
                      width: `${result.pair1.similarity_percentage}%`,
                      backgroundColor: result.pair1.color
                    }}
                  />
                </div>
                <div className="recommendation-box">
                  <div className="recommendation-text">
                    {result.pair1.recommendation}
                  </div>
                </div>
              </div>

              {/* Pair 2 Result */}
              <div className="result-item">
                <div className="result-label">{result.pair2.label}</div>
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
                <div className="similarity-bar">
                  <div 
                    className="similarity-bar-fill"
                    style={{ 
                      width: `${result.pair2.similarity_percentage}%`,
                      backgroundColor: result.pair2.color
                    }}
                  />
                </div>
                <div className="recommendation-box">
                  <div className="recommendation-text">
                    {result.pair2.recommendation}
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Analysis */}
            {result.analysis && (
              <div className="analysis-section">
                <div className="analysis-title">Analysis</div>
                <div className="analysis-grid">
                  <div className="analysis-card">
                    <div className="analysis-card-title">Average</div>
                    <div className="analysis-card-value">{result.analysis.average_similarity}%</div>
                  </div>
                  <div className="analysis-card">
                    <div className="analysis-card-title">Consistency</div>
                    <div className="analysis-card-value">{result.analysis.consistency}</div>
                  </div>
                  <div className="analysis-card">
                    <div className="analysis-card-title">Difference</div>
                    <div className="analysis-card-value">{result.analysis.similarity_difference}%</div>
                  </div>
                  {result.summary && (
                    <div className="analysis-card">
                      <div className="analysis-card-title">Confidence</div>
                      <div className="analysis-card-value">{result.summary.overall_confidence}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}