'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type CartState = {
  error?: string;
  success?: boolean;
};

export async function addItem(prevState: CartState, selectedVariantId: string | undefined): Promise<string | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId || !selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
    return undefined;
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: CartState, merchandiseId: string): Promise<string | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
      return undefined;
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: CartState,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
): Promise<string | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
      revalidateTag(TAGS.cart);
      return undefined;
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
      revalidateTag(TAGS.cart);
      return undefined;
    }
    return undefined;
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  const cartId = (await cookies()).get('cartId')?.value;
  const cart = await getCart(cartId);

  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}
