/** Sunglasses & sun-focused houses — edit freely */
export const FEATURED_BRANDS: { name: string; origin?: string }[] = [
  { name: "Ray-Ban", origin: "USA" },
  { name: "Oakley", origin: "USA" },
  { name: "Persol", origin: "Italy" },
  { name: "Maui Jim", origin: "Hawaii" },
  { name: "Costa Del Mar", origin: "USA" },
  { name: "Smith", origin: "USA" },
  { name: "Raen", origin: "California" },
  { name: "Electric", origin: "California" },
];

/** Base order for the marquee */
export const MARQUEE_BRAND_LABELS: string[] = FEATURED_BRANDS.map((b) => b.name);

/**
 * Each scrolling segment must be wider than the viewport so the loop never
 * shows empty space. This repeats the base list several times per segment.
 */
const MARQUEE_CYCLES_PER_SEGMENT = 5;
export const MARQUEE_STRIP_ITEMS: string[] = Array.from(
  { length: MARQUEE_CYCLES_PER_SEGMENT },
  () => MARQUEE_BRAND_LABELS,
).flat();
