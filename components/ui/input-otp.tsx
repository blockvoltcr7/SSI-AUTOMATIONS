"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputOTPContextValue {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  slots: React.RefObject<(HTMLInputElement | null)[]>;
}

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

function useInputOTP() {
  const context = React.useContext(InputOTPContext);
  if (!context) {
    throw new Error("useInputOTP must be used within InputOTP");
  }
  return context;
}

interface InputOTPProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  maxLength: number;
  value?: string;
  onChange?: (value: string) => void;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      maxLength,
      value: controlledValue,
      onChange: controlledOnChange,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState("");
    const slots = React.useRef<(HTMLInputElement | null)[]>([]);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const onChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        controlledOnChange?.(newValue);
      },
      [isControlled, controlledOnChange],
    );

    return (
      <InputOTPContext.Provider value={{ value, onChange, maxLength, slots }}>
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </InputOTPContext.Provider>
    );
  },
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
});
InputOTPGroup.displayName = "InputOTPGroup";

interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ index, className, ...props }, forwardedRef) => {
    const { value, onChange, maxLength, slots } = useInputOTP();
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(forwardedRef, () => inputRef.current!);

    React.useEffect(() => {
      if (slots.current) {
        slots.current[index] = inputRef.current;
      }
    }, [index, slots]);

    const char = value[index] || "";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (char) {
          // Clear current slot
          const newValue = value.slice(0, index) + value.slice(index + 1);
          onChange(newValue);
        } else if (index > 0) {
          // Move to previous slot and clear it
          const newValue = value.slice(0, index - 1) + value.slice(index);
          onChange(newValue);
          slots.current?.[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        slots.current?.[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < maxLength - 1) {
        e.preventDefault();
        slots.current?.[index + 1]?.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Handle paste
      if (inputValue.length > 1) {
        const pastedValue = inputValue.slice(0, maxLength);
        onChange(pastedValue);
        const nextIndex = Math.min(pastedValue.length, maxLength - 1);
        slots.current?.[nextIndex]?.focus();
        return;
      }

      // Handle single character
      if (/^\d$/.test(inputValue)) {
        const newValue =
          value.slice(0, index) + inputValue + value.slice(index + 1);
        onChange(newValue);

        // Move to next slot
        if (index < maxLength - 1) {
          slots.current?.[index + 1]?.focus();
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    return (
      <div
        data-slot="input-otp-slot"
        className={cn("relative h-10 w-10 text-sm", className)}
        {...props}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={char}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={cn(
            "h-full w-full rounded-md border border-neutral-300 dark:border-neutral-700",
            "bg-white dark:bg-neutral-900",
            "text-center text-sm font-medium",
            "text-black dark:text-white",
            "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600",
            "transition-all",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      </div>
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
