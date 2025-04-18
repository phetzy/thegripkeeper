'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { CartActionResult, removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useState, useTransition } from 'react';

// Create a wrapper function that matches the expected type
const removeItemAction = async (
  prevState: CartActionResult | null,
  merchandiseId: string
) => {
  return removeItem(prevState, merchandiseId);
};

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, updateType: 'delete') => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<CartActionResult | null>(null);
  const merchandiseId = item.merchandise.id;

  return (
    <form
      action={() =>
        startTransition(async () => {
          optimisticUpdate(merchandiseId, 'delete');
          const result = await removeItemAction(state, merchandiseId);
          setState(result);
        })
      }
    >
      <button
        aria-label="Remove cart item"
        disabled={isPending}
        className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      {state?.status === 'error' && (
        <p aria-live="polite" className="sr-only" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
