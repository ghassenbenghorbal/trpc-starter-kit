import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerWithRange({
    className,
    onChange,
    defaultValue,
    placeholder,
}: React.HTMLAttributes<HTMLDivElement> & { placeholder?: string }) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const handleSelectDate = (dateRange?: DateRange) => {
        setDate(dateRange);

        const toLocalDateString = (date: Date) => {
            return format(date, "yyyy-MM-dd");
        };

        let concatenatedDate = "";
        if (dateRange?.from && dateRange?.to)
            concatenatedDate = `${toLocalDateString(dateRange.from)}|${toLocalDateString(dateRange.to)}`;
        else if (dateRange?.from) concatenatedDate = toLocalDateString(dateRange.from);
        else if (dateRange?.to) concatenatedDate = toLocalDateString(dateRange.to);

        onChange && onChange(concatenatedDate as any);
    };

    React.useEffect(() => {
        if (!defaultValue || (date && !date.from && !date.to)) {
            const _defaultValue = typeof defaultValue === "string" ? defaultValue.split("|") : undefined;
            let from: Date | undefined;
            let to: Date | undefined;
            if (_defaultValue && _defaultValue.length === 1) {
                const _date = new Date(_defaultValue[0]);
                from = _date;
            }
            if (_defaultValue && _defaultValue.length === 2) {
                from = new Date(_defaultValue[0]);
                to = new Date(_defaultValue[1]);
            }
            setDate({ from, to });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            className
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{placeholder ? placeholder : "Pick a date"}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelectDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
