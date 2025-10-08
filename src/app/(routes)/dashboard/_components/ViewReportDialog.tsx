"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { HistoryItem, TranscriptMessage } from "./historyTypes";
import { getFormattedDate } from "./historyTypes";

type ViewReportDialogProps = {
  session: HistoryItem | null;
  onClose: () => void;
  formatDate?: (value?: string | null) => string;
};

const capitalize = (value?: string) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatTranscript = (messages: TranscriptMessage[]) =>
  messages
    .map((message, index) => {
      const roleLabel = capitalize(message.role) || "Speaker";
      const text = message.text?.trim() || "-";
      return `${index + 1}. ${roleLabel}: ${text}`;
    })
    .join("\n\n");

const normaliseTranscript = (value: unknown): TranscriptMessage[] | null => {
  if (!value) return null;

  if (Array.isArray(value)) {
    const prepared = value
      .map((entry) => {
        if (typeof entry === "string") {
          return { role: "assistant", text: entry };
        }

        if (entry && typeof entry === "object") {
          const record = entry as Record<string, unknown>;
          const role =
            typeof record.role === "string" && record.role.length > 0
              ? record.role
              : "speaker";
          const text =
            typeof record.text === "string"
              ? record.text
              : typeof record.content === "string"
              ? record.content
              : "";

          return { role, text };
        }

        return null;
      })
      .filter((item): item is TranscriptMessage =>
        Boolean(item && typeof item.text === "string")
      );

    return prepared.length ? prepared : null;
  }

  if (typeof value === "string") {
    return [
      {
        role: "assistant",
        text: value,
      },
    ];
  }

  return null;
};

const renderList = (items?: string[]) => {
  if (!items || items.length === 0) {
    return (
      <span className="text-sm text-base-content/60">No data available</span>
    );
  }

  return (
    <ul className="list-disc space-y-1 pl-4 text-sm text-base-content/80">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

const ViewReportDialog = ({
  session,
  onClose,
  formatDate = getFormattedDate,
}: ViewReportDialogProps) => {
  const [conversation, setConversation] = useState<TranscriptMessage[] | null>(
    () => normaliseTranscript(session?.conversation)
  );
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setConversation(normaliseTranscript(session?.conversation));
  }, [session]);

  const handleDownloadTranscript = useCallback(async () => {
    if (!session) return;

    try {
      setIsDownloading(true);
      let transcript = conversation;

      if (!transcript || transcript.length === 0) {
        const response = await fetch(
          `/api/session-chat?sessionId=${session.sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transcript.");
        }

        const data = await response.json();
        const normalised = normaliseTranscript(data?.conversation);
        transcript = normalised;
        setConversation(normalised);
      }

      if (!transcript || transcript.length === 0) {
        window.alert("Transcript is not available for this session yet.");
        return;
      }

      const transcriptText = formatTranscript(transcript);
      const blob = new Blob([transcriptText], {
        type: "text/plain;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const linkElement = document.createElement("a");
      linkElement.href = url;
      linkElement.download = `transcript-${session.sessionId}.txt`;
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading transcript:", error);
      window.alert("Unable to download transcript. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  }, [conversation, session]);

  if (!session) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-base-300/60 px-4 py-12 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-base-100 p-6 shadow-2xl">
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close report modal"
        >
          ✕
        </button>

        <header className="mb-6 space-y-2">
          <p className="text-sm font-medium text-base-content/60">
            {session.report?.timestamp
              ? formatDate(session.report.timestamp)
              : formatDate(session.createOn)}
          </p>
          <h2 className="text-2xl font-semibold">
            {session.report?.chiefComplaint || "Consultation Report"}
          </h2>
          <p className="text-base-content/70">
            {session.report?.agent || session.selectedDoctor.name}
          </p>
        </header>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold uppercase text-base-content/60">
              Summary
            </h3>
            <p className="mt-2 text-base leading-relaxed">
              {session.report?.summary ||
                "No summary available for this session."}
            </p>
          </section>

          {session.notes && (
            <section>
              <h3 className="text-sm font-semibold uppercase text-base-content/60">
                User Notes
              </h3>
              <p className="mt-2 whitespace-pre-line text-base leading-relaxed">
                {session.notes}
              </p>
            </section>
          )}

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-base-200 bg-base-200/40 p-4">
              <p className="text-xs font-semibold uppercase text-base-content/60">
                Duration
              </p>
              <p className="mt-2 text-base font-medium">
                {session.report?.duration || "Not specified"}
              </p>
            </div>
            <div className="rounded-xl border border-base-200 bg-base-200/40 p-4">
              <p className="text-xs font-semibold uppercase text-base-content/60">
                Severity Level
              </p>
              <p className="mt-2 text-base font-medium capitalize">
                {session.report?.severity || "Not specified"}
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase text-base-content/60">
                Symptoms
              </h3>
              <div className="mt-2">{renderList(session.report?.symptoms)}</div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase text-base-content/60">
                Medications Mentioned
              </h3>
              <div className="mt-2">
                {renderList(session.report?.medicationsMentioned)}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase text-base-content/60">
              Recommendations
            </h3>
            <div className="mt-2">
              {renderList(session.report?.recommendations)}
            </div>
          </section>
        </div>

        <footer className="mt-8 flex flex-col gap-2 border-t border-base-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-base-content/60">
            Session ID:{" "}
            <span className="font-mono text-base-content">
              {session.sessionId}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              className="btn btn-primary btn-sm sm:btn-md"
              onClick={handleDownloadTranscript}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing…" : "Download Full Transcript"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ViewReportDialog;
