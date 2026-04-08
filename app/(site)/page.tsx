import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { BrandsMarquee } from "components/home/brands-marquee";
import { DiscoveryShelves } from "components/home/discovery-shelves";
import { EditorialFeature } from "components/home/editorial-feature";
import { LuxuryHero } from "components/home/luxury-hero";
import { ServicePromises } from "components/home/service-promises";
import Footer from "components/layout/footer";

export const metadata = {
  description: "Luxury eyewear — frames and lenses, curated with care.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <LuxuryHero />
      <ServicePromises />
      <DiscoveryShelves />

      <ThreeItemGrid />
      <Carousel />

      <EditorialFeature />
      <BrandsMarquee />

      <Footer />
    </>
  );
}
