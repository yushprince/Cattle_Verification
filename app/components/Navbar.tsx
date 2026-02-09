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
        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0.75rem 1rem;
          background: ${scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.9)"};
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${scrolled ? "#e5e7eb" : "rgba(229, 231, 235, 0.5)"};
          transition: all 0.3s;
          box-shadow: ${scrolled ? "0 2px 8px rgba(0, 0, 0, 0.06)" : "none"};
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.15rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.3px;
        }

        .nav-links {
          display: flex;
          gap: 0.5rem;
        }

        .nav-link {
          padding: 0.5rem 1rem;
          color: #6b7280;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: 50px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          color: #667eea;
          background: #f8f9ff;
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        @media (min-width: 641px) {
          .nav-container {
            padding: 1rem 2rem;
          }

          .logo {
            font-size: 1.4rem;
          }

          .nav-links {
            gap: 0.75rem;
          }

          .nav-link {
            padding: 0.75rem 1.5rem;
            font-size: 0.95rem;
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