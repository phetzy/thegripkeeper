'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useMemo, useOptimistic, startTransition } from 'react';

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialState = () => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update
    })
  );

  const updateOption = useCallback((name: string, value: string) => {
    const newState = { [name]: value };
    
    // Update URL with new parameters
    const params = new URLSearchParams(window.location.search);
    params.set(name, value);
    
    // Update optimistic state
    startTransition(() => {
      setOptimisticState(newState);
      // Update URL
      router.push(`?${params.toString()}`, { scroll: false });
    });
    
    return { ...state, ...newState };
  }, [state, setOptimisticState, router]);

  const updateImage = useCallback((index: string) => {
    const newState = { image: index };
    startTransition(() => {
      setOptimisticState(newState);
    });
    return { ...state, ...newState };
  }, [state, setOptimisticState]);

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage
    }),
    [state, updateOption, updateImage]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
