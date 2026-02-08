"use client";
import Link from "next/link";
import type { CSSProperties } from "react";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧠 ML Prediction App</h1>
        <p style={styles.subtitle}>
          Upload an image and get predictions using powerful AI models
          built with <b>Django + PyTorch</b>.
        </p>

        <div style={styles.buttonGroup}>
          <Link href="/dashboard">
            <button style={styles.primaryBtn}>Go to Dashboard 🚀</button>
          </Link>

          <Link href="/about">
            <button style={styles.secondaryBtn}>Learn More</button>
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <h3>⚡ Fast</h3>
          <p>Predictions in milliseconds using optimized ML models.</p>
        </div>

        <div style={styles.featureCard}>
          <h3>🔒 Secure</h3>
          <p>Your data is processed safely through our backend API.</p>
        </div>

        <div style={styles.featureCard}>
          <h3>📊 Smart</h3>
          <p>Uses multiple models to give more reliable output.</p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    flexDirection: "column",   // ✅ now valid
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    padding: "40px",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    maxWidth: "600px",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "1.1rem",
    opacity: 0.9,
  },
  buttonGroup: {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "12px 28px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(90deg,#00c6ff,#0072ff)",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s",
  },
  secondaryBtn: {
    padding: "12px 28px",
    borderRadius: "25px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s",
  },
  features: {
    marginTop: "40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "800px",
  },
  featureCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  },
};
