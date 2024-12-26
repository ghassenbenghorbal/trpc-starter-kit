export const YEARS = Array.from({ length: new Date().getFullYear() - 2023 + 1 }, (_, i) => {
    const year = (new Date().getFullYear() - i).toString();
    return { label: year, value: year };
});

export const MONTHS = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("default", { month: "long" });
    return { label: month, value: (i+1).toString() };
});

export const DAYS = Array.from({ length: new Date(+new Date().getFullYear(), +new Date().getMonth() + 1, 0).getDate() }, (_, i) => {
    const day = (i + 1).toString();
    return { label: day, value: day };
});
