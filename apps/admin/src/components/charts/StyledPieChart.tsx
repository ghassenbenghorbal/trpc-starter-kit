import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

type Props = {
    data?: { name: string; total: number }[];
    tooltipValueUnit?: string;
    verticalAlign?: "top" | "middle" | "bottom";
    align?: "left" | "center" | "right";
    layout?: "horizontal" | "vertical";
    height?: number;
    pieSize?: number;
};

const COLORS = [
    "#FFBB28", // Yellow Orange
    "#0088FE", // Blue
    "#00C49F", // Green
    "#FF8042", // Orange
    "#4B0082", // Indigo
    "#FF4500", // Orange Red
    "#2E8B57", // Sea Green
    "#6A5ACD", // Slate Blue
    "#FF69B4", // Hot Pink
    "#FFD700", // Gold
    "#8A2BE2", // Blue Violet
    "#DC143C", // Crimson
    "#00CED1", // Dark Turquoise
    "#ADFF2F", // Green Yellow
    "#FF1493", // Deep Pink
    "#00FF7F", // Spring Green
    "#7B68EE", // Medium Slate Blue
    "#FF6347", // Tomato
    "#B22222", // Firebrick
    "#FF8C00", // Dark Orange
    "#32CD32", // Lime Green
    "#BA55D3", // Medium Orchid
    "#FFDEAD", // Navajo White
    "#A52A2A", // Brown
];


const RADIAN = Math.PI / 180;

const StyledPieChart = ({ data, tooltipValueUnit, height, pieSize, verticalAlign="middle", align="right", layout="vertical" }: Props) => {
    const [isMobile, setIsMobile] = useState(false);
    const [is2XL, setIs2XL] = useState(false);
    const [key, setKey] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIs2XL(window.innerWidth >= 1536);
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Call once initially to set the correct state
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setKey(key + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, is2XL]);

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        outerRadius,
        percent,
    }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
    }) => {
        const radius = outerRadius + 20;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (!percent) return null;
        return (
            // I know you can just do className="text-xs" you silly muffin. I'm not that dumb.
            // I'm still experimenting with different sizes.
            <text
                className={`${isMobile ? "text-xs" : "text-xs"} fill-black dark:fill-white`}
                x={x}
                y={y}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    if (data && data.length === 0) {
        return <div className="flex h-52 items-center justify-center">No Data...</div>;
    }
    return (
        <ResponsiveContainer width="100%" height={isMobile ? 220 : height ? height : 240} key={key}>
            <PieChart>
                <Legend verticalAlign={verticalAlign} align={align} layout={layout} />
                <Tooltip
                    cursor={{ fill: "var(--accent)" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))" }}
                    content={({ payload }) =>
                        payload?.length && (
                            <Card className="rounded-md bg-card p-3">{`${payload[0].name}: ${payload[0].value} ${tooltipValueUnit}`}</Card>
                        )
                    }
                />
                <Pie
                    data={data?.filter((item) => item.total)}
                    cx={layout == "horizontal" ? "50%" : is2XL ? "58.5%" : "66%"}
                    cy={layout == "horizontal" ? "49%" : "50%"}
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={isMobile ? 70 : pieSize ? pieSize : 90}
                    fill="currentColor"
                    dataKey="total"
                >
                    {data
                        ?.filter((item) => item.total)
                        ?.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default StyledPieChart;
