import type { Image, Page, Product, ProductOption, ProductVariant } from "lib/types";

const USD = (amount: number) => ({
  amount: amount.toFixed(2),
  currencyCode: "USD" as const,
});

function img(id: string, alt: string, w = 1200, h = 1200): Image {
  return {
    url: `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`,
    altText: alt,
    width: w,
    height: h,
  };
}

function buildProduct(p: {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  tags: string[];
  sortIndex: number;
  updatedAt: string;
}): Product {
  const prices = p.variants.map((v) => Number(v.price.amount));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    id: p.id,
    handle: p.handle,
    availableForSale: p.variants.some((v) => v.availableForSale),
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    options: p.options,
    priceRange: {
      minVariantPrice: USD(min),
      maxVariantPrice: USD(max),
    },
    variants: p.variants,
    featuredImage: p.images[0]!,
    images: p.images,
    seo: {
      title: p.title,
      description: p.description.slice(0, 160),
    },
    tags: p.tags,
    updatedAt: p.updatedAt,
    sortIndex: p.sortIndex,
  };
}

export const PRODUCTS: Product[] = [
  buildProduct({
    id: "prod_1",
    handle: "noir-aviator",
    title: "Noir Aviator",
    description:
      "Hand-polished titanium frame with mineral glass lenses and anti-reflective coating. A classic statement in pure black.",
    descriptionHtml:
      "<p>Hand-polished titanium frame with mineral glass lenses and anti-reflective coating. A classic statement in pure black.</p>",
    images: [
      img("1572635196237-14b3f281503f", "Noir Aviator — black aviator sunglasses"),
      img("1511499767150-a48a237f0083", "Noir Aviator — alternate angle"),
    ],
    options: [],
    variants: [
      {
        id: "var_noir_default",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [],
        price: USD(245),
      },
    ],
    tags: ["essentials", "homepage-featured", "homepage-carousel"],
    sortIndex: 10,
    updatedAt: "2026-01-15T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_2",
    handle: "riviera-round",
    title: "Riviera Round",
    description:
      "Acetate round frames with CR-39 lenses. Choose your tint — each pair is inspected by hand before shipping.",
    descriptionHtml:
      "<p>Acetate round frames with CR-39 lenses. Choose your tint — each pair is inspected by hand before shipping.</p>",
    images: [
      img("1509695507497-903c140c43b0", "Riviera Round — round acetate sunglasses"),
      img("1574258495973-f010dfbb5371", "Riviera Round — side profile"),
    ],
    options: [
      {
        id: "opt_lens",
        name: "Lens",
        values: ["Graphite", "Amber", "Olive"],
      },
    ],
    variants: [
      {
        id: "var_riv_graphite",
        title: "Graphite",
        availableForSale: true,
        selectedOptions: [{ name: "Lens", value: "Graphite" }],
        price: USD(195),
      },
      {
        id: "var_riv_amber",
        title: "Amber",
        availableForSale: true,
        selectedOptions: [{ name: "Lens", value: "Amber" }],
        price: USD(195),
      },
      {
        id: "var_riv_olive",
        title: "Olive",
        availableForSale: true,
        selectedOptions: [{ name: "Lens", value: "Olive" }],
        price: USD(195),
      },
    ],
    tags: ["new-arrivals", "homepage-featured", "homepage-carousel"],
    sortIndex: 9,
    updatedAt: "2026-02-01T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_3",
    handle: "meridian-sport",
    title: "Meridian Sport",
    description:
      "Lightweight wrap frame with polarized lenses for glare-free clarity. Designed for open road and open water.",
    descriptionHtml:
      "<p>Lightweight wrap frame with polarized lenses for glare-free clarity. Designed for open road and open water.</p>",
    images: [
      img("1556015048-4d3aa10df74c", "Meridian Sport — sport performance sunglasses"),
    ],
    options: [],
    variants: [
      {
        id: "var_meridian_default",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [],
        price: USD(175),
      },
    ],
    tags: ["essentials", "homepage-featured", "homepage-carousel"],
    sortIndex: 8,
    updatedAt: "2025-12-10T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_4",
    handle: "saint-germain",
    title: "Saint-Germain",
    description:
      "Cat-eye in layered acetate with gold temple detailing. UV400 protection with a soft gradient tint.",
    descriptionHtml:
      "<p>Cat-eye in layered acetate with gold temple detailing. UV400 protection with a soft gradient tint.</p>",
    images: [
      img("1473496169904-658ba7c44d8a", "Saint-Germain — cat-eye sunglasses"),
      img("1516575150-d56ae4e89998", "Saint-Germain — editorial styling"),
    ],
    options: [],
    variants: [
      {
        id: "var_sg_default",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [],
        price: USD(285),
      },
    ],
    tags: ["homepage-carousel", "new-arrivals"],
    sortIndex: 7,
    updatedAt: "2026-01-20T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_5",
    handle: "alpine-navigator",
    title: "Alpine Navigator",
    description:
      "Double-bridge navigator in brushed metal. Precision hinges and adjustable nose pads for a tailored fit.",
    descriptionHtml:
      "<p>Double-bridge navigator in brushed metal. Precision hinges and adjustable nose pads for a tailored fit.</p>",
    images: [
      img("1577803645773-f96470509666", "Alpine Navigator — metal navigator frames"),
    ],
    options: [],
    variants: [
      {
        id: "var_alpine_default",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [],
        price: USD(220),
      },
    ],
    tags: ["homepage-carousel", "essentials"],
    sortIndex: 6,
    updatedAt: "2026-02-05T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_6",
    handle: "paloma-oversized",
    title: "Paloma Oversized",
    description:
      "Bold Italian acetate with premium sun lenses. The silhouette that owns the room.",
    descriptionHtml:
      "<p>Bold Italian acetate with premium sun lenses. The silhouette that owns the room.</p>",
    images: [
      img("1508296695146-257a814070b4", "Paloma Oversized — bold designer sunglasses"),
    ],
    options: [
      {
        id: "opt_hue",
        name: "Color",
        values: ["Black", "Tortoise"],
      },
    ],
    variants: [
      {
        id: "var_paloma_noir",
        title: "Black",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Black" }],
        price: USD(310),
      },
      {
        id: "var_paloma_havana",
        title: "Tortoise",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Tortoise" }],
        price: USD(310),
      },
    ],
    tags: ["new-arrivals"],
    sortIndex: 5,
    updatedAt: "2026-01-28T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_7",
    handle: "linea-titanium",
    title: "Linea Titanium",
    description:
      "Ultra-slim rimless construction in beta-titanium. Featherlight on the face, uncompromising on optics.",
    descriptionHtml:
      "<p>Ultra-slim rimless construction in beta-titanium. Featherlight on the face, uncompromising on optics.</p>",
    images: [
      img("1509695507497-903c140c43b0", "Linea Titanium — rimless titanium frames"),
    ],
    options: [],
    variants: [
      {
        id: "var_linea_default",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [],
        price: USD(265),
      },
    ],
    tags: ["essentials"],
    sortIndex: 4,
    updatedAt: "2025-11-01T12:00:00.000Z",
  }),
  buildProduct({
    id: "prod_8",
    handle: "vesper-keyhole",
    title: "Vesper Keyhole",
    description:
      "Keyhole bridge and sculpted temples in matte tortoise. Everyday refinement with a vintage soul.",
    descriptionHtml:
      "<p>Keyhole bridge and sculpted temples in matte tortoise. Everyday refinement with a vintage soul.</p>",
    images: [
      img("1508296695146-257a814070b4", "Vesper Keyhole — tortoise acetate frames"),
    ],
    options: [],
    variants: [
      {
        id: "var_vesper_default",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [],
        price: USD(155),
      },
    ],
    tags: ["new-arrivals"],
    sortIndex: 3,
    updatedAt: "2025-10-15T12:00:00.000Z",
  }),
];

