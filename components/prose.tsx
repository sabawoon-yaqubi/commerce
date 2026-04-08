import clsx from "clsx";

const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={clsx(
        "prose prose-neutral max-w-none prose-p:leading-relaxed prose-a:text-[#0a0a0a] prose-a:underline prose-a:underline-offset-4",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
