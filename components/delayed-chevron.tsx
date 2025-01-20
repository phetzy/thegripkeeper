'use client';

import { ChevronsDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DelayedChevron() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed bottom-8 left-0 right-0 -z-10 transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <ChevronsDown className="mx-auto w-8 h-8 animate-bounce text-white" />
    </div>
  );
}
