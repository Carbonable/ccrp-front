export default function ErrorReload({ refetchData }: { refetchData?: () => void }) {
  return (
    <div
      className="m-2 w-fit cursor-pointer rounded-xl border border-neutral-600 bg-opacityLight-5 px-4 py-2 text-xl font-bold text-neutral-100 hover:brightness-105"
      onClick={refetchData}
    >
      Reload
    </div>
  );
}

export function ErrorReloadTable({ refetchData }: { refetchData?: () => void }) {
  return (
    <tr>
      <td>
        <div
          className="m-2 cursor-pointer rounded-xl border border-neutral-600 bg-opacityLight-5 px-4 py-2 text-xl font-bold text-neutral-100 hover:brightness-105"
          onClick={refetchData}
        >
          Reload
        </div>
      </td>
    </tr>
  );
}

export function NoDataTable() {
  return (
    <tr>
      <td className="p-4 text-lg">No data</td>
    </tr>
  );
}
