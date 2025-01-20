'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { CartActionResult, removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useActionState, useTransition } from 'react';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, updateType: 'delete') => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<CartActionResult | null, typeof removeItem>(
    removeItem,
    null
  );
  const merchandiseId = item.merchandise.id;

  return (
    <form
      action={() =>
        startTransition(async () => {
          optimisticUpdate(merchandiseId, 'delete');
          await formAction(merchandiseId);
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
