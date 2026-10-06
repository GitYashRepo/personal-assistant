export const ALLOWED_TOOLS = [
  "get_time",
  "create_alarm",
  "cancel_alarm",
  "create_reminder",
  "create_calendar_event",
  "get_calendar_events",
  "delete_calendar_event",
  "schedule_notifications",
  "make_phone_call",
  "open_youtube",
  "search_youtube",
  "google_search",
  "create_note",
  "open_notes_app",
  "respond"
];

export const toolSchema = {
  create_alarm: ["hour", "minute"],
  create_reminder: ["title", "datetime", "person_company"],
  create_calendar_event: ["title", "date", "time", "duration", "person_company"],
  get_calendar_events: ["upcoming_only"],
  schedule_notifications: ["event_time", "title"],
  make_phone_call: ["contact"],
  search_youtube: ["query"],
  google_search: ["query"],
  create_note: ["content"]
};
