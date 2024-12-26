import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";

export type StyledDoubleBarChartProps = {
    data?: any[];
    labelName?: string;
    firstDataKey: string;
    secondDataKey: string;
    firstTooltipLabel: string;
    firstTooltipValueUnit?: string;
    secondTooltipLabel: string;
    secondTooltipValueUnit?: string;
    extraToolTipLabel?: string;
    extraToolTipCoefficient?: number;
    extraToolTipPayloadIndex?: number;
    extraToolTipValueUnit?: string;
    exchangeRate?: number;
};

const StyledDoubleBarChart = ({
    data,
    labelName,
    firstDataKey,
    firstTooltipLabel,
    firstTooltipValueUnit,
    secondDataKey,
    secondTooltipLabel,
    secondTooltipValueUnit,
    extraToolTipLabel,
    extraToolTipCoefficient,
    extraToolTipPayloadIndex,
    extraToolTipValueUnit,
    exchangeRate = 1,
}: StyledDoubleBarChartProps) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setIsMobile(window.innerWidth < 768);
        });
    }, []);
    if (data && data.length === 0) {
        return <div className="flex h-52 items-center justify-center">No Data...</div>;
    }
    return (
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 240}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => formatNumber(value / exchangeRate, true)}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
                                    {labelName && (
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {labelName}
                                            </span>
                                            <span className="font-bold">{label}</span>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {firstTooltipLabel}
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {Math.round(
                                                    parseInt(payload[0].value as string) / exchangeRate
                                                ).toLocaleString() || 0}{" "}
                                                {firstTooltipValueUnit}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {secondTooltipLabel}
                                            </span>
                                            <span className="font-bold">
                                                {Math.round(
                                                    parseInt(payload[1].value as string) / exchangeRate
                                                ).toLocaleString() || 0}{" "}
                                                {secondTooltipValueUnit}
                                            </span>
                                        </div>
                                        {extraToolTipCoefficient &&
                                            extraToolTipPayloadIndex &&
                                            extraToolTipValueUnit &&
                                            extraToolTipLabel && (
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {extraToolTipLabel}
                                                    </span>
                                                    <span className="font-bold">
                                                        {Math.round(
                                                            ((parseInt(
                                                                payload[extraToolTipPayloadIndex].value as string
                                                            ) || 0) *
                                                                extraToolTipCoefficient) /
                                                                exchangeRate
                                                        ).toLocaleString()}{" "}
                                                        {extraToolTipValueUnit}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    }}
                />
                <Bar
                    dataKey={(data) => Math.round(data[firstDataKey] / exchangeRate)}
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary/30"
                />
                <Bar
                    dataKey={(data) => Math.round(data[secondDataKey] / exchangeRate)}
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StyledDoubleBarChart;
