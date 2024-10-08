export default function CircleProgress({
  rate,
  size,
  bgColor,
  progressColor,
}: {
  rate?: number | undefined | any;
  size: number;
  bgColor: string;
  progressColor: string;
}) {
  if (!rate || rate === 0 || rate === 'NaN %') return null;

  return (
    <div
      className="relative ml-auto mr-3 h-[60px] w-[60px] rounded-full bg-neutral-500"
      style={{ backgroundImage: `conic-gradient(${bgColor} ${rate}%, ${progressColor} 0)` }}
    >
      <div
        className={`font-inter absolute left-2/4 top-2/4 flex translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full bg-neutral-800 font-semibold text-neutral-50`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {rate}
      </div>
    </div>
  );
}
