'use client';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from './ui/card';

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
            <Card className="flex w-full flex-row space-x-4 p-6 h-full">
              <CardContent className="flex w-1/4 items-center justify-center p-2 align-middle">
                <img
                  src={review.imageUrl}
                  alt={review.name}
                  className="w-full object-cover rounded-full justify-center"
                />
              </CardContent>
              <CardContent className="flex w-3/4 flex-col justify-between p-2">
                <em className="text-sm align-middle">{review.comment}</em>
                <div className="mt-2">
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
