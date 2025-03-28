'use client';

import Link from 'next/link';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import { GridTileImage } from 'components/grid/tile';

interface RelatedProductsProps {
  products: any[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useHorizontalScroll();
  
  return (
    <ul 
      ref={scrollRef} 
      className="flex w-full gap-4 overflow-x-auto pt-1 pb-4"
    >
      {products.map((product) => (
        <li
          key={product.handle}
          className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
        >
          <Link 
            className="relative h-full w-full" 
            href={`/shop/product/${product.handle}`}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
