import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";

export type StyledBarChartProps = {
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

const StyledBarChart = ({
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
}: StyledBarChartProps) => {
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
                                    <div
                                        className={`grid grid-cols-${
                                            +!!labelName +
                                            +!!(
                                                extraToolTipCoefficient &&
                                                extraToolTipPayloadIndex &&
                                                extraToolTipValueUnit &&
                                                extraToolTipLabel
                                            ) +
                                            1
                                        } gap-2`}
                                    >
                                        {labelName && (
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    {labelName}
                                                </span>
                                                <span className="font-bold">{label}</span>
                                            </div>
                                        )}
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
                <Bar
                    dataKey={(data) => Math.round(data[firstDataKey] / exchangeRate)}
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StyledBarChart;
