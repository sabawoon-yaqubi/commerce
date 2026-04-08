import clsx from "clsx";

export default function LogoSquare({ size }: { size?: "sm" | "md" }) {
  return (
    <span
      className={clsx(
        "flex flex-none items-center justify-center rounded-none bg-[#0a0a0a]",
        {
          "h-7 w-7": size === "md" || !size,
          "h-5 w-5": size === "sm",
        },
      )}
    >
      <span
        className={clsx("font-bold leading-none text-white", {
          "text-[10px]": size === "md" || !size,
          "text-[7px]": size === "sm",
        })}
      >
        N
      </span>
    </span>
  );
}
