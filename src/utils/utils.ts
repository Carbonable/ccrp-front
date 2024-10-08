export function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Returns a color for a project based on its type
export function getProjectColor(projectColor: string): string {
  const colors = ['#2B2E36'];
  switch (projectColor) {
    case 'GREEN':
      return '#1B6B49';
    case 'BLUE':
      return '#334566';
    case 'ORANGE':
      return '#CFBD70';
    case 'random':
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    default:
      return '#878A94';
  }
}

// Returns the numeric part of a percentage string
export function getNumericPercentage(str: string): number {
  // Regular expression to match the numeric part of the percentage string
  const regex = /^(\d+(\.\d+)?)\s*%/;

  // Check if the string matches the regex pattern
  const match = str.match(regex);

  // If there's a match, extract the numeric part and convert it to a number
  if (match && match.length > 1) {
    const numericPart = parseFloat(match[1]);
    return numericPart;
  }

  // If there's no match, return null or any other value to indicate failure
  return 0;
}
