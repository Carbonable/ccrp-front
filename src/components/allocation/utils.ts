export function onlyPositiveInteger(e: React.KeyboardEvent<HTMLInputElement>) {
  // Prevent entering non-numeric characters, "e", ".", and "-"
  if (
    e.key === 'e' ||
    e.key === '.' ||
    e.key === '-' ||
    (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete')
  ) {
    e.preventDefault();
  }
}
