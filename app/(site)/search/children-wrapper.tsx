"use client";

import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

// Ensure children update when query or sort (or other params) change
export default function ChildrenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  return <Fragment key={searchParams.toString()}>{children}</Fragment>;
}
