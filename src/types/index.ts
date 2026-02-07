export interface UploadedPaper {
  id: string;
  filename: string;
  title: string;
  content: string;
  uploadedAt: string;
}

export interface ExtractedTheme {
  id: string;
  label: string;
  keywords: string[];
  frequency: number;
  relatedPapers: string[];
  description: string;
}

export interface ResearchConcern {
  id: string;
  title: string;
  description: string;
  type: "gap" | "extension" | "contradiction" | "emerging";
  confidence: number;
  relatedThemes: string[];
  suggestedQuestions: string[];
}

export interface JournalRecommendation {
  id: string;
  name: string;
  publisher: string;
  scope: string;
  matchScore: number;
  matchedThemes: string[];
  url: string;
  impactArea: string;
}

export interface AnalysisResult {
  papers: UploadedPaper[];
  themes: ExtractedTheme[];
  concerns: ResearchConcern[];
  journals: JournalRecommendation[];
  analyzedAt: string;
}
