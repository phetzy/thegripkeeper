'use client';

import { ArrowRight, GripVertical, Hammer, Zap } from 'lucide-react';
import Link from 'next/link';

// Define the collection data with icons instead of images
const collections = [
  {
    id: 'pistol-grip-trainers',
    title: 'Pistol Grip Trainers',
    description: 'Strengthen your grip with our specialized trainers designed for various pistol models',
    icon: GripVertical,
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
    href: '/shop/collection/pistol-grip-trainers'
  },
  {
    id: 'training-pistols',
    title: 'Training Pistols',
    description: 'Solid training pistols for safe practice and skill development',
    icon: Hammer,
    color: 'bg-green-50',
    iconColor: 'text-green-500',
    href: '/shop/collection/training-pistols'
  },
  {
    id: 'laser-training-pistols',
    title: 'Laser Training Pistols',
    description: 'Advanced laser training tools for precise aim and trigger control practice',
    icon: Zap,
    color: 'bg-red-50',
    iconColor: 'text-red-500',
    href: '/shop/collection/laser-training-pistols'
  }
];

export default function CollectionsGrid() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop Collections</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse our specialized collections of training equipment
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {collections.map((collection) => {
          const Icon = collection.icon;
          return (
            <Link
              key={collection.id}
              href={collection.href}
              className="group overflow-hidden rounded-lg border bg-background shadow-md transition-all hover:shadow-lg"
            >
              <div className={`relative flex h-64 w-full items-center justify-center ${collection.color}`}>
                <Icon className={`h-24 w-24 ${collection.iconColor}`} />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold tracking-tight">{collection.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
                
                <div className="mt-4 flex items-center">
                  <span className={`font-medium ${collection.iconColor}`}>View Collection</span>
                  <ArrowRight className={`ml-2 h-4 w-4 ${collection.iconColor} transition-transform group-hover:translate-x-1`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
