"use client";

import type { ResearchConcern } from "@/types";

interface ConcernCardProps {
  concern: ResearchConcern;
}

const TYPE_STYLES: Record<ResearchConcern["type"], { label: string; color: string }> = {
  gap: { label: "Research Gap", color: "var(--warning)" },
  extension: { label: "Extension", color: "var(--accent)" },
  contradiction: { label: "Contested", color: "var(--danger)" },
  emerging: { label: "Emerging", color: "var(--success)" },
};

export default function ConcernCard({ concern }: ConcernCardProps) {
  const style = TYPE_STYLES[concern.type];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--text-secondary)]/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb, ${style.color} 20%, transparent)`,
            color: style.color,
          }}
        >
          {style.label}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          Confidence: {Math.round(concern.confidence * 100)}%
        </span>
      </div>

      <h3 className="font-semibold mb-2">{concern.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        {concern.description}
      </p>

      <div className="space-y-2">
        <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          Suggested Questions
        </h4>
        <ul className="space-y-1">
          {concern.suggestedQuestions.map((q, i) => (
            <li
              key={i}
              className="text-sm text-[var(--text-primary)]/80 pl-3 border-l-2 border-[var(--border)]"
            >
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
