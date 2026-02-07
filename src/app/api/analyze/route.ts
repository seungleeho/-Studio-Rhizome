import { NextResponse } from "next/server";
import { getPapersStore } from "@/app/api/upload/route";
import { extractThemes } from "@/lib/theme-engine";
import { speculateConcerns } from "@/lib/concern-speculator";
import { recommendJournals } from "@/lib/journal-recommender";
import type { AnalysisResult } from "@/types";

export async function POST() {
  try {
    const papers = getPapersStore();
    const paperList = Array.from(papers.values());

    if (paperList.length === 0) {
      return NextResponse.json(
        { error: "No papers uploaded. Please upload files first." },
        { status: 400 }
      );
    }

    // Run analysis pipeline
    const themes = extractThemes(paperList);
    const concerns = speculateConcerns(themes, paperList);
    const journals = recommendJournals(themes);

    const result: AnalysisResult = {
      papers: paperList.map(({ id, filename, title, uploadedAt }) => ({
        id,
        filename,
        title,
        content: "",
        uploadedAt,
      })),
      themes,
      concerns,
      journals,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
