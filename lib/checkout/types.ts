export type OrderConfirmation = {
  orderId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
  totalAmount: string;
  currencyCode: string;
  itemCount: number;
};

export type CheckoutActionState = {
  ok?: boolean;
  message?: string;
  /** When set, the client must navigate here (Stripe URL or `/checkout/success`). */
  redirectUrl?: string;
  fieldErrors?: Partial<Record<string, string>>;
};
