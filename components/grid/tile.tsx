import clsx from "clsx";
import Image from "next/image";
import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f5f5] transition-all duration-500",
        {
          relative: label,
          "ring-2 ring-[#0a0a0a]": active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full w-full object-cover", {
            "transition-transform duration-700 ease-out group-hover:scale-[1.04]":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
