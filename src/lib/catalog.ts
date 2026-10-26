// Product catalogue. Static for now; swap for a database/API later.
// Images are hosted on the current store's CDN (files.easy-orders.net).

export type CollectionSlug = "summer-26" | "winter-25" | "ramadan-set";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  code: string;
  season: string;
  intro: string;
  cover: string;
};

export type Category = "Skirts" | "Dresses" | "Sets" | "Outerwear" | "Tops" | "Bottoms";

export type Product = {
  slug: string;
  code: string;
  name: string;
  price: number;
  salePrice?: number;
  collections: CollectionSlug[];
  category: Category;
  sizes: string[];
  color: string;
  style: string;
  description: string;
  modelWears: string;
  images: string[];
};

const img = (id: string) => `https://files.easy-orders.net/${id}`;

export const collections: Collection[] = [
  {
    slug: "summer-26",
    name: "Summer '26",
    code: "SS26",
    season: "Spring / Summer 2026",
    intro:
      "Sparkle for the night, crochet for the shore. Pieces made for golden hours, seaside dinners and every moment you want to be seen.",
    cover: img("1785103536298189901.jpg"),
  },
  {
    slug: "winter-25",
    name: "Winter '25",
    code: "AW25",
    season: "Autumn / Winter 2025",
    intro:
      "Rich cocoa, chalk beige and jet black. Tailored silhouettes and soft structure, designed for strength, comfort and quiet confidence.",
    cover: img("1764390252783303731.jpeg"),
  },
  {
    slug: "ramadan-set",
    name: "Ramadan Set",
    code: "RS26",
    season: "Ramadan 2026",
    intro:
      "Flowing capes, high necklines and straight-leg trousers. An elegant, modest two-piece for evenings of gathering.",
    cover: img("1771986850687782724.jpeg"),
  },
];

