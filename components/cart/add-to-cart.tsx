'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant, Metafield } from 'lib/shopify/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isResistanceSelected,
  isTriggerTypeSelected
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isResistanceSelected: boolean;
  isTriggerTypeSelected: boolean;
}) {
  if (!availableForSale) {
    return (
      <Button 
        disabled 
        variant="secondary" 
        className="w-full"
      >
        Out Of Stock
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button
        aria-label="Please select an option"
        disabled
        variant="secondary"
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Select Options
      </Button>
    );
  }
  
  if (!isResistanceSelected) {
    return (
      <Button
        aria-label="Please select resistance level"
        disabled
        variant="secondary"
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Select Resistance Level
      </Button>
    );
  }
  
  if (!isTriggerTypeSelected) {
    return (
      <Button
        aria-label="Please select trigger type"
        disabled
        variant="secondary"
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Select Trigger Type
      </Button>
    );
  }

  return (
    <Button
      aria-label="Add to cart"
      className="w-full"
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Add To Cart
    </Button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  
  // Find the final variant but don't use non-null assertion to avoid runtime errors
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId);
  
  // Helper function to get metafield value, first checking variant then product
  const getMetafieldValue = (key: string): string | undefined => {
    let value: string | undefined;
    
    // First check variant metafields
    if (finalVariant?.metafields) {
      const variantMetafield = finalVariant.metafields.find(m => m && m.key === key);
      if (variantMetafield?.value) {
        console.log(`Found ${key} in variant metafields:`, variantMetafield.value);
        value = variantMetafield.value;
      }
    }
    
    // If not found in variant, check product metafields
    if (!value && product.metafields) {
      const productMetafield = product.metafields.find(m => m && m.key === key);
      if (productMetafield?.value) {
        console.log(`Found ${key} in product metafields:`, productMetafield.value);
        value = productMetafield.value;
      }
    }
    
    return value;
  };
  
  // Extract metafields if they exist (for displaying to the user)
  const variantMetafields = finalVariant?.metafields || [];
  const productMetafields = product.metafields || [];
  
  // Try to get resistance and trigger type from state (user selections) first, then metafields
  const resistanceMetafieldValue = getMetafieldValue('resistance');
  const triggerTypeMetafieldValue = getMetafieldValue('trigger_type');
  
  // Get resistance and trigger type from the state (user selections) or metafields
  const selectedResistance = state.resistance || resistanceMetafieldValue || '';
  const selectedTriggerType = state.triggerType || triggerTypeMetafieldValue || '';
  
  // Create custom attributes (still needed for cart display until we fully migrate to metafields)
  const customAttributes: { key: string; value: string }[] = [];

  // Always attempt to push resistance and trigger type, even if empty
  if (selectedResistance) {
    customAttributes.push({ key: 'resistance', value: selectedResistance });
    console.log('Adding resistance attribute:', selectedResistance);
  } else {
    console.warn('No resistance selected or found in metafields.');
  }
  if (selectedTriggerType) {
    customAttributes.push({ key: 'trigger_type', value: selectedTriggerType });
    console.log('Adding trigger_type attribute:', selectedTriggerType);
  } else {
    console.warn('No trigger type selected or found in metafields.');
  }
  // Log the customAttributes array
  console.log('Final customAttributes array before addItem:', JSON.stringify(customAttributes, null, 2));

  // Log available metafields for debugging
  console.log('Product metafields:', productMetafields);
  console.log('Product variant metafields:', variantMetafields);
  console.log('Selected variant ID:', selectedVariantId);
  console.log('Final variant found:', finalVariant ? 'Yes' : 'No');
  console.log('Selected resistance (from state or metafields):', selectedResistance);
  console.log('Selected trigger type (from state or metafields):', selectedTriggerType);

  const isResistanceSelected = !!selectedResistance;
  const isTriggerTypeSelected = !!selectedTriggerType;

  return (
    <form
      action={async () => {
        // Check if we have a final variant before proceeding
        if (!finalVariant) {
          console.error("Cannot add to cart: No valid variant selected");
          return;
        }
        // Log the customAttributes array
        if (customAttributes.length === 0) {
          console.warn('customAttributes is empty! Resistance/TriggerType may not be set.');
        } else {
          console.log('Adding to cart with custom attributes:', JSON.stringify(customAttributes, null, 2));
        }
        // First add to local cart context
        addCartItem(finalVariant, product, customAttributes.length > 0 ? customAttributes : undefined);
        // Call the server action with the custom attributes - make a local copy to avoid reference issues
        const attributesToSend = customAttributes.length > 0 
          ? customAttributes.map(attr => ({ ...attr })) 
          : undefined;
        console.log('Sending attributes to server action:', JSON.stringify(attributesToSend, null, 2));
        // Don't use the bound function - pass parameters directly to avoid any binding issues
        await formAction({ selectedVariantId, customAttributes: attributesToSend });
      }}
    >
      <SubmitButton 
        availableForSale={availableForSale} 
        selectedVariantId={selectedVariantId}
        isResistanceSelected={isResistanceSelected}
        isTriggerTypeSelected={isTriggerTypeSelected}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message?.message}
      </p>
    </form>
  );
}
