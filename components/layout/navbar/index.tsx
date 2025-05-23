import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import CartModal from 'components/cart/modal';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Logo from '../../../public/images/logo.png';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <Image src={Logo} alt={SITE_NAME!} width={200} height={200} />
            </Link>

            {menu.length ? (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  {menu.map((item: Menu) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link href={item.path}>
                          {item.title === 'Home' ? (
                            <Image src={Logo} alt={item.title} width={32} height={32} />
                          ) : (
                            item.title
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            ) : null}
          </div>

          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>

          <div className="flex justify-end md:w-1/3">
            <Suspense fallback={null}>
              <CartModal />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
