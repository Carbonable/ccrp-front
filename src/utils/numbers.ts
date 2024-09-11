type Maybe<T> = T | null;

export function roundIfFloat(
  value: Maybe<number> | number | undefined,
  decimals: number = 2,
): string {
  if (value === null || value === undefined) {
    return 'n/a';
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}
