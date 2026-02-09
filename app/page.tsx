"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #fef3ff 50%, #f0f9ff 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 1rem 2rem;
        }

        .hero-section {
          max-width: 600px;
          text-align: center;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: white;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          border: 1.5px solid #e5e7eb;
          color: #667eea;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 auto 2rem;
          font-weight: 500;
        }

        .cta-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .btn {
          padding: 0.85rem 2rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
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

        .features-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          max-width: 600px;
          width: 100%;
        }

        .feature-card {
          background: white;
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          gap: 1rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .feature-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .feature-content {
          flex: 1;
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 0.4rem;
          color: #111827;
        }

        .feature-description {
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .tech-stack {
          margin-top: 3rem;
          padding: 1.25rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .tech-title {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
          color: #6b7280;
        }

        .tech-badges {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tech-badge {
          padding: 0.5rem 1rem;
          background: #fafbff;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.75rem;
          border: 1px solid #e5e7eb;
          color: #667eea;
        }

        @media (min-width: 641px) {
          .home-container {
            padding: 6rem 2rem 3rem;
          }

          .hero-section {
            max-width: 900px;
          }

          .hero-badge {
            padding: 0.65rem 2rem;
            font-size: 0.95rem;
            margin-bottom: 2.5rem;
          }

          .main-title {
            font-size: 4.5rem;
            margin-bottom: 1.5rem;
            letter-spacing: -2px;
          }

          .subtitle {
            font-size: 1.3rem;
            margin-bottom: 3rem;
          }

          .cta-buttons {
            gap: 1.5rem;
            margin-bottom: 4rem;
          }

          .btn {
            padding: 1.2rem 3rem;
            font-size: 1.05rem;
          }

          .features-section {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            max-width: 1200px;
          }

          .feature-card {
            padding: 2rem;
            flex-direction: column;
            text-align: center;
            border-radius: 20px;
          }

          .feature-icon {
            font-size: 3.5rem;
          }

          .feature-title {
            font-size: 1.3rem;
            margin-bottom: 0.75rem;
          }

          .feature-description {
            font-size: 0.95rem;
          }

          .tech-stack {
            padding: 2rem;
            border-radius: 20px;
          }

          .tech-title {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }

          .tech-badges {
            gap: 1rem;
          }

          .tech-badge {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="home-container">
        <div className="hero-section">
          <div className="hero-badge">✨ PyTorch & Next.js</div>

          <h1 className="main-title">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Image Recognition
          </h1>

          <p className="subtitle">
            Experience machine learning with our dual-model prediction system. 
            Upload images and get instant classifications.
          </p>

          <div className="cta-buttons">
            <Link href="/dashboard" className="btn btn-primary">
              🚀 Try it Now
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              📖 Learn More
            </Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-content">
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Get predictions in under 2 seconds with optimized ML pipeline
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Images processed securely and never stored on servers
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-content">
              <h3 className="feature-title">Highly Accurate</h3>
              <p className="feature-description">
                Dual-model system ensures 95%+ accuracy across categories
              </p>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <div className="tech-title">Built with cutting-edge technology</div>
          <div className="tech-badges">
            <span className="tech-badge">🔥 PyTorch</span>
            <span className="tech-badge">⚛️ Next.js</span>
            <span className="tech-badge">🐍 Django</span>
            <span className="tech-badge">🎨 React</span>
          </div>
        </div>
      </div>
    </>
  );
}