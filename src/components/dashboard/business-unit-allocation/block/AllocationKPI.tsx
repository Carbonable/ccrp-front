export default function AllocationKPI({
  title,
  value,
}: {
  title: string;
  value: string | undefined;
}) {
  return (
    <div className="grid w-full grid-rows-2">
      <div className="font-inter text-[10px] uppercase text-neutral-300 xl:text-xs">{title}</div>
      <div className="text-2xl font-bold text-neutral-100">{value}</div>
    </div>
  );
}
