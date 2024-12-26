import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import UAParser from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatNumber = (number: number, round?: boolean) => {
    if (round) {
        number = Math.round(number);
    }
    if (number >= 1000000) {
        return (number / 1000000).toLocaleString() + "M";
    } else if (number >= 1000) {
        return (number / 1000).toLocaleString() + "k";
    } else {
        return number.toLocaleString();
    }
};

export const copyToClipboard = (text: string, title?: string) => {
    navigator.clipboard.writeText(text);
    const message = title ? `${title} copied to clipboard` : "Copied to clipboard";
    toast.success(message);
};

export const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const formatFromCamelCase = (text: string) => {
    if (text === text.toUpperCase()) {
        return text;
    } else {
        // Split camelCase words and capitalize
        return text
            .split(/(?=[A-Z])/)
            .map(capitalize)
            .join(" ");
    }
};

export const formatUserAgent = (userAgent: string) => {
    const parsedUA = new UAParser(userAgent);
    return `${parsedUA.getDevice().model ? parsedUA.getDevice().model + " " + "/ " : ""}${parsedUA.getOS().name} ${parsedUA.getOS().version}`;
};


export function formatDate(
    date: Date | string | number,
    opts: Intl.DateTimeFormatOptions = {}
  ) {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date))
  }
  
  export function toSentenceCase(str: string) {
    return str
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/\s+/g, " ")
      .trim()
  }
  
  /**
   * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
   */
  export function composeEventHandlers<E>(
    originalEventHandler?: (event: E) => void,
    ourEventHandler?: (event: E) => void,
    { checkForDefaultPrevented = true } = {}
  ) {
    return function handleEvent(event: E) {
      originalEventHandler?.(event)
  
      if (
        checkForDefaultPrevented === false ||
        !(event as unknown as Event).defaultPrevented
      ) {
        return ourEventHandler?.(event)
      }
    }
  }
  