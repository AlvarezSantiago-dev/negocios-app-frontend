// components/ui/tooltip.jsx
import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { clsx } from "clsx"; // opcional, para combinar clases dinámicamente

export const TooltipProvider = RadixTooltip.Provider;

export const Tooltip = RadixTooltip.Root;

export const TooltipTrigger = RadixTooltip.Trigger;

export const TooltipContent = React.forwardRef(
  ({ className, side = "top", align = "center", children, ...props }, ref) => {
    const sideClasses = {
      top: "translate-y-[-4px]",
      bottom: "translate-y-[4px]",
      left: "translate-x-[-4px]",
      right: "translate-x-[4px]",
    };

    return (
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          ref={ref}
          side={side}
          align={align}
          className={clsx(
            "z-50 rounded-md bg-black text-white text-sm px-2 py-1 shadow-md animate-fadeIn",
            sideClasses[side],
            className
          )}
          {...props}
        >
          {children}
          <RadixTooltip.Arrow className="fill-black" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

// Animaciones Tailwind (agregá esto en tu global.css o tailwind.config.js)
// .animate-fadeIn {
//   @apply transition-all duration-150 ease-out;
// }
