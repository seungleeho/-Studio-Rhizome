"use client";

import type { ExtractedTheme } from "@/types";

interface ThemeCardProps {
  theme: ExtractedTheme;
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)]/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{theme.label}</h3>
        <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-full">
          {theme.frequency} paper{theme.frequency !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        {theme.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {theme.keywords.map((keyword) => (
          <span
            key={keyword}
            className="text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-1 rounded border border-[var(--border)]"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
