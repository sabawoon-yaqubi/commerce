import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div
      className="relative flex h-10 w-10 items-center justify-center transition-colors"
      style={{ color: "var(--nav-muted)" }}
    >
      <ShoppingBagIcon
        className={clsx("h-[19px] w-[19px]", className)}
        strokeWidth={1.25}
      />
      {quantity && quantity > 0 ? (
        <span
          className="absolute right-0.5 top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-none px-0.5 text-[9px] font-semibold tabular-nums transition-colors duration-300"
          style={{
            backgroundColor: "var(--nav-badge-bg)",
            color: "var(--nav-badge-fg)",
          }}
        >
          {quantity}
        </span>
      ) : null}
    </div>
  );
}
