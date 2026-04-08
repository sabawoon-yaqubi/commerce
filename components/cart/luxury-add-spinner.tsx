import clsx from "clsx";

/**
 * Fine-line arc spinner (currentColor) — quiet, editorial loading state
 * common on high-end retail sites.
 */
export function LuxuryAddSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={clsx(
        "luxury-add-spinner-svg",
        className ?? "h-[18px] w-[18px]",
      )}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <circle
        cx="10"
        cy="10"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.1"
        className="opacity-[0.14]"
      />
      <circle
        cx="10"
        cy="10"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="10.5 35"
        strokeDashoffset="0"
        className="opacity-[0.92]"
      />
    </svg>
  );
}
