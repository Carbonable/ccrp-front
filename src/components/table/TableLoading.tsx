export default function TableLoading({
  resultsPerPage,
  numberOfColumns,
}: {
  resultsPerPage: number;
  numberOfColumns: number;
}) {
  const lines = Array.from(Array(resultsPerPage).keys());
  const colums = Array.from(Array(numberOfColumns).keys());
  return (
    <>
      {lines.map((line: number) => {
        return (
          <tr className="border-b border-neutral-600 last:border-b-0" key={`loader_${line}`}>
            {colums.map((column: number) => {
              return (
                <td
                  className="h-12 animate-pulse border-4 border-transparent bg-opacityLight-10"
                  key={`loader_${line}_${column}`}
                ></td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
