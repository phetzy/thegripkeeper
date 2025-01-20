'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
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
  const actionWithVariant = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId)!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        await actionWithVariant();
      }}
    >
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
