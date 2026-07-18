export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateReferralCode(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatDiscount(type: string, value: string | null) {
  if (!value) return "";
  switch (type) {
    case "percentage":
      return `${value}% OFF`;
    case "fixed":
      return `R$ ${value} OFF`;
    case "free_shipping":
      return "Frete grátis";
    default:
      return value;
  }
}

/** 1234 → "1,2 mil"; 2500000 → "2,5 mi" — como as redes exibem seguidores. */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "")} mi`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(".", ",").replace(",0", "")} mil`;
  return String(count);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    return `"${str.replace(/"/g, '""')}"`;
  };
  const lines = [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))];
  return lines.join("\n");
}
