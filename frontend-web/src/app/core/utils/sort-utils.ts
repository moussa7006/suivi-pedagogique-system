export type SortDirection = 'asc' | 'desc';

export function compareAlphaNumeric(valueA: unknown, valueB: unknown): number {
  return String(valueA ?? '').localeCompare(String(valueB ?? ''), 'fr', {
    numeric: true,
    sensitivity: 'base',
    ignorePunctuation: true,
  });
}

export function sortByAlpha<T>(
  items: readonly T[] | null | undefined,
  selector: (item: T) => unknown,
  direction: SortDirection = 'asc',
): T[] {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...(items ?? [])].sort((a, b) => multiplier * compareAlphaNumeric(selector(a), selector(b)));
}

export function sortByNumber<T>(
  items: readonly T[] | null | undefined,
  selector: (item: T) => number | null | undefined,
  direction: SortDirection = 'desc',
): T[] {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...(items ?? [])].sort((a, b) => multiplier * ((selector(a) ?? 0) - (selector(b) ?? 0)));
}
