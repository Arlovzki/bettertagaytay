/** Published pesos, abbreviated for tables. Missing amounts remain distinct from zero. */
export function php(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return 'Not listed';
  const a = Math.abs(n);
  const [div, suffix] =
    a >= 1e12
      ? [1e12, 'T']
      : a >= 1e9
        ? [1e9, 'B']
        : a >= 1e6
          ? [1e6, 'M']
          : a >= 1e3
            ? [1e3, 'K']
            : [1, ''];
  if (div === 1) return '₱' + Math.round(n).toLocaleString('en-US');
  const v = n / div;
  const digits = Math.abs(v) >= 100 ? 1 : 2;
  return (
    '₱' +
    v.toLocaleString('en-US', {
      maximumFractionDigits: digits,
      minimumFractionDigits: 1,
    }) +
    suffix
  );
}

/** Exact pesos: ₱4,744,932,000. */
export function phpFull(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return 'Not listed';
  return '₱' + Math.round(n).toLocaleString('en-US');
}

/** A signed change: +₱150.0M, −₱14.00B, or "no change". */
export function phpDelta(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return 'Not comparable';
  if (n === 0) return 'no change';
  return (n > 0 ? '+' : '−') + php(Math.abs(n));
}

export function count(n: number): string {
  return n.toLocaleString('en-US');
}

/** "1 project", "433 projects". */
export function plural(n: number, one: string, many = one + 's'): string {
  return `${count(n)} ${n === 1 ? one : many}`;
}

export function date(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Manila',
      });
}
