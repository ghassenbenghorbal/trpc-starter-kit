import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CheckIcon } from "lucide-react";
import { Button } from "./button";
import { CaretSortIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "./skeleton";
import useOnScreen from "@/hooks/useOnScreen";

type Props = {
    label: string;
    value: string;
    placeholder: string;
    selected: string[];
    options: any[];
    count?: number;
    loading?: boolean;
    search: string;
    setSearch: (value: string) => void;
    onChange: (value: string[]) => void;
    isPaginated?: boolean;
} & (
    | { isPaginated: true; perPage: number; fetchMore: () => void }
    | { isPaginated?: false; fetchMore?: never; perPage?: never }
);

export default function ComboboxWithApiFilter({
    label,
    value,
    placeholder,
    selected,
    options,
    onChange,
    loading,
    search,
    setSearch,
    isPaginated,
    count,
    fetchMore,
    perPage,
}: Props) {
    const [open, setOpen] = useState(false);
    const [lastItemIsVisible, lastItemRef] = useOnScreen();

    useEffect(() => {
        const canFetchMore = !loading && lastItemIsVisible && count && count !== options.length;
        if (isPaginated && canFetchMore) {
            fetchMore();
        }
    }, [count, fetchMore, isPaginated, lastItemIsVisible, loading, options.length]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3">
                    {selected.length == 0 ? placeholder : `${selected.length} item(s) selected`}
                    <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Type to search..." value={search} onValueChange={setSearch}>
                        {loading && <ReloadIcon className="h-4 w-4 shrink-0 animate-spin opacity-50" />}
                    </CommandInput>
                    <CommandList className="max-h-44 overflow-y-auto">
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            <div>
                                <CommandItem
                                    value={"-1"}
                                    onSelect={() => {
                                        onChange(
                                            selected.includes("-1") ? selected.filter((item) => item !== "-1") : ["-1"]
                                        );
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes("-1") ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    Select All
                                </CommandItem>
                                {/* Selected Options */}
                                {options
                                    .filter((option) => selected.includes(option[value]))
                                    ?.map((option) => (
                                        <CommandItem
                                            key={option[value]}
                                            value={option[value]}
                                            onSelect={() => {
                                                onChange(
                                                    selected.includes(option[value])
                                                        ? selected.filter((item) => item !== option[value])
                                                        : [...selected, option[value]]
                                                );
                                            }}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selected.includes(option[value]) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option[label]}
                                        </CommandItem>
                                    ))}

                                {/* Not Selected Options */}
                                {options
                                    .filter((option) => !selected.includes(option[value]))
                                    ?.map((option) => (
                                        <CommandItem
                                            key={option[value]}
                                            value={option[value]}
                                            onSelect={() => {
                                                onChange(
                                                    selected.includes(option[value])
                                                        ? selected.filter((item) => item !== option[value])
                                                        : [...selected, option[value]]
                                                );
                                            }}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selected.includes(option[value]) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option[label]}
                                        </CommandItem>
                                    ))}
                                {isPaginated && loading
                                    ? Array(
                                          !count
                                              ? 3
                                              : count - options.length > perPage
                                                ? perPage
                                                : count - options.length
                                      )
                                          .fill(0)
                                          .map((_, index) => (
                                              <CommandItem key={index}>
                                                  <Skeleton className="h-6 w-full" />{" "}
                                              </CommandItem>
                                          ))
                                    : null}
                                <CommandItem ref={lastItemRef} aria-hidden={true} />
                            </div>
                            <div className="flex justify-end px-2 py-2 text-xs">{`Results: ${options.length} of ${count ? count : options.length}`}</div>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
