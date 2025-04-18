import { shopifyFetch } from '@/lib/shopify';

// Fetch products from a Shopify collection by handle
export async function fetchShopifyCollectionProducts(collectionHandle) {
  const query = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        products(first: 50) {
          edges {
            node {
              id
              title
              featuredImage {
                url
              }
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { handle: collectionHandle };
  const res = await shopifyFetch({ query, variables });

  const products =
    res?.body?.data?.collectionByHandle?.products?.edges?.map((edge) => edge.node) || [];
  return products;
}
