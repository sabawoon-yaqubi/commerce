import clsx from "clsx";

function Grid(props: React.ComponentProps<"ul">) {
  return (
    <ul
      {...props}
      className={clsx(
        "grid grid-flow-row gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10 lg:gap-y-14",
        props.className,
      )}
    >
      {props.children}
    </ul>
  );
}

function GridItem(props: React.ComponentProps<"li">) {
  return (
    <li {...props} className={clsx("min-w-0 transition-opacity", props.className)}>
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;

export default Grid;
