'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { CartActionResult, updateItemQuantity } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useState, useTransition } from 'react';

// Create a wrapper function that matches the expected type
const updateItemQuantityAction = async (
  prevState: CartActionResult | null,
  payload: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }
) => {
  return updateItemQuantity(prevState, payload);
};

function SubmitButton({ type, pending }: { type: 'plus' | 'minus'; pending: boolean }) {
  return (
    <button
      type="submit"
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      disabled={pending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60',
        {
          'ml-auto': type === 'minus'
        }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: (merchandiseId: string, updateType: 'plus' | 'minus') => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<CartActionResult | null>(null);

  const merchandiseId = item.merchandise.id;
  const quantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
  
  // Make sure to include the existing attributes when updating quantity
  const payload = { 
    merchandiseId, 
    quantity,
    attributes: item.attributes && item.attributes.length > 0 ? [...item.attributes] : undefined
  };

  return (
    <form
      action={() =>
        startTransition(async () => {
          optimisticUpdate(merchandiseId, type);
          console.log('Updating cart item with payload:', JSON.stringify(payload, null, 2));
          const result = await updateItemQuantityAction(state, payload);
          setState(result);
        })
      }
    >
      <SubmitButton type={type} pending={isPending} />
      {state?.status === 'error' && (
        <p aria-live="polite" className="sr-only" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
