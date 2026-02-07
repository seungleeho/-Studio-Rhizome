import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journal Theme Generator",
  description:
    "Generate themes from academic papers, discover research concerns, and find matching journals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
