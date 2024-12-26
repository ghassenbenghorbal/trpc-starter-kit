import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { Cross1Icon } from "@radix-ui/react-icons";
import { LuChevronsUpDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type OptionType = {
    label: string;
    value: string;
};

interface MultiSelectProps {
    options: OptionType[];
    selected: string[];
    onChange: React.Dispatch<React.SetStateAction<string[]>>;
    className?: string;
    selectAll: boolean;
    enableSearch?: boolean;
    disabled?: boolean;
}

function MultiSelect({ options, selected, onChange, disabled, className, selectAll, enableSearch }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [allSelected, setAllSelected] = React.useState(false);

    React.useEffect(() => {
        if (selectAll) {
            if (selected.length === options.length) {
                setAllSelected(true);
            } else {
                setAllSelected(false);
            }
        }
    }, [selectAll, selected, options]);

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item));
    };

    const handleSelectAll = () => {
        if (allSelected) {
            onChange([]);
        } else {
            const allValues = options.map((option) => option.value);
            onChange(allValues);
        }
        setAllSelected(!allSelected);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`flex min-h-9 h-fit w-full justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-primary/5`}
                    onClick={() => setOpen(!open)}
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.map((item) => (
                            <Badge
                                variant="secondary"
                                key={item}
                                className="bg-zinc-200 py-1 hover:bg-zinc-200 dark:bg-secondary"
                            >
                                <span className="leading-none">{item}</span>
                                {!disabled && <span className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    <Cross1Icon
                                        className="h-3 w-3 text-muted-foreground hover:text-foreground"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(item);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleUnselect(item)}
                                    />
                                </span>}
                            </Badge>
                        ))}
                    </div>
                    <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className={className}>
                    {enableSearch && <CommandInput placeholder="Search ..." />}
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup className="max-h-64 min-w-40 overflow-auto">
                        <CommandItem onSelect={handleSelectAll}>
                            {allSelected ? "Unselect All" : "Select All"}
                        </CommandItem>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={() => {
                                    onChange(
                                        selected.includes(option.value)
                                            ? selected.filter((item) => item !== option.value)
                                            : [...selected, option.value]
                                    );
                                    setOpen(true);
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export { MultiSelect };
