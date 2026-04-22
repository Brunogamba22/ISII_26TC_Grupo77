export function formatFechaYYYYMMDDToDDMMYYYY(yyyymmdd) {
  const s = String(yyyymmdd ?? "");
  if (s.length !== 8) return String(yyyymmdd ?? "");
  const yyyy = s.slice(0, 4);
  const mm = s.slice(4, 6);
  const dd = s.slice(6, 8);
  return `${dd}/${mm}/${yyyy}`;
}

export function formatHorarioHHMMToHHMM(hhmm) {
  const n = Number(hhmm);
  if (!Number.isFinite(n)) return String(hhmm ?? "");
  const hh = Math.floor(n / 100);
  const mm = n % 100;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

