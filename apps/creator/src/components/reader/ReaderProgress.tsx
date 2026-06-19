// ReaderProgress — current position indicator (dots for small N, "i / N" for large).
export function ReaderProgress({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex items-center gap-2" data-testid="reader-progress">
      {total <= 12 ? (
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-signal' : 'w-1.5 bg-gray-rule'}`}
            />
          ))}
        </div>
      ) : (
        <span className="text-[11px] font-bold tabular-nums text-gray-mid">
          {index + 1} / {total}
        </span>
      )}
    </div>
  )
}
