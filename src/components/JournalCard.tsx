"use client";

import type { JournalRecommendation } from "@/types";

interface JournalCardProps {
  journal: JournalRecommendation;
  rank: number;
}

export default function JournalCard({ journal, rank }: JournalCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)]/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center text-sm font-bold">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold">{journal.name}</h3>
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-[var(--accent)]">
                {journal.matchScore}%
              </div>
              <div className="text-xs text-[var(--text-secondary)]">match</div>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-2">
            {journal.publisher} — {journal.impactArea}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${journal.matchScore}%`,
                  backgroundColor: journal.matchScore > 60 ? "var(--success)" : journal.matchScore > 30 ? "var(--warning)" : "var(--text-secondary)",
                }}
              />
            </div>
            <a
              href={journal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent)] hover:underline flex-shrink-0"
            >
              Visit Journal →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
