// Placeholder policy copy. Replace with Dolly's final wording.
export type Policy = { slug: string; title: string; body: string[] };

export const policies: Policy[] = [
  {
    slug: "shipping",
    title: "Shipping",
    body: [
      "We deliver across Egypt. Orders are usually delivered within 3–7 working days, depending on your governorate.",
      "Shipping fees are calculated at checkout based on your delivery region.",
      "Payment is cash on delivery. All prices are in Egyptian pounds (EGP).",
      "After placing an order, our team will contact you on WhatsApp to confirm the details.",
    ],
  },
  {
    slug: "refunds",
    title: "Refunds & Exchanges",
    body: [
      "If something isn't right, contact us within 14 days of delivery.",
      "Items must be unworn, unwashed and returned with their original tags.",
      "Contact us on WhatsApp or by email to arrange an exchange or return.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    body: [
      "We only collect the details needed to process and deliver your order: name, phone number and address.",
      "We never sell your personal information. It is only shared with our delivery partner to fulfil your order.",
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    body: [
      "By placing an order on this website you agree to these terms.",
      "Product colours may vary slightly from images due to screen settings and lighting.",
      "Dolly reserves the right to update prices and availability without prior notice.",
    ],
  },
];

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);
