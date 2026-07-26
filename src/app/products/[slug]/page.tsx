'use client';

import { useTranslations } from 'next-intl';
import { useParams, notFound } from 'next/navigation';
import ProductPageLayout from '@/components/shared/ProductPageLayout';
import { getProduct } from '@/components/products/data';

interface Stat {
  value: string;
  label: string;
}

interface Feature {
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] ?? '';
  const product = getProduct(slug);

  const t = useTranslations('pages.products');
  const shared = useTranslations('products');

  if (!product) {
    notFound();
  }

  const stats = shared.raw(`items.${product.key}.stats`) as Stat[];
  const features = t.raw(`items.${product.key}.features`) as Feature[];
  const steps = t.raw(`items.${product.key}.process`) as Step[];

  return (
    <ProductPageLayout
      product={product}
      label={shared(`items.${product.key}.category`)}
      title={t(`items.${product.key}.title`)}
      tagline={shared(`items.${product.key}.tagline`)}
      intro={t(`items.${product.key}.intro`)}
      builtByLabel={shared('builtBy')}
      visitLabel={shared('visitSite', { domain: product.domain })}
      stats={stats}
      featuresLabel={t('featuresLabel')}
      featuresTitle={t(`items.${product.key}.featuresTitle`)}
      features={features}
      processLabel={t('processLabel')}
      processTitle={t(`items.${product.key}.processTitle`)}
      processSteps={steps.map((step, index) => ({
        number: String(index + 1).padStart(2, '0'),
        title: step.title,
        description: step.description,
      }))}
      ctaTitle={t(`items.${product.key}.cta.title`)}
      ctaSubtitle={t(`items.${product.key}.cta.subtitle`)}
      ctaPrimary={shared('visitSite', { domain: product.domain })}
      ctaSecondary={t('talkToUs')}
    />
  );
}
