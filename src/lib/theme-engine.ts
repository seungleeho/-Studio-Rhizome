import natural from "natural";
import { removeStopwords } from "stopword";
import type { ExtractedTheme, UploadedPaper } from "@/types";

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// Academic stopwords that add noise
const ACADEMIC_STOPWORDS = [
  "abstract", "introduction", "conclusion", "method", "methodology",
  "results", "discussion", "figure", "table", "reference", "references",
  "acknowledgment", "acknowledgments", "et", "al", "doi", "vol",
  "issue", "pp", "page", "pages", "journal", "university", "department",
  "however", "therefore", "moreover", "furthermore", "although",
  "study", "studies", "research", "paper", "article", "section",
  "approach", "based", "using", "used", "also", "may", "can",
  "one", "two", "three", "new", "first", "second", "third",
];

export function extractThemes(papers: UploadedPaper[]): ExtractedTheme[] {
  if (papers.length === 0) return [];

  const tfidf = new TfIdf();
  const paperTokens: string[][] = [];

  // Add each paper as a document
  for (const paper of papers) {
    const tokens = tokenizeAndClean(paper.content);
    paperTokens.push(tokens);
    tfidf.addDocument(tokens.join(" "));
  }

  // Extract top terms per document and aggregate
  const termScores = new Map<string, { score: number; papers: Set<string> }>();

  papers.forEach((paper, docIndex) => {
    const terms: { term: string; tfidf: number }[] = [];
    tfidf.listTerms(docIndex).forEach((item) => {
      if (item.term.length > 3 && !ACADEMIC_STOPWORDS.includes(item.term)) {
        terms.push({ term: item.term, tfidf: item.tfidf });
      }
    });

    // Top 30 terms per paper
    terms.slice(0, 30).forEach(({ term, tfidf: score }) => {
      const existing = termScores.get(term) || {
        score: 0,
        papers: new Set<string>(),
      };
      existing.score += score;
      existing.papers.add(paper.id);
      termScores.set(term, existing);
    });
  });

  // Cluster related terms into themes using co-occurrence
  const sortedTerms = Array.from(termScores.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 100);

  const themes = clusterTermsIntoThemes(sortedTerms, paperTokens, papers);
  return themes;
}

function tokenizeAndClean(text: string): string[] {
  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  const filtered = removeStopwords(tokens);
  return filtered.filter(
    (t: string) =>
      t.length > 3 &&
      !ACADEMIC_STOPWORDS.includes(t) &&
      !/^\d+$/.test(t)
  );
}

function clusterTermsIntoThemes(
  sortedTerms: [string, { score: number; papers: Set<string> }][],
  paperTokens: string[][],
  papers: UploadedPaper[]
): ExtractedTheme[] {
  const assigned = new Set<string>();
  const themes: ExtractedTheme[] = [];

  for (const [term, data] of sortedTerms) {
    if (assigned.has(term)) continue;

    // Find co-occurring terms
    const coOccurring: string[] = [term];
    assigned.add(term);

    for (const [otherTerm] of sortedTerms) {
      if (assigned.has(otherTerm)) continue;
      if (coOccurring.length >= 6) break;

      const coOccurs = paperTokens.some((tokens) => {
        const text = tokens.join(" ");
        return text.includes(term) && text.includes(otherTerm);
      });

      if (coOccurs) {
        coOccurring.push(otherTerm);
        assigned.add(otherTerm);
      }
    }

    if (coOccurring.length >= 2) {
      const relatedPaperIds = Array.from(data.papers);
      themes.push({
        id: `theme-${themes.length + 1}`,
        label: generateThemeLabel(coOccurring),
        keywords: coOccurring,
        frequency: relatedPaperIds.length,
        relatedPapers: relatedPaperIds,
        description: generateThemeDescription(coOccurring, papers, relatedPaperIds),
      });
    }

    if (themes.length >= 8) break;
  }

  return themes;
}

function generateThemeLabel(keywords: string[]): string {
  const primary = keywords.slice(0, 3);
  return primary.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" & ");
}

function generateThemeDescription(
  keywords: string[],
  papers: UploadedPaper[],
  paperIds: string[]
): string {
  const paperCount = paperIds.length;
  const keywordList = keywords.slice(0, 4).join(", ");
  const paperTitles = papers
    .filter((p) => paperIds.includes(p.id))
    .map((p) => p.title)
    .slice(0, 2);

  let desc = `This theme encompasses research around ${keywordList}, `;
  desc += `appearing across ${paperCount} paper${paperCount > 1 ? "s" : ""}. `;
  if (paperTitles.length > 0) {
    desc += `Key contributions include work from: "${paperTitles[0]}"`;
    if (paperTitles.length > 1) desc += ` and "${paperTitles[1]}"`;
    desc += ".";
  }
  return desc;
}
