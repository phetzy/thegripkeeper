import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          metafields(
            identifiers: [
              { namespace: "custom", key: "resistance" },
              { namespace: "custom", key: "trigger_type" },
              { namespace: "custom", key: "available_resistances" },
              { namespace: "custom", key: "available_trigger_types" }
            ]
          ) {
            id
            namespace
            key
            value
          }
        }
      }
    }
    metafields(
      identifiers: [
        { namespace: "custom", key: "resistance" },
        { namespace: "custom", key: "trigger_type" },
        { namespace: "custom", key: "available_resistances" },
        { namespace: "custom", key: "available_trigger_types" }
      ]
    ) {
      id
      namespace
      key
      value
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
