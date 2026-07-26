export type ProductKey = 'quanty' | 'trenerapp';

export interface ProductMeta {
  key: ProductKey;
  /** Route segment under /products */
  slug: string;
  /** Public product website */
  url: string;
  /** Domain shown next to the external link */
  domain: string;
  visual: 'graph' | 'phone';
  /** Page header gradient, matching the product accent */
  gradient: string;
  /** Tailwind text colour used for accents on the product page */
  accentText: string;
  accentBg: string;
}

export const PRODUCTS: ProductMeta[] = [
  {
    key: 'quanty',
    slug: 'quanty',
    url: 'https://quanty.ai',
    domain: 'quanty.ai',
    visual: 'graph',
    gradient: 'bg-gradient-to-br from-violet-50/60 via-indigo-50/30 to-white',
    accentText: 'text-violet-600',
    accentBg: 'bg-violet-50',
  },
  {
    key: 'trenerapp',
    slug: 'trenerapp',
    url: 'https://trenerapp.pl',
    domain: 'trenerapp.pl',
    visual: 'phone',
    gradient: 'bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
  },
];

export const getProduct = (slug: string): ProductMeta | undefined =>
  PRODUCTS.find((product) => product.slug === slug);