const productByHandle = new Map(PRODUCTS.map((p) => [p.handle, p]));
const variantIndex = new Map<string, { product: Product; variant: ProductVariant }>();

for (const product of PRODUCTS) {
  for (const variant of product.variants) {
    variantIndex.set(variant.id, { product, variant });
  }
}

export function getProductByHandle(handle: string): Product | undefined {
  return productByHandle.get(handle);
}

export function lookupVariant(merchandiseId: string):
  | { product: Product; variant: ProductVariant }
  | undefined {
  return variantIndex.get(merchandiseId);
}

const COLLECTION_PRODUCT_HANDLES: Record<string, string[]> = {
  "": [],
  "hidden-homepage-featured-items": [
    "noir-aviator",
    "riviera-round",
    "meridian-sport",
  ],
  "hidden-homepage-carousel": [
    "noir-aviator",
    "riviera-round",
    "meridian-sport",
    "saint-germain",
    "alpine-navigator",
  ],
  "new-arrivals": PRODUCTS.filter((p) => p.tags.includes("new-arrivals")).map(
    (p) => p.handle,
  ),
  essentials: PRODUCTS.filter((p) => p.tags.includes("essentials")).map(
    (p) => p.handle,
  ),
};

export function listProductsForCollection(handle: string): Product[] {
  const handles =
    handle === ""
      ? PRODUCTS.map((p) => p.handle)
      : COLLECTION_PRODUCT_HANDLES[handle];
  if (!handles) return [];
  const set = new Set(handles);
  return PRODUCTS.filter((p) => set.has(p.handle));
}

