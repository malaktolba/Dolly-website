// D1 stores UTC as "YYYY-MM-DD HH:MM:SS"; show it in Cairo time.
export function cairoTime(utc: string) {
  return new Date(utc.replace(" ", "T") + "Z").toLocaleString("en-GB", {
    timeZone: "Africa/Cairo",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
