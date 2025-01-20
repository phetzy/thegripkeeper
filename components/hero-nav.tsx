'use client';

import { useState } from 'react';
import { CartProvider } from './cart/cart-context';
import CartModal from './cart/modal';

function HoverWrapper({ children }: { children: React.ReactNode }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    return (
        <div 
            className={`sticky top-0 z-50 flex w-full flex-row justify-end p-2 ${isMenuVisible ? 'opacity-100 transition-opacity duration-300 ease-in-out' : 'opacity-0 transition-opacity duration-300 ease-in-out'}`}
            onMouseOver={() => setIsMenuVisible(true)}
            onMouseOut={() => setIsMenuVisible(false)}
        >
            {children}
        </div>
    );
}

export default function HeroNav() {
    return (
        <HoverWrapper>
            <div className="flex w-fit flex-row justify-end rounded-md bg-white">
                <CartProvider cartPromise={Promise.resolve(undefined)}>
                    <CartModal />
                </CartProvider>
            </div>
        </HoverWrapper>
    );
}
