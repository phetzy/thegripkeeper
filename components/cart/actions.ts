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
  payload: { selectedVariantId: string | undefined; customAttributes?: { key: string; value: string }[] }
): Promise<CartActionResult> {
  const { selectedVariantId, customAttributes } = payload;
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId || !selectedVariantId) {
    return {
      status: 'error',
      message: 'Error adding item to cart'
    };
  }

  try {
    console.log('addItem server action received customAttributes:', JSON.stringify(customAttributes, null, 2));
    
    // Ensure we have a valid array of attributes to pass
    // Ensure Shopify-safe keys (lowercase, underscores)
    const attributes = customAttributes && customAttributes.length > 0 
      ? customAttributes.map(attr => {
          const safeKey = attr.key.toLowerCase().replace(/\s+/g, '_');
          return { key: safeKey, value: attr.value };
        })
      : [];
    console.log('Final attributes being sent to Shopify:', JSON.stringify(attributes, null, 2));
    
    // Create the lines array with explicit attributes
    if (!attributes || attributes.length === 0) {
      console.warn('No custom attributes being sent to Shopify. These options will NOT show in checkout.');
    } else {
      console.log('Custom attributes being sent to Shopify:', JSON.stringify(attributes, null, 2));
    }
    const lines = [{
      merchandiseId: selectedVariantId,
      quantity: 1,
      attributes: attributes
    }];
    
    console.log('Final payload lines:', JSON.stringify(lines, null, 2));
    
    await addToCart(cartId, lines);
    revalidateTag(TAGS.cart);
    return {
      status: 'success',
      message: 'Item added to cart'
    };
  } catch (e) {
    console.error('Error adding item to cart:', e);
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
    attributes?: { key: string; value: string }[];
  }
): Promise<CartActionResult> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return {
      status: 'error',
      message: 'Missing cart ID'
    };
  }

  const { merchandiseId, quantity, attributes } = payload;

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
      console.log('Updating cart with attributes:', attributes || lineItem.attributes);
      
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
            attributes: attributes || lineItem.attributes
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
      await addToCart(cartId, [{ 
        merchandiseId, 
        quantity,
        attributes 
      }]);
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
  const cartId = cart?.id;
  
  if (!cartId) {
    throw new Error('Failed to create cart: no cart ID returned');
  }
  
  const cookieStore = await cookies();
  cookieStore.set('cartId', cartId, { path: '/' });
}

export async function handleCheckoutAction(_formData: FormData): Promise<void> {
  await redirectToCheckout(null);
}