export const CMS_PAGES: Page[] = [
  {
    id: "page_privacy",
    title: "Privacy Policy",
    handle: "privacy-policy",
    body: `<p>We respect your privacy. This policy describes what information we collect when you shop with us, how we use it, and your choices.</p>
<h2>Information we collect</h2>
<p>We collect information you provide (name, email, shipping address, payment details processed by our payment partners), order history, and technical data such as device and browser type when you use our site.</p>
<h2>How we use information</h2>
<p>We use this data to process and deliver orders, communicate about your purchase, improve our store, and comply with legal obligations. We do not sell your personal information.</p>
<h2>Cookies</h2>
<p>We use cookies and similar technologies to run the cart, remember preferences, and understand how our site is used. You can control cookies through your browser settings.</p>
<h2>Your rights</h2>
<p>Depending on where you live, you may have the right to access, correct, or delete your personal data, or to object to certain processing. Contact us to exercise these rights.</p>
<h2>Contact</h2>
<p>For privacy questions, reach out through the contact options listed on our site.</p>`,
    bodySummary: "How we collect, use, and protect your information.",
    seo: {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your information.",
    },
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "page_terms",
    title: "Terms of Service",
    handle: "terms-of-service",
    body: `<p>By accessing or purchasing from our online store, you agree to these terms.</p>
<h2>Orders and pricing</h2>
<p>Product descriptions, images, and prices are shown as accurately as possible. We reserve the right to correct errors, refuse or cancel orders, and update pricing before acceptance of your order.</p>
<h2>Payment</h2>
<p>Payment is charged when your order is confirmed. You authorize us and our payment partners to charge your selected payment method for the total shown at checkout.</p>
<h2>Products</h2>
<p>Risk of loss passes to you upon delivery to the carrier. Limited warranties, if any, are described on the product page or with your purchase.</p>
<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the site or products. Our total liability for any claim related to an order is limited to the amount you paid for that order.</p>
<h2>Governing law</h2>
<p>These terms are governed by applicable local laws, without regard to conflict-of-law rules.</p>`,
    bodySummary: "Terms governing use of our store and purchases.",
    seo: {
      title: "Terms of Service",
      description: "Terms governing use of our store and purchases.",
    },
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "page_faq",
    title: "FAQs",
    handle: "faqs",
    body: `<h2>Orders</h2>
<p><strong>Can I change or cancel my order?</strong> Contact us as soon as possible. Once an order has shipped, we cannot modify it; you may return eligible items per our shipping and returns policy.</p>
<p><strong>Do you ship internationally?</strong> Shipping regions and rates are shown at checkout. If your country is not listed, we do not currently ship there.</p>
<h2>Products &amp; fit</h2>
<p><strong>How do I choose the right size?</strong> Frame measurements are listed on each product page. If you are between sizes, our team can help you compare fits.</p>
<p><strong>Are lenses included?</strong> Lens options and what is included with each frame are described on the product detail page.</p>
<h2>Care</h2>
<p><strong>How should I clean my eyewear?</strong> Use a microfiber cloth and lens-safe cleaner. Avoid paper towels and harsh chemicals that can damage coatings.</p>`,
    bodySummary: "Common questions about orders, products, and care.",
    seo: {
      title: "FAQs",
      description: "Common questions about orders, products, and care.",
    },
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "page_payments",
    title: "Payment options",
    handle: "payments",
    body: `<p>We accept the payment methods below. All transactions are processed securely; we do not store your full card number on our servers.</p>
<h2>Cards</h2>
<p>Visa, Mastercard, American Express, and Discover credit and debit cards.</p>
<h2>Digital wallets</h2>
<p>Apple Pay, Google Pay, and Shop Pay where available in your region.</p>
<h2>Other</h2>
<p>PayPal and other localized methods may appear at checkout depending on your location and currency.</p>
<p>If a payment fails, check your details or try another method. For repeated issues, contact your bank or our support team.</p>`,
    bodySummary: "Cards, wallets, and other ways to pay.",
    seo: {
      title: "Payment options",
      description: "Cards, wallets, and other ways to pay.",
    },
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "page_shipping",
    title: "Shipping & returns",
    handle: "shipping-returns",
    body: `<h2>Shipping options</h2>
<p><strong>Standard</strong> — Delivery in 5–7 business days after dispatch. Complimentary on qualifying orders where noted at checkout.</p>
<p><strong>Express</strong> — Delivery in 2–3 business days after dispatch. Rates are calculated at checkout.</p>
<p><strong>Overnight</strong> — Where available, next business day after dispatch for an additional fee shown at checkout.</p>
<p>Carriers may include major national courier services; the carrier for your order appears in your shipping confirmation. Rural or remote addresses may take longer.</p>
<h2>Order processing</h2>
<p>Orders are typically processed within 1–2 business days (excluding weekends and holidays). You will receive tracking information by email when your order ships.</p>
<h2>Returns</h2>
<p>We accept returns of unworn items in original packaging within 14 days of delivery. Initiate a return through your order confirmation or by contacting support. Refunds are issued to the original payment method after we receive and inspect the return. Shipping charges are non-refundable unless the return is due to our error.</p>`,
    bodySummary: "Shipping methods, delivery times, and returns.",
    seo: {
      title: "Shipping & Returns",
      description: "Shipping methods, delivery times, and returns.",
    },
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-04-01T12:00:00.000Z",
  },
];