export const products: Product[] = [
  {
    slug: "terra-dress",
    code: "SS26-04",
    name: "Terra Dress",
    price: 2500,
    collections: ["summer-26"],
    category: "Dresses",
    sizes: ["S-M"],
    color: "Brown",
    style: "Beach coverup dress",
    description:
      "A timeless dress that combines comfort with sophistication. Designed to take you from golden-hour moments to elegant evening occasions.",
    modelWears: "S-M",
    images: [img("1785103536298189901.jpg"), img("1785103856246837105.jpg")],
  },
  {
    slug: "disco-peach-skirt",
    code: "SS26-03",
    name: "Disco Peach Skirt",
    price: 1600,
    collections: ["summer-26"],
    category: "Skirts",
    sizes: ["S", "M", "L"],
    color: "Peach",
    style: "Sparkle chic",
    description:
      "Your go-to statement piece for parties, concerts, special events, or any occasion where you want to stand out. Pair it with your favourite top and let the sparkle do the talking.",
    modelWears: "S",
    images: [
      img("1784065096672894997.jpeg"),
      img("1784065095486726476.jpeg"),
      img("1784065094934580044.jpeg"),
      img("1784065096179197980.jpeg"),
    ],
  },
  {
    slug: "disco-yellow-skirt",
    code: "SS26-01",
    name: "Disco Yellow Skirt",
    price: 1600,
    collections: ["summer-26"],
    category: "Skirts",
    sizes: ["S", "M", "L"],
    color: "Yellow",
    style: "Sparkle chic",
    description:
      "Your go-to statement piece for parties, concerts, special events, or any occasion where you want to stand out. Pair it with your favourite top and let the sparkle do the talking.",
    modelWears: "S",
    images: [img("1784161093391813443.jpg")],
  },
  {
    slug: "golden-hour-skirt",
    code: "SS26-02",
    name: "Golden Hour Skirt",
    price: 1350,
    collections: ["summer-26"],
    category: "Skirts",
    sizes: ["S", "M", "L"],
    color: "White",
    style: "Beach coverup skirt",
    description:
      "An elegant crochet skirt designed to move with ease. Perfect for beach vacations, seaside dinners and warm summer days.",
    modelWears: "S",
    images: [img("1785066299906637391.jpeg")],
  },
  {
    slug: "brown-coat",
    code: "AW25-01",
    name: "The Brown Coat",
    price: 2500,
    salePrice: 2300,
    collections: ["winter-25"],
    category: "Outerwear",
    sizes: ["S-M", "L-XL"],
    color: "Rich cocoa",
    style: "Long, oversized maxi coat",
    description:
      "A timeless staple designed for strength and comfort. This maxi-length coat wraps you in softness, making it an essential piece that symbolises resilience.",
    modelWears: "S-M",
    images: [
      img("1764390252783303731.jpeg"),
      img("1764412653204733064.jpeg"),
      img("1764412653225703396.jpeg"),
      img("1764412653240027722.jpeg"),
      img("1764412653243861132.jpeg"),
    ],
  },
  {
    slug: "funnel-suede-jacket",
    code: "AW25-02",
    name: "The Funnel Suede Jacket",
    price: 2000,
    collections: ["winter-25"],
    category: "Outerwear",
    sizes: ["S-M", "L-XL"],
    color: "Jet black",
    style: "Sculpted jacket with a high zip-up funnel neck",
    description:
      "Structure meets sophistication. The strong lines and distinctive high funnel neck embody confidence and power. Every piece tells a story of modern individuality.",
    modelWears: "S-M",
    images: [
      img("1764390672474292804.jpeg"),
      img("1764598986864688549.jpeg"),
      img("1764598986884161783.jpeg"),
      img("1764598986930492283.jpeg"),
    ],
  },
  {
    slug: "beige-set",
    code: "AW25-03",
    name: "The Beige Set",
    price: 2200,
    collections: ["winter-25"],
    category: "Sets",
    sizes: ["S", "M", "L"],
    color: "Chalk beige",
    style: "Collarless button-front jacket and wide-leg trousers",
    description:
      "Elegance in simplicity. This tailored set, featuring the signature button-up blazer, gives a clean silhouette that reflects both grace and confidence. Your starting piece for a new story.",
    modelWears: "S",
    images: [
      img("1764598597164260579.jpeg"),
      img("1764598653918379881.jpeg"),
      img("1764598653946120233.jpeg"),
    ],
  },
  {
    slug: "signature-blazer",
    code: "AW25-04",
    name: "The Signature Button-Up Blazer",
    price: 1300,
    collections: ["winter-25"],
    category: "Tops",
    sizes: ["S", "M", "L"],
    color: "Chalk beige",
    style: "Clean, tailored silhouette",
    description:
      "A tailored top with a signature collarless, button-front design. It reflects grace and confidence.",
    modelWears: "S",
    images: [img("1764521855660105949.jpeg"), img("1764521865808217759.jpeg")],
  },
  {
    slug: "the-trousers",
    code: "AW25-05",
    name: "The Trousers",
    price: 1000,
    collections: ["winter-25"],
    category: "Bottoms",
    sizes: ["S", "M", "L"],
    color: "Chalk beige",
    style: "Straight fit, an even classic width from hip to hem",
    description:
      "Elegant bottoms designed to keep things simple and balance the tailored top.",
    modelWears: "S",
    images: [img("1764521659792579362.jpeg"), img("1764521732590163386.jpeg")],
  },
  {
    slug: "cape-set-burgundy",
    code: "RS26-01",
    name: "Cape Set Burgundy",
    price: 1500,
    collections: ["ramadan-set", "winter-25"],
    category: "Sets",
    sizes: ["S-M", "L-XL"],
    color: "Burgundy",
    style: "Clean, elegant silhouette",
    description:
      "A two-piece set featuring a flowing cape-style top with a high neckline and matching straight-leg trousers, for an elegant, modest look.",
    modelWears: "S-M",
    images: [
      img("1771986850687782724.jpeg"),
      img("1771988622464544279.jpeg"),
      img("1771988432380216712.jpeg"),
      img("1771986853780041630.jpeg"),
    ],
  },
  {
    slug: "cape-set-black",
    code: "RS26-02",
    name: "Cape Set Black",
    price: 1500,
    collections: ["ramadan-set", "winter-25"],
    category: "Sets",
    sizes: ["S-M", "L-XL"],
    color: "Black",
    style: "Clean, elegant silhouette",
    description:
      "A two-piece set featuring a flowing cape-style top with a high neckline and matching straight-leg trousers, for an elegant, modest look.",
    modelWears: "S-M",
    images: [
      img("1771982699387695926.jpeg"),
      img("1771982699231893648.jpeg"),
      img("1771982699212640005.jpeg"),
      img("1771982699233571042.jpeg"),
    ],
  },
];

export const categories: Category[] = ["Dresses", "Skirts", "Sets", "Outerwear", "Tops", "Bottoms"];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const productsIn = (slug: CollectionSlug) => products.filter((p) => p.collections.includes(slug));
export const priceOf = (p: Product) => p.salePrice ?? p.price;
export const formatEGP = (n: number) => `${n.toLocaleString("en-US")} EGP`;

export const brand = {
  whatsapp: "201035723775",
  phone: "01035723775",
  email: "dollyy825@gmail.com",
  instagram: "https://www.instagram.com/",
};

// Placeholder flat-rate shipping by region; replace with real rates.
export const shippingZones = [
  { name: "Cairo & Giza", fee: 70 },
  { name: "Alexandria", fee: 80 },
  { name: "Delta & Canal", fee: 90 },
  { name: "Upper Egypt", fee: 110 },
  { name: "Red Sea & Sinai", fee: 130 },
];
