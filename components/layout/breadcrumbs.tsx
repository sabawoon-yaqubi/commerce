import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  /** Omit on the current page (last segment). */
  href?: string;
};

export function Breadcrumbs({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8580]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex max-w-full items-center">
              {i > 0 ? (
                <span className="mx-2 shrink-0 text-black/[0.2]" aria-hidden>
                  /
                </span>
              ) : null}
              {last || !item.href ? (
                <span
                  className={
                    last
                      ? "line-clamp-2 text-[#0c0c0c]"
                      : "text-[#8a8580]"
                  }
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="shrink-0 transition-colors hover:text-[#0c0c0c]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
