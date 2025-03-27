import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.handle);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { handle: string };
  searchParams?: { [key: string]: string };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  
  // If you don't have these Shopify functions yet, you can create placeholder products
  const products = await getCollectionProducts({
    collection: params.handle,
    sortKey,
    reverse
  });
  
  // Fallback to placeholder items if no products are found
  const placeholderProducts = products?.length > 0 ? products : [
    {
      id: 'placeholder-1',
      handle: 'placeholder-product',
      title: 'Example Product',
      description: 'This is a placeholder product',
      featuredImage: {
        url: ''
      },
      priceRange: {
        maxVariantPrice: {
          amount: '29.99',
          currencyCode: 'USD'
        }
      }
    }
  ];

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">No products found in this collection</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={placeholderProducts} />
        </Grid>
      )}
    </section>
  );
}
