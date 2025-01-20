import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  type,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
  type?: 'square' | 'tall';
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-background hover:border-primary dark:bg-black',
        {
          'aspect-square': type === 'square',
          'aspect-[4/5]': type === 'tall',
          'border-2 border-primary': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx('relative inset-0 h-full w-full object-cover transition duration-300 ease-in-out', {
            'group-hover:scale-110': isInteractive
          })}
          alt={props.alt || 'Product image'}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
