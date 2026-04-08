const MAX = 500;

export function buildShippingMetadata(payload: {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}): string {
  let p = { ...payload };
  for (let i = 0; i < 8; i++) {
    const s = JSON.stringify(p);
    if (s.length <= MAX) return s;
    if (p.notes.length > 0) {
      p = { ...p, notes: p.notes.slice(0, Math.max(0, p.notes.length - 100)) };
      continue;
    }
    if (p.address2.length > 0) {
      p = { ...p, address2: "" };
      continue;
    }
    p = { ...p, company: "" };
  }
  return JSON.stringify(p).slice(0, MAX);
}
