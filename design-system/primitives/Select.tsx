import type { SelectHTMLAttributes } from "react";
import { cn } from "@/design-system/cn";
import { inputBaseClass, type InputSize } from "./Input";

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: InputSize;
}

const sizeClass: Record<InputSize, string> = {
  md: "w-full py-2.5",
  sm: "h-10",
};

export function Select({ size = "md", className, ...props }: SelectProps) {
  return (
    <select
      className={cn(inputBaseClass, sizeClass[size], "pr-9", className)}
      {...props}
    />
  );
}
