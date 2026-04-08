"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto my-24 flex max-w-md flex-col items-center px-6 text-center">
      <h2 className="text-2xl font-bold text-[#0a0a0a]">
        Something went wrong
      </h2>
      <p className="mt-3 text-[14px] text-[#737373]">
        Please try again. If the issue continues, contact support.
      </p>
      <button
        className="mt-8 rounded-none bg-[#0a0a0a] px-8 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#0a0a0a]/80"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
