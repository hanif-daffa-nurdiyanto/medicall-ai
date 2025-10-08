export type ReportData = {
  sessionId?: string;
  agent?: string;
  user?: string;
  timestamp?: string;
  chiefComplaint?: string;
  summary?: string;
  symptoms?: string[];
  duration?: string;
  severity?: string;
  medicationsMentioned?: string[];
  recommendations?: string[];
};

export type TranscriptMessage = {
  role: string;
  text: string;
};

export type HistoryItem = {
  sessionId: string;
  createOn: string;
  selectedDoctor: {
    name: string;
    specialist: string;
  };
  report?: ReportData | null;
  notes?: string;
  conversation?: TranscriptMessage[] | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

export const getFormattedDate = (value?: string | null) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }
  return dateFormatter.format(parsed);
};
