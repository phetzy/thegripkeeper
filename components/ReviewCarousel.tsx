'use client';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Suspense } from 'react';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

const reviews = [
  {
    name: 'Tim Herron',
    credential: 'USPSA GM And Firearms Instructor',
    comment: 'These are a very interesting product and glad I made the purchase!',
    imageUrl: '/images/reviewAvatars/timHerron.jpg'
  },
  {
    name: 'Bob Vogel',
    credential: 'World IDPA and USPSA Champion',
    comment:
      'A solid product here I would definitely recommend. Never underestimate the importance of a good grip.',
    imageUrl: '/images/reviewAvatars/bobVogel.jpg'
  },
  {
    name: 'Andrew Hyder',
    credential: 'USPSA Open GM',
    comment:
      "I've had the pleasure of using these for about a month, and have noticed some great improvements!",
    imageUrl: '/images/reviewAvatars/andrewHyder.jpeg'
  },
  {
    name: 'Thy Ngo',
    credential: 'Professional Shooter for Team GLOCK',
    comment:
      'The Grip Keeper is great tool I keep at my desk to work my grip throughout the day. I also like to bring it to matches to wake my hands up before I start shooting. I’ve seen improvement in faster follow up shots and would recommend this product to everyone!',
    imageUrl: '/images/reviewAvatars/thyNgo.png'
  }
];

export default function ReviewCarousel() {
  return (
    <Carousel
      className="w-full p-4"
      opts={{
        loop: true
      }}
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          stopOnMouseEnter: false
        })
      ]}
    >
      <CarouselContent>
        {reviews.map((review, index) => (
          <CarouselItem key={index} className="w-full">
            <Card className="mx-auto flex w-full max-w-xl flex-col items-center space-y-4 rounded-xl bg-zinc-900 p-6 shadow-lg md:flex-row md:space-x-6 md:space-y-0">
              <CardContent className="flex flex-shrink-0 items-center justify-center p-0">
                <Suspense fallback={<Skeleton className="h-32 w-32 rounded-full object-cover" />}>
                  <Image
                    src={review.imageUrl}
                    alt={review.name}
                    className="h-32 w-32 rounded-full border-2 border-zinc-800 object-cover shadow"
                    width={128}
                    height={128}
                  />
                </Suspense>
              </CardContent>
              <CardContent className="flex flex-1 flex-col items-center justify-center p-0 text-center md:items-start md:text-left">
                <em className="text-sm">{review.comment}</em>
                <div className="mt-3">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.credential}</p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
