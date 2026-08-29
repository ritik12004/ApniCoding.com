'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    if (src && !imageError) {
      return (
        <div
          ref={ref}
          className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
          {...props}
        >
          <img
            src={src}
            alt={alt || ''}
            className="aspect-square h-full w-full"
            onError={() => setImageError(true)}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted',
          className
        )}
        {...props}
      >
        <span className="flex h-full w-full items-center justify-center text-sm font-medium">
          {fallback || alt?.charAt(0).toUpperCase() || '?'}
        </span>
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }