/* eslint-disable @typescript-eslint/no-require-imports */
import mammoth from "mammoth";

export async function parseFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop();

  switch (ext) {
    case "pdf":
      return parsePDF(buffer);
    case "docx":
      return parseDOCX(buffer);
    case "txt":
    case "md":
      return buffer.toString("utf-8");
    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}

async function parsePDF(buffer: Buffer): Promise<string> {
  // pdf-parse v1 uses CommonJS default export
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export function extractTitle(content: string, filename: string): string {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length > 10 && trimmed.length < 200) {
      return trimmed;
    }
  }
  return filename.replace(/\.[^.]+$/, "");
}
