'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState, useState, startTransition } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  onClick,
  loading
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  loading: boolean;
}) {
  if (!availableForSale) {
    return (
      <Button disabled variant="secondary" className="w-full rounded-full">
        Out Of Stock
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button disabled variant="secondary" className="w-full rounded-full">
        <PlusIcon className="h-5 w-5 rounded-md" />
        Select an Option
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      className="w-full rounded-full"
      onClick={onClick}
      disabled={loading}
    >
      <PlusIcon className="mr-2 h-5 w-5" />
      {loading ? 'Adding...' : 'Add To Cart'}
    </Button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);
  const [loading, setLoading] = useState(false);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId)!;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      startTransition(async () => {
        // First trigger the server action
        await actionWithVariant();
        // Then update the local cart state
        addCartItem(finalVariant, product);
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        loading={loading}
        onClick={handleAddToCart}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
