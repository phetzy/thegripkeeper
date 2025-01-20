'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type CartActionResult = {
  status: 'success' | 'error';
  message: string;
};

export async function addItem(
  prevState: CartActionResult | null,
  selectedVariantId: string | undefined
): Promise<CartActionResult> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId || !selectedVariantId) {
    return {
      status: 'error',
      message: 'Error adding item to cart'
    };
  }

  try {
    await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
    return {
      status: 'success',
      message: 'Item added to cart'
    };
  } catch (e) {
    return {
      status: 'error',
      message: 'Error adding item to cart'
    };
  }
}

export async function removeItem(
  prevState: CartActionResult | null,
  merchandiseId: string
): Promise<CartActionResult> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return {
      status: 'error',
      message: 'Missing cart ID'
    };
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return {
        status: 'error',
        message: 'Error fetching cart'
      };
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
      return {
        status: 'success',
        message: 'Item removed from cart'
      };
    } else {
      return {
        status: 'error',
        message: 'Item not found in cart'
      };
    }
  } catch (e) {
    return {
      status: 'error',
      message: 'Error removing item from cart'
    };
  }
}

export async function updateItemQuantity(
  prevState: CartActionResult | null,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
): Promise<CartActionResult> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return {
      status: 'error',
      message: 'Missing cart ID'
    };
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return {
        status: 'error',
        message: 'Error fetching cart'
      };
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
      return {
        status: 'success',
        message: 'Cart updated'
      };
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
      revalidateTag(TAGS.cart);
      return {
        status: 'success',
        message: 'Item added to cart'
      };
    }

    return {
      status: 'error',
      message: 'Error updating cart'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'Error updating item quantity'
    };
  }
}

export async function redirectToCheckout(_prevState: CartActionResult | null): Promise<CartActionResult> {
  const cartId = (await cookies()).get('cartId')?.value;
  const cart = await getCart(cartId);

  if (!cart || !cartId) {
    return {
      status: 'error',
      message: 'Error finding cart'
    };
  }

  redirect(cart.checkoutUrl);
  return {
    status: 'success',
    message: 'Redirecting to checkout'
  };
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  const cartId = cart.id;
  cookies().set('cartId', cartId);
}
