export function formatCompactNumber(value: number, maximumFractionDigits = 1): string {
  const compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits,
    minimumFractionDigits: 0
  }).format(value);

  return compact.replace(/[KMBT]$/, (suffix) => suffix.toLowerCase());
}

export function formatInstalls(installs: number): string {
  return formatCompactNumber(installs, 1);
}
