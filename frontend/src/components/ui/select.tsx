import React, { FC } from 'react';
import { cn } from "../../lib/utils";

export const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm",
      "focus:outline-none focus:ring-2 focus:ring-gray-950",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => (
  <div 
    className={cn(
      "flex items-center justify-between",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const SelectContent: FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => (
  <div
    className={cn(
      "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const SelectItem: FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => (
  <div
    className={cn(
      "relative flex w-full cursor-default select-none items-center py-1.5 px-3",
      "hover:bg-gray-100 focus:bg-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const SelectValue: FC<React.HTMLAttributes<HTMLSpanElement>> = ({ 
  children,
  className,
  ...props 
}) => (
  <span
    className={cn(
      "block truncate",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Select;
