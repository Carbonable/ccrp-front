import { classNames } from '@/utils/utils';

interface PromptComposerProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  submitLabel: string;
  loadingLabel?: string;
  helperText?: string;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function PromptComposer({
  value,
  placeholder,
  disabled,
  loading,
  submitLabel,
  loadingLabel,
  helperText,
  error,
  onChange,
  onSubmit,
}: PromptComposerProps) {
  return (
    <div className="border-t border-neutral-800 px-4 py-4">
      <div className="rounded-[1.4rem] border border-neutral-800 bg-neutral-950/90 p-3 shadow-inner shadow-black/20">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-[110px] w-full resize-none bg-transparent px-2 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
        />

        {error ? (
          <div role="alert" className="px-2 pt-1 text-xs text-red-400">
            {error}
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-800/80 px-2 pt-3">
          <div className="text-xs text-neutral-500">{helperText}</div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled}
            className={classNames(
              'rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-110',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {loading ? loadingLabel || submitLabel : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
