import React from 'react';
import { type ClassValue } from "clsx";
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | null; // Allow null for no variant
  size?: 'default' | 'icon' | 'sm' | 'lg' | null; // Allow null for no size
  className?: ClassValue;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variantStyles: Record<string, string> = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      // Add styles for other variants here if needed
    };

    const sizeStyles: Record<string, string> = {
      default: "h-9 px-4 py-2",
      icon: "h-9 w-9",
      sm: "h-7 px-2", // Example smaller size
      lg: "h-10 px-8", // Example larger size
      // Add styles for other sizes here if needed
    };

    return (
      <button
        className={cn(baseStyles, variant ? variantStyles[variant] : '', size ? sizeStyles[size] : '', className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
import React from 'react';
import { type ClassValue } from "clsx";
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | null; // Allow null for no variant
  size?: 'default' | 'icon' | 'sm' | 'lg' | null; // Allow null for no size
  className?: ClassValue;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variantStyles: Record<string, string> = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      // Add styles for other variants here if needed
    };

    const sizeStyles: Record<string, string> = {
      default: "h-9 px-4 py-2",
      icon: "h-9 w-9",
      sm: "h-7 px-2", // Example smaller size
      lg: "h-10 px-8", // Example larger size
      // Add styles for other sizes here if needed
    };

    return (
      <button
        className={cn(baseStyles, variant ? variantStyles[variant] : '', size ? sizeStyles[size] : '', className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
import React from 'react';
import { type ClassValue } from "clsx";
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | null; // Allow null for no variant
  size?: 'default' | 'icon' | 'sm' | 'lg' | null; // Allow null for no size
  className?: ClassValue;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      // Add styles for other variants here
    };

    const sizeStyles: Record<string, string> = {
      default: "h-9 px-4 py-2",
      icon: "h-9 w-9",
      sm: "h-7 px-2", // Example smaller size
      lg: "h-10 px-8", // Example larger size
      // Add styles for other sizes here
    };
    
    return (
      <button
        className={cn(baseStyles, variant ? variantStyles[variant] : '', size ? sizeStyles[size] : '', className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };