export default function Title({ title, isBeta }: { title: string; isBeta?: boolean }) {
  return (
    <div className="mb-8 mt-12 flex items-center border-b border-neutral-500 pb-2 text-xl font-bold text-neutral-100">
      {title}
      {isBeta && (
        <span className="ml-3 rounded-md bg-beta-button px-3 py-1 text-xs font-light">
          Beta version
        </span>
      )}
    </div>
  );
}

export function SmallTitle({ title }: { title: string }) {
  return <div className="w-full text-center text-sm text-neutral-300">{title}</div>;
}

export function ImpactTitle({ title, value }: { title: string; value: string }) {
  return (
    <>
      <div className="text-sm text-neutral-300">{title}</div>
      <div className="mt-3 text-xl font-bold text-neutral-50">{value}</div>
    </>
  );
}
