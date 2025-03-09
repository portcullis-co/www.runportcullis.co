import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const selectVariants = cva(
  "appearance-none bg-none bg-white bg-selectArrow bg-no-repeat bg-selectArrow flex h-12 px-3 pr-10 w-full rounded-xl border border-primary-200 text-sm ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        danger:
          "border-red-500 text-red-500 focus-visible:ring-red-500 placeholder:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  icon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    variant,
    className,
    children,
    icon,
    ...props
  }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute size-9 left-0 top-0 flex items-center justify-center">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            selectVariants({ variant }),
            icon && "pl-9",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select, selectVariants };