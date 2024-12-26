import { formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type StyledDoubleLineChartProps = {
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

const StyledDoubleLineChart = ({
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
}: StyledDoubleLineChartProps) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setIsMobile(window.innerWidth < 768);
        });
    }, []);
    if (data && data.length === 0) {
        return <div className="ml-[1.2rem] flex h-52 items-center justify-center">No Data...</div>;
    }
    return (
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 240}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                }}
            >
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
                <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey={(data) => Math.round(data[firstDataKey] / exchangeRate)}
                    dot={false}
                    activeDot={{
                        r: 6,
                        style: { fill: "hsl(var(--primary))", opacity: 0.3 },
                    }}
                    style={
                        {
                            stroke: "hsl(var(--primary))",
                            opacity: 0.3,
                        } as React.CSSProperties
                    }
                />
                <Line
                    type="monotone"
                    dataKey={(data) => Math.round(data[secondDataKey] / exchangeRate)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                        r: 8,
                        style: { fill: "hsl(var(--primary))" },
                    }}
                    style={
                        {
                            stroke: "hsl(var(--primary))",
                        } as React.CSSProperties
                    }
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StyledDoubleLineChart;
