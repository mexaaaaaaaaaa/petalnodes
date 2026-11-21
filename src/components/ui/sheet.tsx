import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-ink/35 transition-opacity",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 h-full w-[86vw] max-w-sm notebook-ruled border-l-2 border-ink p-6 shadow-[-6px_0_0_var(--color-ink)] flex flex-col focus:outline-none",
        className,
      )}
      {...props}
    >
      {/* Notebook margin red-pink rule */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-9 w-[1.5px] bg-blossom-400/55"
      />
      <DialogPrimitive.Close
        aria-label="Close navigation menu"
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-sm border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_var(--color-ink)] hover:bg-blossom-50 cursor-pointer"
      >
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
      <div className="relative z-10 flex flex-1 flex-col pl-6 pt-8">
        {children}
      </div>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-display text-xl font-extrabold text-ink", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle };
