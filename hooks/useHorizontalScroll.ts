import { useRef, useEffect } from 'react';

export function useHorizontalScroll() {
  const elRef = useRef<HTMLUListElement | null>(null);
  
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    
    // For mouse wheel scrolling
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      
      // Prevent vertical scrolling
      e.preventDefault();
      
      // Scroll horizontally instead
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: 'smooth'
      });
    };
    
    // Add event listener
    el.addEventListener('wheel', onWheel, { passive: false });
    
    // Cleanup
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);
  
  return elRef;
}
