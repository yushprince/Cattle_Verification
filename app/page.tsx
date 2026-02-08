"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.85;
          }
        }

        @keyframes gradientMove {
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
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }

        .home-container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #f0f4ff 0%,
            #fef3ff 25%,
            #fff0f9 50%,
            #f0f9ff 75%,
            #f0f4ff 100%
          );
          background-size: 400% 400%;
          animation: gradientMove 20s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #2d3748;
          padding: 6rem 2rem 3rem;
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.8s ease;
        }

        .cursor-glow {
          position: fixed;
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(102, 126, 234, 0.15) 0%,
            rgba(240, 147, 251, 0.1) 30%,
            transparent 70%
          );
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: all 0.15s ease;
          z-index: 0;
          filter: blur(60px);
          left: ${mousePosition.x}%;
          top: ${mousePosition.y}%;
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #667eea, #f093fb);
          border-radius: 50%;
          animation: particleFloat linear infinite;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }

        .hero-section {
          max-width: 950px;
          text-align: center;
          z-index: 1;
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-badge {
          display: inline-block;
          padding: 0.65rem 2rem;
          background: white;
          backdrop-filter: blur(20px);
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          border: 2px solid rgba(102, 126, 234, 0.2);
          animation: pulse 3s ease-in-out infinite;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
          color: #667eea;
          position: relative;
          overflow: hidden;
        }

        .hero-badge::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .main-title {
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 1.75rem;
          line-height: 1.1;
          letter-spacing: -2.5px;
          text-shadow: 0 4px 30px rgba(102, 126, 234, 0.15);
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 50%,
            #f093fb 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          animation: gradientMove 6s ease infinite;
        }

        .subtitle {
          font-size: 1.45rem;
          color: #4a5568;
          line-height: 1.8;
          max-width: 750px;
          margin: 0 auto 3.5rem;
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
          font-weight: 500;
        }

        .cta-buttons {
          display: flex;
          gap: 1.75rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 5rem;
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }

        .btn {
          padding: 1.4rem 3.5rem;
          border-radius: 50px;
          font-size: 1.15rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          display: inline-block;
        }

        .btn::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn:hover::before {
          width: 350px;
          height: 350px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.35),
                      0 6px 20px rgba(102, 126, 234, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 50px rgba(102, 126, 234, 0.45),
                      0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 3px solid rgba(102, 126, 234, 0.3);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
        }

        .btn-secondary:hover {
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-5px);
          border-color: rgba(102, 126, 234, 0.5);
        }

        .btn span {
          position: relative;
          z-index: 1;
        }

        .features-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          max-width: 1300px;
          width: 100%;
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(30px) saturate(180%);
          padding: 3rem;
          border-radius: 28px;
          text-align: center;
          border: 2px solid rgba(102, 126, 234, 0.15);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1);
        }

        .feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .feature-card:hover::before {
          transform: translateX(0);
        }

        .feature-card:hover {
          background: white;
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2),
                      0 10px 30px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .feature-icon {
          font-size: 4.5rem;
          margin-bottom: 2rem;
          display: inline-block;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 8px 20px rgba(102, 126, 234, 0.25));
        }

        .feature-card:nth-child(2) .feature-icon {
          animation-delay: 0.7s;
        }

        .feature-card:nth-child(3) .feature-icon {
          animation-delay: 1.4s;
        }

        .feature-title {
          font-size: 1.65rem;
          font-weight: 800;
          margin-bottom: 1.2rem;
          color: #2d3748;
        }

        .feature-description {
          font-size: 1.05rem;
          color: #718096;
          line-height: 1.7;
          font-weight: 500;
        }

        .tech-stack {
          margin-top: 5rem;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(30px) saturate(180%);
          border-radius: 24px;
          border: 2px solid rgba(102, 126, 234, 0.15);
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1);
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
        }

        .tech-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
          color: #4a5568;
        }

        .tech-badges {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tech-badge {
          padding: 1rem 2rem;
          background: white;
          border-radius: 50px;
          font-weight: 700;
          border: 2px solid rgba(102, 126, 234, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .tech-badge:hover {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
        }

        @media (max-width: 768px) {
          .home-container {
            padding: 5rem 1rem 2rem;
          }

          .main-title {
            font-size: 3rem;
            letter-spacing: -1.5px;
          }

          .subtitle {
            font-size: 1.15rem;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            margin: 0 auto 4rem;
          }

          .btn {
            width: 100%;
          }

          .features-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="home-container">
        {mounted && <div className="cursor-glow"></div>}

        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${12 + Math.random() * 25}s`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-section">
          <div className="hero-badge">✨ Powered by PyTorch & Next.js</div>

          <h1 className="main-title">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Image Recognition
          </h1>

          <p className="subtitle">
            Experience the future of machine learning with our cutting-edge
            dual-model prediction system. Upload any image and get instant,
            accurate classifications powered by deep neural networks.
          </p>

          <div className="cta-buttons">
            <Link href="/dashboard" className="btn btn-primary">
              <span>🚀 Try it Now</span>
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              <span>📖 Learn More</span>
            </Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-description">
              Get predictions in under 2 seconds with our optimized ML pipeline
              and efficient model architecture
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-description">
              Your images are processed securely through our encrypted API and
              never stored on our servers
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Highly Accurate</h3>
            <p className="feature-description">
              Dual-model consensus system ensures 95%+ accuracy across a wide
              range of image categories
            </p>
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