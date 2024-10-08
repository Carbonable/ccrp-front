export function CustomLegend({ payload }: any) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-2">
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          className="flex min-w-fit items-center rounded-full border border-neutral-500 px-3 py-1 text-xs text-neutral-300"
        >
          <span className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}</span>
        </li>
      ))}
    </ul>
  );
}
