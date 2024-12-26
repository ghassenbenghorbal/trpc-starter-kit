import { formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type StyledLineChartProps = {
    data?: any[];
    labelName?: string;
    firstDataKey: string;
    firstTooltipLabel: string;
    firstTooltipValueUnit?: string;
    extraToolTipLabel?: string;
    extraToolTipCoefficient?: number;
    extraToolTipPayloadIndex?: number;
    extraToolTipValueUnit?: string;
    exchangeRate?: number;
};

const StyledLineChart = ({
    data,
    labelName,
    firstDataKey,
    firstTooltipLabel,
    firstTooltipValueUnit,
    extraToolTipLabel,
    extraToolTipCoefficient,
    extraToolTipPayloadIndex,
    extraToolTipValueUnit,
    exchangeRate = 1,
}: StyledLineChartProps) => {
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
                                            <span className="font-bold">
                                                {Math.round(
                                                    parseInt(payload[0].value as string) / exchangeRate
                                                ).toLocaleString() || 0}{" "}
                                                {firstTooltipValueUnit}
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
                    dataKey={(data) => Math.round(data[firstDataKey] / exchangeRate)}
                    dot={false}
                    strokeWidth={2}
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

export default StyledLineChart;
