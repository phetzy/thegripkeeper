import Link from 'next/link';

import FooterMenu from 'components/layout/footer-menu';
import { getMenu } from 'lib/shopify';
import Image from 'next/image';
import { Suspense } from 'react';
import Logo from '../../public/images/logo.png';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="text-sm text-muted-foreground bg-background">
      <div className="flex w-full flex-col gap-6 border-t border-border px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div className="mx-8">
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <Image src={Logo} alt={SITE_NAME!} width={125} height={125} />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="md:ml-auto">
        </div>
      </div>
      <div className="border-t border-border py-6 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-row items-center gap-1 px-4 md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p className="md:ml-auto flex flex-col gap-1">
            <a href="https://charliecoks.com/about" className="text-black dark:text-white">
              Created by CLC Media Group LLC
            </a>
            <a href="https://vercel.com" className="text-black dark:text-white">
              Powered by ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
