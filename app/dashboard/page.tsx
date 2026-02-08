"use client";
import UploadForm from "../components/UploadForm";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
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

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #f0f4ff 0%,
            #e8f0ff 25%,
            #f5f0ff 50%,
            #fff0f9 75%,
            #f0f4ff 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          padding: 6rem 2rem 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #2d3748;
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.6s ease;
        }

        .dashboard-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          top: 5%;
          left: 5%;
          animation: float 12s ease-in-out infinite;
        }

        .shape-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          bottom: 5%;
          right: 5%;
          animation: float 15s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          top: 50%;
          left: 50%;
          animation: float 18s ease-in-out infinite;
        }

        .header-section {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(30px) saturate(180%);
          padding: 3rem 3.5rem;
          border-radius: 28px;
          box-shadow: 
            0 20px 60px rgba(102, 126, 234, 0.12),
            0 8px 30px rgba(102, 126, 234, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          text-align: center;
          max-width: 850px;
          width: 100%;
          animation: slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
          border: 1px solid rgba(102, 126, 234, 0.15);
          overflow: hidden;
        }

        .header-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(102, 126, 234, 0.1),
            transparent
          );
          animation: shimmer 4s infinite;
        }

        .header-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 8px 20px rgba(102, 126, 234, 0.3));
        }

        .dashboard-title {
          font-size: 2.8rem;
          margin-bottom: 1.2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }

        .dashboard-subtitle {
          font-size: 1.15rem;
          color: #4a5568;
          line-height: 1.7;
          max-width: 650px;
          margin: 0 auto;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.5rem;
          margin-top: 2.5rem;
          width: 100%;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          padding: 1.75rem;
          border-radius: 20px;
          text-align: center;
          border: 2px solid rgba(102, 126, 234, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-6px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .stat-card:hover::before {
          transform: translateX(0);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
        }

        .content-section {
          width: 100%;
          max-width: 1200px;
          z-index: 1;
          position: relative;
        }

        .tips-section {
          margin-top: 3.5rem;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(30px) saturate(180%);
          border-radius: 24px;
          border: 1px solid rgba(102, 126, 234, 0.15);
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1);
        }

        .tips-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }

        .tip-card {
          padding: 2rem;
          background: white;
          border-radius: 18px;
          border-left: 5px solid #667eea;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
          position: relative;
          overflow: hidden;
        }

        .tip-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(240, 147, 251, 0.05));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .tip-card:hover {
          transform: translateX(10px) translateY(-5px);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.18);
          border-left-color: #764ba2;
        }

        .tip-card:hover::before {
          opacity: 1;
        }

        .tip-icon {
          font-size: 2.8rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 10px rgba(102, 126, 234, 0.2));
        }

        .tip-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #2d3748;
        }

        .tip-description {
          font-size: 0.95rem;
          color: #718096;
          line-height: 1.7;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 5rem 1rem 2rem;
          }

          .header-section {
            padding: 2.5rem 2rem;
          }

          .dashboard-title {
            font-size: 2.2rem;
          }

          .dashboard-subtitle {
            font-size: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>

        <div className="header-section">
          <div className="header-icon">🤖</div>
          <h1 className="dashboard-title">AI Prediction Dashboard</h1>
          <p className="dashboard-subtitle">
            Harness the power of deep learning to analyze and classify images
            with state-of-the-art neural networks
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">2</div>
              <div className="stat-label">Models</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">95%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">&lt;2s</div>
              <div className="stat-label">Response</div>
            </div>
          </div>
          
        </div>
<UploadForm />
        <div className="content-section">
          

          <div className="tips-section">
            <h2 className="tips-title">💡 Tips for Best Results</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">📸</div>
                <div className="tip-title">Quality Matters</div>
                <div className="tip-description">
                  Use clear, well-lit images for the most accurate predictions
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <div className="tip-title">Center Your Subject</div>
                <div className="tip-description">
                  Make sure the main object is centered and clearly visible
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🖼️</div>
                <div className="tip-title">Optimal Format</div>
                <div className="tip-description">
                  JPG and PNG formats work best, keep files under 10MB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}