import { CURRENCIES } from "@/lib/country-utils";
import { MONTHS } from "@/lib/date-utils";
import { create } from "zustand";

export type DashboardState = {
    year: string;
    month: string;
    monthName: string;
    day: string;
    country: string;
    currency: string;
    convertTo: string;
    convertToOptions: { label: string; value: string }[];
    setYear: (year: string) => void;
    setMonth: (month: string) => void;
    setMonthName: (monthName: string) => void;
    setDay: (day: string) => void;
    setCountry: (country: string) => void;
    setConvertTo: (convertTo: string) => void;
};

export const useDashboardStore = create<DashboardState>()((set) => ({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    monthName: new Date(0, new Date().getMonth()).toLocaleString("default", { month: "long" }),
    day: new Date().getDate().toString(),
    country: "TN",
    currency: "TND",
    convertTo: "TND",
    convertToOptions: [{ label: "TND", value: "TND" }, { label: "USD", value: "USD" }],
    setYear: (year) => set({ year }),
    setMonth: (month) => {
        set({ month, monthName: MONTHS.find((m) => m.value === month)?.label || "" });
    },
    setMonthName: (monthName) => set({ monthName }),
    setDay: (day) => set({ day }),
    setCountry: (country) => {
        const _country = country.toUpperCase();
        const _currency = CURRENCIES[_country];
        const _convertTo = _country === "TN" ? "TND" : "USD";
        const _convertToOptions =
            _country === "TND"
                ? [{ label: "TND", value: "TND" }]
                : [
                      { label: "USD", value: "USD" },
                      { label: _currency, value: _currency },
                  ];
        set({ country: _country, currency: _currency, convertTo: _convertTo, convertToOptions: _convertToOptions });
    },
    setConvertTo: (convertTo) => set({ convertTo: convertTo.toUpperCase() }),
}));
