import type {
  ExtractedTheme,
  ResearchConcern,
  UploadedPaper,
} from "@/types";

export function speculateConcerns(
  themes: ExtractedTheme[],
  papers: UploadedPaper[]
): ResearchConcern[] {
  const concerns: ResearchConcern[] = [];

  // 1. Gap Analysis: Find themes with low coverage
  concerns.push(...identifyGaps(themes, papers));

  // 2. Extension Opportunities: Find themes that could be combined
  concerns.push(...identifyExtensions(themes));

  // 3. Contradictions: Detect potentially conflicting themes
  concerns.push(...identifyContradictions(themes, papers));

  // 4. Emerging Trends: Themes appearing in recent papers
  concerns.push(...identifyEmergingTrends(themes, papers));

  return concerns;
}

function identifyGaps(
  themes: ExtractedTheme[],
  papers: UploadedPaper[]
): ResearchConcern[] {
  const concerns: ResearchConcern[] = [];
  const totalPapers = papers.length;

  for (const theme of themes) {
    const coverage = theme.relatedPapers.length / Math.max(totalPapers, 1);

    if (coverage < 0.4 && theme.keywords.length >= 3) {
      const underexploredKeywords = theme.keywords.slice(2);
      concerns.push({
        id: `concern-gap-${concerns.length + 1}`,
        title: `Underexplored dimension: ${underexploredKeywords.join(", ")}`,
        description:
          `The theme "${theme.label}" shows limited coverage ` +
          `(${theme.relatedPapers.length}/${totalPapers} papers). ` +
          `Keywords like ${underexploredKeywords.join(", ")} appear as sub-themes ` +
          `but are not deeply explored in the current body of work. ` +
          `This suggests a potential gap that could be developed into a focused study.`,
        type: "gap",
        confidence: Math.min(0.9, 0.5 + (1 - coverage) * 0.4),
        relatedThemes: [theme.id],
        suggestedQuestions: [
          `How do ${underexploredKeywords[0] || theme.keywords[0]} dynamics change across different contexts?`,
          `What methodological approaches best capture the nuances of ${theme.label.toLowerCase()}?`,
          `Are there disciplinary perspectives missing from current ${theme.keywords[0]} research?`,
        ],
      });
    }
  }

  return concerns;
}

function identifyExtensions(themes: ExtractedTheme[]): ResearchConcern[] {
  const concerns: ResearchConcern[] = [];

  for (let i = 0; i < themes.length; i++) {
    for (let j = i + 1; j < themes.length; j++) {
      const themeA = themes[i];
      const themeB = themes[j];

      // Check for shared papers but different keywords
      const sharedPapers = themeA.relatedPapers.filter((p) =>
        themeB.relatedPapers.includes(p)
      );
      const keywordOverlap = themeA.keywords.filter((k) =>
        themeB.keywords.includes(k)
      );

      if (sharedPapers.length > 0 && keywordOverlap.length < 2) {
        concerns.push({
          id: `concern-ext-${concerns.length + 1}`,
          title: `Cross-theme synthesis: ${themeA.label} × ${themeB.label}`,
          description:
            `Themes "${themeA.label}" and "${themeB.label}" share ` +
            `${sharedPapers.length} paper(s) but have distinct keyword profiles. ` +
            `This intersection presents an opportunity for synthesis—combining ` +
            `insights from ${themeA.keywords[0]} with ${themeB.keywords[0]} ` +
            `could produce novel theoretical or empirical contributions.`,
          type: "extension",
          confidence: Math.min(
            0.85,
            0.4 + sharedPapers.length * 0.15
          ),
          relatedThemes: [themeA.id, themeB.id],
          suggestedQuestions: [
            `How does ${themeA.keywords[0]} interact with ${themeB.keywords[0]} in practice?`,
            `Can frameworks from ${themeA.label.toLowerCase()} research inform ${themeB.label.toLowerCase()} studies?`,
            `What new variables emerge at the intersection of these two themes?`,
          ],
        });
      }

      if (concerns.length >= 5) break;
    }
    if (concerns.length >= 5) break;
  }

  return concerns;
}

function identifyContradictions(
  themes: ExtractedTheme[],
  papers: UploadedPaper[]
): ResearchConcern[] {
  const concerns: ResearchConcern[] = [];

  // Look for themes that appear in many papers but with varying contexts
  const highFreqThemes = themes.filter(
    (t) => t.relatedPapers.length >= 2 && t.keywords.length >= 3
  );

  for (const theme of highFreqThemes.slice(0, 3)) {
    const relatedContent = papers
      .filter((p) => theme.relatedPapers.includes(p.id))
      .map((p) => p.content.toLowerCase());

    // Simple heuristic: check for negative/contrasting markers
    const contrastMarkers = [
      "however", "contrary", "challenge", "debate",
      "disagree", "limitation", "critique", "problematic",
    ];

    const contrastCount = relatedContent.reduce((count, content) => {
      return (
        count +
        contrastMarkers.filter((marker) => content.includes(marker)).length
      );
    }, 0);

    if (contrastCount >= 3) {
      concerns.push({
        id: `concern-contra-${concerns.length + 1}`,
        title: `Contested area: ${theme.label}`,
        description:
          `Multiple papers addressing "${theme.label}" contain contrasting ` +
          `or critical language, suggesting active scholarly debate. ` +
          `This contested area could benefit from a systematic review or ` +
          `a study that reconciles competing perspectives on ${theme.keywords[0]}.`,
        type: "contradiction",
        confidence: Math.min(0.75, 0.3 + contrastCount * 0.05),
        relatedThemes: [theme.id],
        suggestedQuestions: [
          `What are the main points of contention regarding ${theme.keywords[0]}?`,
          `Can a meta-analytic or mixed-methods approach resolve conflicting findings?`,
          `What contextual factors explain divergent results in ${theme.label.toLowerCase()} research?`,
        ],
      });
    }
  }

  return concerns;
}

function identifyEmergingTrends(
  themes: ExtractedTheme[],
  papers: UploadedPaper[]
): ResearchConcern[] {
  const concerns: ResearchConcern[] = [];

  // Sort papers by upload date to find recent themes
  const sortedPapers = [...papers].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  const recentPaperIds = sortedPapers
    .slice(0, Math.ceil(papers.length / 2))
    .map((p) => p.id);

  for (const theme of themes) {
    const recentCount = theme.relatedPapers.filter((id) =>
      recentPaperIds.includes(id)
    ).length;
    const totalCount = theme.relatedPapers.length;

    if (recentCount > totalCount / 2 && totalCount >= 2) {
      concerns.push({
        id: `concern-trend-${concerns.length + 1}`,
        title: `Emerging focus: ${theme.label}`,
        description:
          `The theme "${theme.label}" appears predominantly in more recently ` +
          `uploaded papers (${recentCount}/${totalCount}), suggesting it may be an ` +
          `emerging or intensifying research focus. Early-stage contributions ` +
          `on ${theme.keywords.slice(0, 3).join(", ")} could position your work ` +
          `at the frontier of this developing area.`,
        type: "emerging",
        confidence: Math.min(0.8, 0.4 + (recentCount / totalCount) * 0.4),
        relatedThemes: [theme.id],
        suggestedQuestions: [
          `What theoretical frameworks best support emerging work on ${theme.keywords[0]}?`,
          `How can ${theme.label.toLowerCase()} research build on foundational work in adjacent areas?`,
          `What data sources or methods are best suited for studying ${theme.keywords[0]}?`,
        ],
      });
    }
  }

  return concerns;
}
