"use client";
import FaceCompareForm from "../components/UploadForm";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #fef3ff 50%, #f0f9ff 100%);
          padding: 5rem 1rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-section {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
          text-align: center;
          max-width: 600px;
          width: 100%;
        }

        .header-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .dashboard-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-subtitle {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.5;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .stat-card {
          background: #fafbff;
          padding: 0.75rem;
          border-radius: 10px;
          text-align: center;
          border: 1px solid #e5e7eb;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.65rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .content-section {
          width: 100%;
          max-width: 600px;
        }

        .tips-section {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .tips-title {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tips-grid {
          display: grid;
          gap: 0.75rem;
        }

        .tip-card {
          padding: 1rem;
          background: #fafbff;
          border-radius: 10px;
          border-left: 3px solid #667eea;
          display: flex;
          gap: 0.75rem;
        }

        .tip-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .tip-content {
          flex: 1;
        }

        .tip-title {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #111827;
        }

        .tip-description {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.4;
        }

        @media (min-width: 641px) {
          .dashboard-container {
            padding: 6rem 2rem 3rem;
          }

          .header-section {
            padding: 2rem;
            border-radius: 20px;
            max-width: 800px;
          }

          .header-icon {
            font-size: 3.5rem;
            margin-bottom: 1rem;
          }

          .dashboard-title {
            font-size: 2rem;
            margin-bottom: 0.75rem;
          }

          .dashboard-subtitle {
            font-size: 1rem;
          }

          .stats-grid {
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .stat-card {
            padding: 1.25rem;
            border-radius: 12px;
          }

          .stat-value {
            font-size: 2rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .content-section {
            max-width: 900px;
          }

          .tips-section {
            padding: 2rem;
            border-radius: 20px;
            margin-top: 2.5rem;
          }

          .tips-title {
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
          }

          .tips-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }

          .tip-card {
            padding: 1.5rem;
            border-radius: 12px;
          }

          .tip-icon {
            font-size: 2rem;
          }

          .tip-title {
            font-size: 1rem;
          }

          .tip-description {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="header-section">
          <div className="header-icon">🐶</div>
          <h1 className="dashboard-title">Dog Face Comparison</h1>
          <p className="dashboard-subtitle">
            AI-powered facial recognition to compare dog images using deep learning
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">2</div>
              <div className="stat-label">Pairs</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">4</div>
              <div className="stat-label">Images</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">&lt;3s</div>
              <div className="stat-label">Speed</div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <FaceCompareForm />

         
        </div>
      </div>
    </>
  );
}