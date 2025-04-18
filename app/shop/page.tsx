import { Carousel } from 'components/carousel';
import CollectionsGrid from '@/components/collections/CollectionsGrid';
import { fetchAllCollectionsWithParents } from '@/lib/shopify/fetchShopifyCollectionsWithParents';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const allCollections = await fetchAllCollectionsWithParents();
  const topLevel = allCollections.filter((col) => !col.parent);
  return (
    <>
      <Carousel />
      <CollectionsGrid collections={topLevel} />
    </>
  );
}
