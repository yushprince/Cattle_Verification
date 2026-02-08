"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: 15, background: "#222", color: "#fff" }}>
      <Link href="/" style={{ marginRight: 15, color: "white" }}>
        Home
      </Link>
      <Link href="/dashboard" style={{ marginRight: 15, color: "white" }}>
        Dashboard
      </Link>
    </nav>
  );
}
