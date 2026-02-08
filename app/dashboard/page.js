"use client";
import UploadForm from "../components/UploadForm";

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.headerCard}>
        <h2 style={styles.title}>📊 Prediction Dashboard</h2>
        <p style={styles.subtitle}>
          Upload an image and let our AI models analyze it in real time.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
  },
  headerCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "25px 40px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    marginBottom: "30px",
    textAlign: "center",
    maxWidth: "700px",
  },
  title: {
    fontSize: "2.2rem",
    marginBottom: "10px",
  },
  subtitle: {
    opacity: 0.9,
  },
};
