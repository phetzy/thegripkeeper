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

const GET_COLLECTIONS_WITH_PARENTS = `
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

export async function fetchShopifyCollectionsWithParents(): Promise<ShopifyCollection[]> {
  try {
    const variables = { first: 100 };
    const res = await shopifyFetch<any>({ query: GET_COLLECTIONS_WITH_PARENTS, variables });
    const data = res.body.data;
    const collections: ShopifyCollection[] =
      data?.collections?.edges?.map(({ node }: { node: any }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        parent: node.metafield?.value || null,
        image: node.image || null
      })) || [];
    return collections;
  } catch (e) {
    // Fail gracefully if Shopify API call fails
    return [];
  }
}


// Build a navigation tree from the flat collection list
export type NavigationNode = ShopifyCollection & { children: NavigationNode[] };

export function buildNavigationTree(collections: ShopifyCollection[]): NavigationNode[] {
  const handleToNode: Record<string, NavigationNode> = {};
  const roots: NavigationNode[] = [];

  // First, create all nodes
  for (const col of collections) {
    handleToNode[col.handle] = { ...col, children: [] };
  }

  // Then, assign children to parents
  for (const col of collections) {
    if (
      col.parent &&
      handleToNode[col.parent] !== undefined &&
      handleToNode[col.handle] !== undefined
    ) {
      handleToNode[col.parent]!.children.push(handleToNode[col.handle]!);
    } else if (handleToNode[col.handle]) {
      roots.push(handleToNode[col.handle]!);
    }
  }

  return roots;
}
