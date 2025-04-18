"use client";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Logo from '../../../public/images/logo.png';

import { Button } from '@/components/ui/button';
import Confetti from './Confetti';

export default function CartThankYou() {
  const router = useRouter();

  useEffect(() => {
    // Remove cartId cookie (clears cart for next session)
    document.cookie = "cartId=; Max-Age=0; path=/;";
    // If you store cart state in localStorage or elsewhere, clear it here as well
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-24 relative overflow-hidden">
      <Confetti />
      <div className="flex justify-center mb-8">
        <Image
          src={Logo}
          alt="GripKeeper Logo"
          width={600}
          height={600}
                className="object-center"
                priority
                quality={100}
                loading="eager"
                fetchPriority="high"
              />
            </div>
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-neutral-500 mb-8">You can close this page or continue shopping.</p>
      <Button
        onClick={() => router.push("/")}
      >
        Return to Store
      </Button>
    </main>
  );
}
