import Footer from "components/layout/footer";
import { Breadcrumbs } from "components/layout/breadcrumbs";
import { Gallery } from "components/product/gallery";
import { LuxuryProductCard } from "components/product/luxury-product-card";
import { ProductDescription } from "components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getCollection, getProduct, getProductRecommendations } from "lib/store";
import type { Image } from "lib/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ collection?: string | string[] }>;
}) {
  const params = await props.params;
  const rawSearch = props.searchParams ? await props.searchParams : {};
  const rawCol = rawSearch.collection;
  const collectionParam =
    typeof rawCol === "string"
      ? rawCol
      : Array.isArray(rawCol)
        ? rawCol[0]
        : undefined;

  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const collection =
    collectionParam && collectionParam.length > 0
      ? await getCollection(collectionParam)
      : undefined;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/search" },
    ...(collection
      ? [{ label: collection.title, href: collection.path }]
      : []),
    { label: product.title },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-24 md:pb-20 lg:px-8">
        <Breadcrumbs className="mb-8" items={breadcrumbItems} />
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          <div className="w-full lg:w-[58%]">
            <Suspense
              fallback={
                <div className="aspect-square w-full animate-pulse rounded-none bg-[#fafafa]" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <div className="w-full lg:w-[42%] lg:pt-4">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
      <Footer />
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <section className="mt-20 border-t border-black/[0.06] pt-14">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
            Continue
          </p>
          <h2 className="font-display mt-2 text-2xl font-normal tracking-tight text-[#0c0c0c]">
            You may also like
          </h2>
        </div>
        <Link
          href="/search"
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#6b635a] underline-offset-4 transition-colors hover:text-[#0c0c0c] hover:underline"
        >
          View all
        </Link>
      </div>
      <ul className="flex w-full gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="w-[72vw] max-w-[260px] shrink-0 sm:w-[38vw] md:w-[28vw] lg:w-[240px]"
          >
            <LuxuryProductCard product={product} captionAlign="left" />
          </li>
        ))}
      </ul>
    </section>
  );
}
