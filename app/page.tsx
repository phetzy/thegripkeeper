import ReviewCarousel from '@/components/ReviewCarousel';
import { Separator } from '@/components/ui/separator';
import { ensureStartsWith } from 'lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import DelayedChevron from '../components/delayed-chevron';
import NavigationHandler from '../components/navigation-handler';
import Hero from '../public/images/hero.png';
import Logo from '../public/images/logo.png';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default function HomePage() {

  return (
    <main className="relative flex flex-col items-center">
      <Suspense>
        <div className="fixed inset-0 -z-20">
          <div className="relative h-screen w-screen">
            <Image
              src={Hero}
              alt="GripKeeper Hero Image"
              fill
              className="object-cover [object-position:-300px_center] md:object-center"
              priority
              quality={100}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <div className="flex h-full flex-col items-center justify-center">
            {/* Title */}
            <div className="flex justify-center">
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
          </div>
        </div>

        <div className="w-full bg-background">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full items-center justify-center bg-background md:w-[60%] lg:w-[50%]">
              <h3 className="text-xl mt-16 mb-5 text-center font-semibold tracking-normal lg:text-3xl">
                What is the Grip Keeper?
              </h3>
              <p className="md:text-lg mx-6 mt-2 text-wrap text-center text-sm">
                This product was developed after understanding that grip is one of the most
                important things in regards to shooting a pistol faster with more control.
              </p>
              <Separator className="my-4 w-8 mx-auto" />
              <p className="md:text-lg mx-6 mt-2 text-wrap text-center text-sm">
                I tried using standard grip trainers off Amazon, 50, 100lb, etc, and those were
                great at strengthening your grip, but I found myself wanting to combine the grip of
                a pistol and the grip strengthener together.
              </p>
              <Separator className="my-4 w-8 mx-auto" />
              <p className="md:text-lg mx-6 mt-2 text-wrap text-center text-sm">
                You will be able to strengthen your grip on your pistols exact grip. A grip
                strengthener that matches your pistol will lead to improved recoil control, and
                stronger fundamentals since you will be able to train with it anywhere you wish.
              </p>
              <Separator className="my-4 w-8 mx-auto" />
              <p className="md:text-lg mx-6 mt-2 text-wrap text-center text-sm">
                The Grip Keeper is a diverse tool any gun lover can use. Competition shooters can use
                this for warming up your grip before a stage. Police officers can use it in their
                cars while waiting for a call. The general user can use it to strengthen their grip
                for the pistol incase a defensive situation arises.
              </p>
              <Separator className='my-8' />
              <h3 className="text-lg mt-8 mb-5 mx-8 text-center font-semibold tracking-normal lg:text-2xl">
                Get a Grip Keeper that matches
                your pistol and feel more confident with your every day gun.
              </h3>
              <Separator className='my-8' />
              <ReviewCarousel />
              <Separator className='my-8' />
              <NavigationHandler />
            </div>
          </div>
        </div>
        </Suspense>
        <DelayedChevron />
    </main>
  );
}
