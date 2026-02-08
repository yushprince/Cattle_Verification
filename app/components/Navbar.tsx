"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 2rem;
          background: ${scrolled
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(255, 255, 255, 0.85)"};
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(100, 100, 255, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: ${scrolled
            ? "0 4px 30px rgba(100, 100, 255, 0.1)"
            : "0 2px 20px rgba(100, 100, 255, 0.05)"};
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.6rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .logo:hover {
          transform: scale(1.05);
          background-position: right center;
        }

        .nav-links {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .nav-link {
          position: relative;
          padding: 0.85rem 1.75rem;
          color: #4a5568;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          background: transparent;
        }

        .nav-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          border-radius: 14px;
        }

        .nav-link:hover {
          color: #667eea;
          transform: translateY(-2px);
          background: rgba(102, 126, 234, 0.08);
        }

        .nav-link:hover::before {
          opacity: 0.1;
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3),
                      0 2px 10px rgba(102, 126, 234, 0.2);
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 640px) {
          .nav-container {
            padding: 0.75rem 1rem;
          }

          .logo {
            font-size: 1.35rem;
          }

          .nav-link {
            padding: 0.7rem 1.2rem;
            font-size: 0.875rem;
          }
        }
      `}</style>

      <nav className="nav-container">
        <div className="nav-content">
          <Link href="/" className="logo">
            ⚡ ML Vision
          </Link>
          <div className="nav-links">
            <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}