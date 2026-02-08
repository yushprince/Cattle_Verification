"use client";
import { useState } from "react";

export default function UploadForm() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setResult(null);

    const res = await fetch("http://127.0.0.1:8000/api/predict/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div style={styles.card}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.uploadBox}>
          {preview ? (
            <img src={preview} alt="preview" style={styles.previewImg} />
          ) : (
            <span>📤 Click to upload image</span>
          )}
          <input type="file" hidden onChange={handleImageChange} />
        </label>

        <button style={styles.button} type="submit">
          {loading ? "⏳ Predicting..." : "🚀 Predict"}
        </button>
      </form>

      {result && (
        <div style={styles.resultCard}>
          <h3>🧠 Prediction Result</h3>
          <p><b>Model 1:</b> {result.model1_prediction}</p>
          <p><b>Model 2:</b> {result.model2_prediction}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  uploadBox: {
    border: "2px dashed #fff",
    padding: "30px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.3s",
  },
  previewImg: {
    width: "100%",
    maxHeight: "250px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  button: {
    padding: "12px",
    borderRadius: "25px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    background: "linear-gradient(90deg,#00c6ff,#0072ff)",
    color: "white",
    transition: "0.3s",
  },
  resultCard: {
    marginTop: "25px",
    padding: "20px",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "12px",
  },
};
