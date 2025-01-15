import React, { FC } from 'react';

import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const CardTitle: FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children,
  className,
  ...props 
}) => (
  <h2 
    {...props} 
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
  >
    {children}
  </h2>
);

export const CardDescription: FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children,
  className,
  ...props 
}) => (
  <p 
    {...props} 
    className={cn(
      "text-sm text-gray-500",
      className
    )}
  >
    {children}
  </p>
);

export const Card: FC<CardProps> = ({ 
  children, 
  variant = 'default',
  className,
  ...props 
}) => (
  <div 
    {...props} 
    className={cn(
      "rounded-lg shadow-sm",
      variant === 'default' && "bg-white border border-gray-200",
      variant === 'destructive' && "bg-red-50 border border-red-200",
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader: FC<CardHeaderProps> = ({ 
  children,
  withBorder = false,
  className,
  ...props 
}) => (
  <div 
    {...props} 
    className={cn(
      "px-6 py-4",
      withBorder && "border-b border-gray-200",
      className
    )}
  >
    {children}
  </div>
);

export const CardContent: FC<CardContentProps> = ({ 
  children,
  padded = true,
  className,
  ...props 
}) => (
  <div 
    {...props} 
    className={cn(
      padded && "p-6",
      className
    )}
  >
    {children}
  </div>
);
