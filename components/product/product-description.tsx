'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, ProductVariant } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';
import { useProduct } from './product-context';
import { useMemo } from 'react';

export function ProductDescription({ product }: { product: Product }) {
  const { state } = useProduct();
  
  // Get the currently selected variant based on the selected options or use the default minimal price
  const selectedVariant = useMemo(() => {
    // Start with minimal filter criteria (only exact option matches)
    const selectedOptions = Object.entries(state).filter(
      ([key]) => key !== 'image' && product.options.some(option => option.name.toLowerCase() === key)
    );
    
    // If no options are selected, return null (will show starting price)
    if (selectedOptions.length === 0) {
      return null;
    }
    
    // Try to find a variant that matches all selected options
    return product.variants.find(variant => 
      selectedOptions.every(([name, value]) => {
        const optionMatch = variant.selectedOptions.find(
          option => option.name.toLowerCase() === name
        );
        return optionMatch && optionMatch.value === value;
      })
    );
  }, [state, product]);
  
  // Determine which price to show
  const priceToShow = selectedVariant 
    ? { 
        amount: selectedVariant.price.amount, 
        currencyCode: selectedVariant.price.currencyCode 
      }
    : { 
        amount: product.priceRange.minVariantPrice.amount, 
        currencyCode: product.priceRange.minVariantPrice.currencyCode 
      };

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-primary p-2 text-sm text-primary-foreground">
          <Price
            amount={priceToShow.amount}
            currencyCode={priceToShow.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
