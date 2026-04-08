import OpengraphImage from "components/opengraph-image";
import { getPage } from "lib/store";

export default async function Image({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: handle } = await params;
  const page = await getPage(handle);
  if (!page) {
    return await OpengraphImage({ title: "Page" });
  }
  const title = page.seo?.title || page.title;

  return await OpengraphImage({ title });
}
