import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 w-full @container/label",
        {
          "lg:bottom-auto lg:left-auto lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:px-12": position === "center",
        },
      )}
    >
      <div className="bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 pb-5 pt-10">
        <h3 className="line-clamp-2 text-[14px] font-medium text-white">
          {title}
        </h3>
        <Price
          className="mt-1 text-[13px] text-white/70"
          amount={amount}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
};

export default Label;
