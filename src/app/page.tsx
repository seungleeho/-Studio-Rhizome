"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ThemeCard from "@/components/ThemeCard";
import ConcernCard from "@/components/ConcernCard";
import JournalCard from "@/components/JournalCard";
import type { AnalysisResult } from "@/types";

type Tab = "upload" | "themes" | "concerns" | "journals";

interface UploadedFile {
  id: string;
  filename: string;
  title: string;
  uploadedAt: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (files: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    setAnalysis(null);
  };

  const handleClear = async () => {
    await fetch("/api/upload", { method: "DELETE" });
    setUploadedFiles([]);
    setAnalysis(null);
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data);
      setActiveTab("themes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "upload", label: "Upload", count: uploadedFiles.length },
    { key: "themes", label: "Themes", count: analysis?.themes.length },
    { key: "concerns", label: "Concerns", count: analysis?.concerns.length },
    { key: "journals", label: "Journals", count: analysis?.journals.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Journal Theme Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Upload your academic papers to discover themes, identify research
          concerns, and find matching journals for submission.
        </p>
      </header>

      {/* Tabs */}
      <nav className="flex gap-1 mb-6 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 text-xs bg-[var(--bg-card)] px-1.5 py-0.5 rounded-full border border-[var(--border)]">
                {tab.count}
              </span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Error */}
      {error && (
        <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-lg p-4 mb-6 text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* Tab Content */}
      <main>
        {activeTab === "upload" && (
          <div className="space-y-6">
            <FileUpload
              onUploadComplete={handleUploadComplete}
              uploadedFiles={uploadedFiles}
              onClear={handleClear}
            />

            {uploadedFiles.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  {analyzing
                    ? "Analyzing Papers..."
                    : `Analyze ${uploadedFiles.length} Paper${uploadedFiles.length > 1 ? "s" : ""}`}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "themes" && (
          <div>
            {analysis && analysis.themes.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Discovered {analysis.themes.length} theme
                  {analysis.themes.length !== 1 ? "s" : ""} across your papers
                  using TF-IDF keyword extraction and co-occurrence clustering.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {analysis.themes.map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState message="Upload and analyze papers to discover themes." />
            )}
          </div>
        )}

        {activeTab === "concerns" && (
          <div>
            {analysis && analysis.concerns.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Speculated {analysis.concerns.length} research concern
                  {analysis.concerns.length !== 1 ? "s" : ""} based on gap
                  analysis, theme intersections, contested areas, and emerging
                  trends.
                </p>
                <div className="grid gap-4">
                  {analysis.concerns.map((concern) => (
                    <ConcernCard key={concern.id} concern={concern} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState message="Upload and analyze papers to discover research concerns." />
            )}
          </div>
        )}

        {activeTab === "journals" && (
          <div>
            {analysis && analysis.journals.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Top {analysis.journals.length} journal
                  {analysis.journals.length !== 1 ? "s" : ""} matched to your
                  research themes, ranked by keyword alignment.
                </p>
                <div className="grid gap-3">
                  {analysis.journals.map((journal, i) => (
                    <JournalCard
                      key={journal.id}
                      journal={journal}
                      rank={i + 1}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState message="Upload and analyze papers to get journal recommendations." />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-[var(--text-secondary)]">
      <p className="text-lg mb-2">No results yet</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
