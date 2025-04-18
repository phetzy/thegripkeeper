import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchShopifyCollectionProducts } from '@/lib/shopify/fetchShopifyCollectionProducts';
import {
  buildNavigationTree,
  fetchShopifyCollectionsWithParents
} from '@/lib/shopify/fetchShopifyCollectionsWithParents';
import { notFound } from 'next/navigation';

// Helper to remove abbreviation prefix from collection titles (e.g., "CGK: GK" -> "GK")
function cleanTitle(title: string): string {
  return title.replace(/^[^:]+: /, '');
}

// Helper to recursively collect all handles from a node and its descendants
function collectHandles(node: any): string[] {
  let handles = [node.handle];
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      handles = handles.concat(collectHandles(child));
    }
  }
  return handles;
}

function findNodeBySlugs(tree: any[], slugs: string[]): any | null {
  let currentLevel = tree;
  let node = null;
  for (const slug of slugs) {
    node = currentLevel.find((n) => n.handle === slug);
    if (!node) return null;
    currentLevel = node.children || [];
  }
  return node;
}

import type { JSX } from 'react';

export default async function ShopDynamicPage({
  params
}: {
  params: { slug?: string[] };
}): Promise<JSX.Element> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  const collections = await fetchShopifyCollectionsWithParents();
  if (!collections || collections.length === 0) {
    return notFound();
  }
  const navigationTree = buildNavigationTree(collections);

  const node = findNodeBySlugs(navigationTree, slug);

  if (!node) {
    return notFound();
  }

  // If node has children, render links to children
  if (node.children && node.children.length > 0) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 md:px-8">
        <h1 className="mb-8 text-3xl font-bold text-center sm:text-left">{cleanTitle(node.title)}</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {node.children.map((child: any) => (
            <Card
              key={child.handle}
              className="border border-zinc-800 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary hover:scale-[1.03] hover:border-primary hover:shadow-xl"
            >
              <a
                href={`/shop/${[...slug, child.handle].join('/')}`}
                className="block focus:outline-none"
                role="link"
                tabIndex={0}
              >
                <AspectRatio ratio={1} className="mb-4 p-4 rounded">
                  {child.image?.url ? (
                    <Image
                      src={child.image.url}
                      alt={child.image.altText || cleanTitle(child.title)}
                      className="w-full rounded object-cover shadow"
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded bg-gray-200 text-gray-400">
                      <span>No image</span>
                    </div>
                  )}
                </AspectRatio>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-left sm:text-center">
                    {cleanTitle(child.title)}
                  </CardTitle>
                </CardHeader>
              </a>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // If node is a leaf or has descendants, fetch and display products from Shopify collection
  if (node.handle) {
    const handles = collectHandles(node);

    // Fetch products for all handles and flatten the array
    const productsArrays = await Promise.all(
      handles.map((h: string) => fetchShopifyCollectionProducts(h))
    );
    const products = productsArrays.flat();
    // Deduplicate products by id
    const uniqueProducts = Array.from(new Map(products.map((p: any) => [p.id, p])).values());

    return (
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:px-8 lg:px-10">
        <h1 className="mb-6 text-3xl font-bold">{cleanTitle(node.title)}</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {uniqueProducts.map((product: any) => (
            <Card
              key={product.id}
              className="border border-zinc-800 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary hover:scale-[1.03] hover:border-primary hover:shadow-xl"
            >
              <a
                href={`/shop/product/${product.handle}`}
                className="block focus:outline-none"
                role="link"
                tabIndex={0}
                aria-label={product.title}
              >
                <AspectRatio ratio={1} className="mb-4 p-4">
                  {product.featuredImage?.url ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.title}
                      className="h-full w-full rounded object-cover shadow"
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded bg-gray-200 text-gray-400">
                      <span>No image</span>
                    </div>
                  )}
                </AspectRatio>
                <CardHeader>
                  <CardTitle className="truncate text-center text-lg font-semibold">
                    {product.title}
                  </CardTitle>
                  <div className="mt-2 font-bold text-primary">
                    ${Number(product.priceRange?.minVariantPrice?.amount).toFixed(2)}
                  </div>
                </CardHeader>
              </a>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return notFound();
}

export const dynamic = 'force-dynamic';
