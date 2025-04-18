'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';
import { useProduct } from './product-context';
import { useMemo } from 'react';

export function ProductDescription({ product }: { product: Product }) {
  const { state, updateOption } = useProduct();
  
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

  // Function to fetch available options from metafields
  const getMetafieldOptions = (
    metafieldKey: string,
    availableOptionsKey: string,
    defaultOptions: string[]
  ): string[] => {
    console.log(`Checking for ${availableOptionsKey} metafield`);
    
    // First check the product-level metafields for the available options list
    try {
      if (product.metafields) {
        // Look for the available options metafield (e.g., available_resistances)
        const optionsMetafield = product.metafields.find(m => m && m.key === availableOptionsKey);
        if (optionsMetafield && optionsMetafield.value) {
          try {
            // Try to parse as JSON array
            const parsedOptions = JSON.parse(optionsMetafield.value);
            if (Array.isArray(parsedOptions)) {
              console.log(`Found ${availableOptionsKey} metafield with options:`, parsedOptions);
              return parsedOptions;
            }
          } catch (e) {
            // If not a valid JSON array, check if it's a comma-separated list
            if (typeof optionsMetafield.value === 'string' && optionsMetafield.value.includes(',')) {
              const options = optionsMetafield.value.split(',').map(opt => opt.trim());
              console.log(`Found ${availableOptionsKey} as comma-separated list:`, options);
              return options;
            }
            // Otherwise, just return the value as a single-item array
            console.log(`Found ${availableOptionsKey} as single value:`, [optionsMetafield.value]);
            return [optionsMetafield.value];
          }
        }
      }
    } catch (e) {
      console.warn(`Error processing product metafield ${availableOptionsKey}:`, e);
    }
    
    // If we don't find an available_options metafield, collect preset values from the validation limits
    try {
      // For single line text metafields with preset values, we need to check each variant
      // and collect the available preset choices
      const uniqueValues = new Set<string>();
      
      // First check if product has the metafield with preset choices
      if (product.metafields) {
        const metafield = product.metafields.find(m => m && m.key === metafieldKey);
        if (metafield && metafield.value) {
          uniqueValues.add(metafield.value);
        }
      }
      
      // Then check all variants for their preset choices
      product.variants.forEach(variant => {
        if (variant.metafields) {
          const variantMetafield = variant.metafields.find(m => m && m.key === metafieldKey);
          if (variantMetafield && variantMetafield.value) {
            uniqueValues.add(variantMetafield.value);
          }
        }
      });
      
      // If we found any values, return them as an array
      if (uniqueValues.size > 0) {
        const values = Array.from(uniqueValues);
        console.log(`Collected unique ${metafieldKey} values from variants:`, values);
        return values;
      }
    } catch (e) {
      console.warn(`Error collecting variant metafields ${metafieldKey}:`, e);
    }
    
    // Fall back to default options if nothing found
    console.log(`Using default options for ${metafieldKey}:`, defaultOptions);
    return defaultOptions;
  };
  
  // Get available resistance options
  const defaultResistanceOptions = ['Feather (20lbs)', 'Light (40lbs)', 'Medium (60lbs)', 'Heavy (100lbs)', 'Gorilla (150lbs)'];
  const resistanceOptions = getMetafieldOptions('resistance', 'available_resistances', defaultResistanceOptions);
  
  // Get available trigger type options
  const defaultTriggerOptions = ['Flat', 'Curved'];
  const triggerTypeOptions = getMetafieldOptions('trigger_type', 'available_trigger_types', defaultTriggerOptions);
  
  // Debug logging for metafields
  console.log('Product metafields:', product.metafields || []);
  console.log('Selected variant:', selectedVariant?.id);
  console.log('Selected variant metafields:', selectedVariant?.metafields || []);
  console.log('Available resistance options:', resistanceOptions);
  console.log('Available trigger type options:', triggerTypeOptions);

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

      {/* Resistance Level Selector - Now using metafield-derived options */}
      {resistanceOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 text-sm uppercase tracking-wide">Resistance</h3>
          <div className="flex flex-wrap gap-3">
            {resistanceOptions.map((resistance) => (
              <button
                key={resistance}
                onClick={() => updateOption('resistance', resistance)}
                className={`flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 ${
                  state.resistance === resistance ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-primary'
                }`}
              >
                {resistance}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trigger Type Selector - Now using metafield-derived options */}
      {triggerTypeOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 text-sm uppercase tracking-wide">Trigger Type</h3>
          <div className="flex flex-wrap gap-3">
            {triggerTypeOptions.map((triggerType) => (
              <button
                key={triggerType}
                onClick={() => updateOption('triggerType', triggerType)}
                className={`flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 ${
                  state.triggerType === triggerType ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-primary'
                }`}
              >
                {triggerType}
              </button>
            ))}
          </div>
        </div>
      )}

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
