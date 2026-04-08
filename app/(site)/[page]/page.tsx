import type { Metadata } from "next";

import { Breadcrumbs } from "components/layout/breadcrumbs";
import Prose from "components/prose";
import { getPage } from "lib/store";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: page.title },
        ]}
      />
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-[#0a0a0a] md:text-4xl">
        {page.title}
      </h1>
      <Prose className="mb-8" html={page.body} />
      <p className="text-xs text-[#a3a3a3]">
        Last updated{" "}
        {new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(page.updatedAt))}
      </p>
    </>
  );
}
