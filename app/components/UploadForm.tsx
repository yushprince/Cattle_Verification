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
        match_status = "Excellent";
        confidence = "Very High";
        color = "#10b981";
        recommendation = "Same animal";
        match_level = "excellent";
      } else if (similarity >= 0.85) {
        match_status = "High";
        confidence = "High";
        color = "#22c55e";
        recommendation = "Likely same";
        match_level = "high";
      } else if (similarity >= 0.70) {
        match_status = "Moderate";
        confidence = "Moderate";
        color = "#f59e0b";
        recommendation = "Verify manually";
        match_level = "moderate";
      } else if (similarity >= 0.50) {
        match_status = "Low";
        confidence = "Low";
        color = "#ef4444";
        recommendation = "Unlikely same";
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
        label: "P1",
        ...getMatchDetails(sim1)
      },
      pair2: {
        ...getMatchDetails(sim2),
        label: "P2"
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
      setError("Upload all 4 images");
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
      const res = await fetch(`${API_BASE_URL}/compare/`, {
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
      setError("Upload image file");
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
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="grid">
          {/* Pair 1 - Muzzle */}
          <div className="upload-box">
            <div
              className="slot"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop("muzzle1", e)}
              onClick={() => fileInputRefs.muzzle1.current?.click()}
            >
              {previews.muzzle1 ? (
                <>
                  <span className="badge">P1</span>
                  <img src={previews.muzzle1} alt="muzzle 1" className="img" />
                </>
              ) : (
                <div className="empty">
                  <div className="icon">👃</div>
                  <div className="label">Muzzle</div>
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
          <div className="upload-box">
            <div
              className="slot"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop("face1", e)}
              onClick={() => fileInputRefs.face1.current?.click()}
            >
              {previews.face1 ? (
                <>
                  <span className="badge">P1</span>
                  <img src={previews.face1} alt="face 1" className="img" />
                </>
              ) : (
                <div className="empty">
                  <div className="icon">🐕</div>
                  <div className="label">Face</div>
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

          <div className="divider"></div>

          {/* Pair 2 - Muzzle */}
          <div className="upload-box">
            <div
              className="slot"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop("muzzle2", e)}
              onClick={() => fileInputRefs.muzzle2.current?.click()}
            >
              {previews.muzzle2 ? (
                <>
                  <span className="badge">P2</span>
                  <img src={previews.muzzle2} alt="muzzle 2" className="img" />
                </>
              ) : (
                <div className="empty">
                  <div className="icon">👃</div>
                  <div className="label">Muzzle</div>
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
          <div className="upload-box">
            <div
              className="slot"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop("face2", e)}
              onClick={() => fileInputRefs.face2.current?.click()}
            >
              {previews.face2 ? (
                <>
                  <span className="badge">P2</span>
                  <img src={previews.face2} alt="face 2" className="img" />
                </>
              ) : (
                <div className="empty">
                  <div className="icon">🐕</div>
                  <div className="label">Face</div>
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

        <div className="btn-group">
          {(previews.muzzle1 || previews.face1 || previews.muzzle2 || previews.face2) && (
            <button type="button" className="btn btn-clear" onClick={clearAll} disabled={loading}>
              Clear
            </button>
          )}
          <button
            className="btn btn-main"
            type="submit"
            disabled={loading || !images.muzzle1 || !images.face1 || !images.muzzle2 || !images.face2}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              "Compare"
            )}
          </button>
        </div>

        {loading && progress > 0 && (
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {error && <div className="error">⚠️ {error}</div>}
      </form>

      {result && result.pair1 && result.pair2 && (
        <div className="results">
          <h3 className="title">Results</h3>
          
          <div className="results-grid">
            <div className="result">
              <div className="result-label">{result.pair1.label}</div>
              <div className="result-value" style={{ color: result.pair1.color }}>
                {result.pair1.similarity_percentage}%
              </div>
              <div className="status" style={{ 
                backgroundColor: `${result.pair1.color}20`,
                color: result.pair1.color
              }}>
                {result.pair1.match_status}
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ 
                  width: `${result.pair1.similarity_percentage}%`,
                  backgroundColor: result.pair1.color
                }}/>
              </div>
              <div className="rec">{result.pair1.recommendation}</div>
            </div>

            <div className="result">
              <div className="result-label">{result.pair2.label}</div>
              <div className="result-value" style={{ color: result.pair2.color }}>
                {result.pair2.similarity_percentage}%
              </div>
              <div className="status" style={{ 
                backgroundColor: `${result.pair2.color}20`,
                color: result.pair2.color
              }}>
                {result.pair2.match_status}
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ 
                  width: `${result.pair2.similarity_percentage}%`,
                  backgroundColor: result.pair2.color
                }}/>
              </div>
              <div className="rec">{result.pair2.recommendation}</div>
            </div>
          </div>

          {result.analysis && (
            <div className="analysis">
              <div className="analysis-title">Analysis</div>
              <div className="analysis-grid">
                <div className="stat">
                  <div className="stat-label">Avg</div>
                  <div className="stat-value">{result.analysis.average_similarity}%</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Consistency</div>
                  <div className="stat-value">{result.analysis.consistency}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Diff</div>
                  <div className="stat-value">{result.analysis.similarity_difference}%</div>
                </div>
                {result.summary && (
                  <div className="stat">
                    <div className="stat-label">Confidence</div>
                    <div className="stat-value">{result.summary.overall_confidence}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}