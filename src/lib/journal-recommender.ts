import type { ExtractedTheme, JournalRecommendation } from "@/types";

// A curated database of academic journals across disciplines
const JOURNAL_DATABASE: Omit<JournalRecommendation, "id" | "matchScore" | "matchedThemes">[] = [
  // Social Sciences
  {
    name: "American Sociological Review",
    publisher: "SAGE Publications",
    scope: "sociology social theory inequality stratification culture institutions organizations movements",
    url: "https://journals.sagepub.com/home/asr",
    impactArea: "Sociology",
  },
  {
    name: "Annual Review of Psychology",
    publisher: "Annual Reviews",
    scope: "psychology cognition behavior mental health development neuroscience social psychology clinical",
    url: "https://www.annualreviews.org/journal/psych",
    impactArea: "Psychology",
  },
  {
    name: "Academy of Management Review",
    publisher: "Academy of Management",
    scope: "management theory organization strategy leadership innovation entrepreneurship governance",
    url: "https://journals.aom.org/journal/amr",
    impactArea: "Management",
  },
  {
    name: "Journal of Political Economy",
    publisher: "University of Chicago Press",
    scope: "economics political economy markets labor trade policy fiscal monetary growth development",
    url: "https://www.journals.uchicago.edu/toc/jpe/current",
    impactArea: "Economics",
  },
  {
    name: "Administrative Science Quarterly",
    publisher: "SAGE Publications",
    scope: "organization theory management administration bureaucracy institutions decision making organizational behavior",
    url: "https://journals.sagepub.com/home/asq",
    impactArea: "Organizational Studies",
  },
  // STEM
  {
    name: "Nature",
    publisher: "Springer Nature",
    scope: "science biology chemistry physics genetics genomics climate environment interdisciplinary",
    url: "https://www.nature.com/",
    impactArea: "Multidisciplinary Science",
  },
  {
    name: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
    publisher: "IEEE",
    scope: "machine learning artificial intelligence computer vision pattern recognition deep learning neural networks",
    url: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34",
    impactArea: "Computer Science / AI",
  },
  {
    name: "The Lancet",
    publisher: "Elsevier",
    scope: "medicine health clinical trials epidemiology public health disease treatment therapy global health",
    url: "https://www.thelancet.com/",
    impactArea: "Medicine",
  },
  {
    name: "Physical Review Letters",
    publisher: "American Physical Society",
    scope: "physics quantum mechanics condensed matter particle physics astrophysics optics thermodynamics",
    url: "https://journals.aps.org/prl/",
    impactArea: "Physics",
  },
  {
    name: "Journal of the American Chemical Society",
    publisher: "American Chemical Society",
    scope: "chemistry organic inorganic materials synthesis catalysis molecular biochemistry nanoscience",
    url: "https://pubs.acs.org/journal/jacsat",
    impactArea: "Chemistry",
  },
  // Humanities
  {
    name: "Critical Inquiry",
    publisher: "University of Chicago Press",
    scope: "literary criticism cultural studies philosophy aesthetics art theory discourse narrative semiotics",
    url: "https://criticalinquiry.uchicago.edu/",
    impactArea: "Humanities",
  },
  {
    name: "American Historical Review",
    publisher: "Oxford University Press",
    scope: "history historical analysis historiography global history cultural history political history social history",
    url: "https://academic.oup.com/ahr",
    impactArea: "History",
  },
  {
    name: "Philosophical Review",
    publisher: "Duke University Press",
    scope: "philosophy ethics epistemology metaphysics logic philosophy of mind political philosophy aesthetics",
    url: "https://read.dukeupress.edu/the-philosophical-review",
    impactArea: "Philosophy",
  },
  // Education
  {
    name: "Review of Educational Research",
    publisher: "SAGE Publications",
    scope: "education pedagogy curriculum learning teaching assessment student achievement educational policy equity",
    url: "https://journals.sagepub.com/home/rer",
    impactArea: "Education",
  },
  {
    name: "Higher Education",
    publisher: "Springer",
    scope: "higher education university academic policy student experience faculty governance internationalization",
    url: "https://www.springer.com/journal/10734",
    impactArea: "Higher Education",
  },
  // Interdisciplinary
  {
    name: "Science, Technology, & Human Values",
    publisher: "SAGE Publications",
    scope: "science technology society ethics policy innovation digital culture media communication",
    url: "https://journals.sagepub.com/home/sth",
    impactArea: "STS",
  },
  {
    name: "Environmental Research Letters",
    publisher: "IOP Publishing",
    scope: "environment climate change sustainability ecology conservation energy resources pollution ecosystem",
    url: "https://iopscience.iop.org/journal/1748-9326",
    impactArea: "Environmental Science",
  },
  {
    name: "Journal of Mixed Methods Research",
    publisher: "SAGE Publications",
    scope: "mixed methods qualitative quantitative research design methodology triangulation integration paradigm",
    url: "https://journals.sagepub.com/home/mmr",
    impactArea: "Research Methodology",
  },
  {
    name: "Public Administration Review",
    publisher: "Wiley",
    scope: "public administration governance policy implementation bureaucracy regulation civic engagement democracy",
    url: "https://onlinelibrary.wiley.com/journal/15406210",
    impactArea: "Public Administration",
  },
  {
    name: "Journal of Communication",
    publisher: "Oxford University Press",
    scope: "communication media studies digital media journalism public opinion rhetoric discourse persuasion",
    url: "https://academic.oup.com/joc",
    impactArea: "Communication Studies",
  },
];

export function recommendJournals(
  themes: ExtractedTheme[]
): JournalRecommendation[] {
  if (themes.length === 0) return [];

  const allKeywords = themes.flatMap((t) => t.keywords);
  const recommendations: JournalRecommendation[] = [];

  for (const journal of JOURNAL_DATABASE) {
    const scopeWords = journal.scope.toLowerCase().split(/\s+/);
    const matchedThemeIds: string[] = [];
    let totalScore = 0;

    for (const theme of themes) {
      let themeScore = 0;
      for (const keyword of theme.keywords) {
        const kw = keyword.toLowerCase();
        // Exact match in scope
        if (scopeWords.includes(kw)) {
          themeScore += 3;
        }
        // Partial match (keyword is substring of a scope word or vice versa)
        else if (scopeWords.some((sw) => sw.includes(kw) || kw.includes(sw))) {
          themeScore += 1;
        }
      }

      if (themeScore > 0) {
        matchedThemeIds.push(theme.id);
        totalScore += themeScore * theme.frequency;
      }
    }

    if (matchedThemeIds.length > 0) {
      // Normalize score to 0-100
      const maxPossibleScore = allKeywords.length * 3 * themes.length;
      const normalizedScore = Math.min(
        100,
        Math.round((totalScore / Math.max(maxPossibleScore, 1)) * 100 * 5)
      );

      recommendations.push({
        id: `journal-${recommendations.length + 1}`,
        ...journal,
        matchScore: normalizedScore,
        matchedThemes: matchedThemeIds,
      });
    }
  }

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
}
