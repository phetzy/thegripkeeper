import { Carousel } from 'components/carousel';
import CollectionsGrid from '@/components/collections/CollectionsGrid';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <Carousel />
      <CollectionsGrid />
    </>
  );
}
