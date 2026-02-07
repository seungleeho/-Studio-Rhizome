"use client";

import { useState, useCallback } from "react";

interface UploadedFile {
  id: string;
  filename: string;
  title: string;
  uploadedAt: string;
}

interface FileUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onClear: () => void;
}

export default function FileUpload({
  onUploadComplete,
  uploadedFiles,
  onClear,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["pdf", "docx", "txt", "md"].includes(ext || "")) {
          setError(`Unsupported file type: ${file.name}. Use PDF, DOCX, TXT, or MD.`);
          setUploading(false);
          return;
        }
        formData.append("files", file);
      }

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        onUploadComplete(data.papers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-[var(--accent)] bg-[var(--accent)]/10"
            : "border-[var(--border)] hover:border-[var(--text-secondary)]"
        }`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-4xl mb-3">+</div>
          <p className="text-[var(--text-primary)] font-medium">
            {uploading ? "Uploading..." : "Drop files here or click to browse"}
          </p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            PDF, DOCX, TXT, MD — Upload your previous submissions and publications
          </p>
        </label>
      </div>

      {error && (
        <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-lg p-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">
              Uploaded Papers ({uploadedFiles.length})
            </h3>
            <button
              onClick={onClear}
              className="text-xs text-[var(--danger)] hover:text-[var(--danger)]/80"
            >
              Clear All
            </button>
          </div>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 bg-[var(--bg-card)] rounded-lg p-3 border border-[var(--border)]"
            >
              <span className="text-lg">
                {file.filename.endsWith(".pdf") ? "PDF" : "DOC"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.title}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {file.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
