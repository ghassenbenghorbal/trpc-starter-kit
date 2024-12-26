import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

type Props = {
    data?: { name: string; total: number }[];
    tooltipValueUnit?: string;
};

const StyledStackedBarChart = ({ data, tooltipValueUnit }: Props) => {
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
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 240} >
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: "var(--accent)" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))" }}
                    content={({ label, payload }) =>
                        payload?.length && (
                            <Card className="rounded-lg bg-card p-3">{`${label}: ${payload[0].value} ${tooltipValueUnit}`}</Card>
                        )
                    }
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StyledStackedBarChart;
