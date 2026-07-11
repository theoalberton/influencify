export interface DayPoint {
  /** yyyy-mm-dd */
  iso: string;
  /** ex: "12/07" */
  label: string;
  clicks: number;
  leads: number;
}

/** Agrega timestamps em contagens diárias dos últimos `days` dias (inclui hoje). */
export function buildDailySeries(clickDates: string[], leadDates: string[], days = 30): DayPoint[] {
  const points: DayPoint[] = [];
  const byIso = new Map<string, DayPoint>();

  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const point: DayPoint = {
      iso,
      label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      clicks: 0,
      leads: 0,
    };
    points.push(point);
    byIso.set(iso, point);
  }

  for (const ts of clickDates) {
    const point = byIso.get(ts.slice(0, 10));
    if (point) point.clicks++;
  }
  for (const ts of leadDates) {
    const point = byIso.get(ts.slice(0, 10));
    if (point) point.leads++;
  }

  return points;
}
