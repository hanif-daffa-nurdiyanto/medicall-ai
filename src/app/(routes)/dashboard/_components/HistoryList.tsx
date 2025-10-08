"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AddNewSessionDialog from "./AddNewSessionDialog";
import ViewReportDialog from "./ViewReportDialog";
import type { HistoryItem } from "./historyTypes";
import { getFormattedDate } from "./historyTypes";

type HistoryListProps = {
  limit?: number;
  title?: string;
  subtitle?: string;
  showAddNewButton?: boolean;
  showMoreHref?: string;
  emptyMessage?: string;
};

const HistoryList = ({
  limit,
  title = "Consultation History",
  subtitle = "View your consultation history with the virtual medical agent.",
  showAddNewButton = true,
  showMoreHref = "/history",
  emptyMessage = "No consultations recorded yet.",
}: HistoryListProps) => {
  const [historyLists, setHistoryLists] = useState<HistoryItem[]>([]);
  const [selectedSession, setSelectedSession] = useState<HistoryItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/session-chat?sessionId=all");
        setHistoryLists(res.data);
        setHasError(false);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const displayedHistory = useMemo(
    () => (limit ? historyLists.slice(0, limit) : historyLists),
    [historyLists, limit]
  );

  const shouldShowMore =
    limit !== undefined && historyLists.length > (limit ?? 0);

  const handleOpenReport = (session: HistoryItem) => {
    setSelectedSession(session);
  };

  const handleCloseReport = () => {
    setSelectedSession(null);
  };

  const isReportReady = (report?: HistoryItem["report"]) =>
    report && Object.keys(report || {}).length > 0;

  return (
    <>
      <section className="min-h-[32rem] bg-base-200 py-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 mt-12">
          <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-base-content/70">{subtitle}</p>
            </div>
            {showAddNewButton && <AddNewSessionDialog />}
          </header>

          {isLoading ? (
            <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center">
              <p className="text-base">Loading consultation history…</p>
            </div>
          ) : hasError ? (
            <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center text-error">
              <p className="text-base">
                Unable to load consultation history. Please try again later.
              </p>
            </div>
          ) : displayedHistory.length === 0 ? (
            <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center">
              <p className="text-base">{emptyMessage}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Doctor</th>
                      <th>Specialist</th>
                      <th>Status</th>
                      <th className="min-w-[10rem] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedHistory.map((item) => (
                      <tr key={item.sessionId}>
                        <td className="font-medium">
                          {getFormattedDate(item.createOn)}
                        </td>
                        <td>{item.selectedDoctor.name}</td>
                        <td>{item.selectedDoctor.specialist}</td>
                        <td>
                          <span
                            className={`badge ${
                              isReportReady(item.report)
                                ? "badge-success"
                                : "badge-warning"
                            } badge-outline`}
                          >
                            {isReportReady(item.report)
                              ? "Ready"
                              : "In Progress"}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              type="button"
                              onClick={() => handleOpenReport(item)}
                              disabled={!isReportReady(item.report)}
                            >
                              View Report
                            </button>
                            <Link
                              href={`/dashboard/medical-agent/${item.sessionId}`}
                              className="btn btn-ghost btn-sm"
                            >
                              Reopen Session
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {shouldShowMore && (
                <div className="flex justify-end">
                  <Link
                    href={showMoreHref}
                    className="btn btn-outline btn-sm sm:btn-md"
                  >
                    Show More
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ViewReportDialog session={selectedSession} onClose={handleCloseReport} />
    </>
  );
};

export default HistoryList;
