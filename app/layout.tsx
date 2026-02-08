import "./globals.css";
import Navbar from "./components/Navbar";
import { ReactNode } from "react";

export const metadata = {
  title: "ML App",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
