import Grid from "components/grid";
import { LuxuryProductCard } from "components/product/luxury-product-card";
import { Product } from "lib/types";

export default function ProductGridItems({
  products,
  collectionHandle,
}: {
  products: Product[];
  /** Pass on collection listing pages so product URLs preserve category breadcrumbs. */
  collectionHandle?: string;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle}>
          <LuxuryProductCard
            product={product}
            captionAlign="left"
            collectionHandle={collectionHandle}
            listing="plp"
          />
        </Grid.Item>
      ))}
    </>
  );
}
