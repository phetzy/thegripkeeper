'use client';

import { ArrowRight, Dumbbell, Hammer, Zap } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  'pistol-grip-trainers': Dumbbell,
  'training-pistols': Hammer,
  'laser-training-pistols': Zap
} as const;
const colorMap = {
  'pistol-grip-trainers': 'bg-blue-50',
  'training-pistols': 'bg-green-50',
  'laser-training-pistols': 'bg-red-50'
} as const;
const iconColorMap = {
  'pistol-grip-trainers': 'text-blue-500',
  'training-pistols': 'text-green-500',
  'laser-training-pistols': 'text-red-500'
} as const;

type CollectionHandle = keyof typeof iconMap;

function getIcon(handle: string) {
  return iconMap[handle as CollectionHandle] || Dumbbell;
}
function getColor(handle: string) {
  return colorMap[handle as CollectionHandle] || 'bg-gray-100';
}
function getIconColor(handle: string) {
  return iconColorMap[handle as CollectionHandle] || 'text-gray-500';
}

interface CollectionsGridProps {
  collections: Array<{ id: string; handle: string; title: string }>;
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
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
          const handle = collection.handle;
          const Icon = getIcon(handle);
          const color = getColor(handle);
          const iconColor = getIconColor(handle);
          return (
            <Link
              key={collection.id}
              href={`/shop/${handle}`}
              className="group block rounded-xl border border-zinc-800 bg-background shadow-md transition-all duration-200 hover:scale-[1.03] hover:border-primary hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className={`relative flex h-64 w-full items-center justify-center p-8 ${color} rounded-t-xl`}>
                <Icon
                  className={`h-24 w-24 ${iconColor} transition-transform duration-200 group-hover:scale-110`}
                />
              </div>
              <div className="p-6">
                <h3 className="text-center text-xl font-semibold tracking-tight">
                  {collection.title}
                </h3>
                <div className="mt-4 flex items-center justify-center">
                  <span className={`font-medium ${iconColor}`}>View Collection</span>
                  <ArrowRight
                    className={`ml-2 h-4 w-4 ${iconColor} transition-transform group-hover:translate-x-1`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
