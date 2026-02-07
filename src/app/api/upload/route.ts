import { NextRequest, NextResponse } from "next/server";
import { parseFile, extractTitle } from "@/lib/parser";
import type { UploadedPaper } from "@/types";

// In-memory store (per server instance)
const papers: Map<string, UploadedPaper> = new Map();

export function getPapersStore() {
  return papers;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploaded: UploadedPaper[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const content = await parseFile(buffer, file.name);
      const title = extractTitle(content, file.name);

      const paper: UploadedPaper = {
        id: `paper-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        filename: file.name,
        title,
        content,
        uploadedAt: new Date().toISOString(),
      };

      papers.set(paper.id, paper);
      uploaded.push(paper);
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploaded.length} file(s)`,
      papers: uploaded.map(({ id, filename, title, uploadedAt }) => ({
        id,
        filename,
        title,
        uploadedAt,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const allPapers = Array.from(papers.values()).map(
    ({ id, filename, title, uploadedAt }) => ({
      id,
      filename,
      title,
      uploadedAt,
    })
  );
  return NextResponse.json({ papers: allPapers });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    papers.delete(id);
  } else {
    papers.clear();
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
