'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NavigationHandler() {
  const router = useRouter();

  return (
    <Button
      variant={'default'}
      onClick={() => router.push('/shop')}
      onMouseOver={() => router.prefetch('/shop')}
    >
      Shop Now
    </Button>
  );
}
