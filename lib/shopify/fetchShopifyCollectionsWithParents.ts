import { shopifyFetch } from '@/lib/shopify';

// Fetch all collections and their parent metafield
type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  parent?: string | null;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
};

type ShopifyCollectionsResponse = {
  data: {
    collections: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          metafield?: { value: string | null } | null;
          image?: {
            url: string;
            altText?: string | null;
          } | null;
        };
      }>;
    };
  };
};

export async function fetchAllCollectionsWithParents(): Promise<ShopifyCollection[]> {
  const query: string = `
    query GetCollectionsWithParents($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
            }
            metafield(namespace: "navigation", key: "parent") {
              value
            }
          }
        }
      }
    }
  `;
  const variables = { first: 100 };
  const res = await shopifyFetch<ShopifyCollectionsResponse>({ query, variables });
  const data = res.body.data;
  const collections: ShopifyCollection[] =
    data?.collections?.edges?.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      parent: node.metafield?.value || null,
      image: node.image || null
    })) || [];
  return collections;
}

// Build a navigation tree from the flat collection list
export function buildNavigationTree(collections: ShopifyCollection[]) {
  const handleToNode: Record<string, any> = {};
  const roots: any[] = [];

  // First, create all nodes
  for (const col of collections) {
    handleToNode[col.handle] = { ...col, children: [] };
  }

  // Then, assign children to parents
  for (const col of collections) {
    if (col.parent && handleToNode[col.parent]) {
      handleToNode[col.parent].children.push(handleToNode[col.handle]);
    } else {
      roots.push(handleToNode[col.handle]);
    }
  }

  return roots;
}
