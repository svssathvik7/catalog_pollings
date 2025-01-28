import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PollData, PollOption } from "@/types/pollResultType";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: PollOption;
  }>;
}

// Color generation utility functions
const generateHue = (index: number, total: number): number => {
  // Generate evenly spaced hues around the color wheel for maximum distinction
  return (index * 360) / total;
};

const hslToHex = (h: number, s: number, l: number): string => {
  // Convert HSL to RGB, then to Hex for chart compatibility
  const hDecimal = h / 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + hDecimal * 12) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const generateColors = (count: number): string[] => {
  // Generate visually distinct colors with consistent properties
  const colors: string[] = [];
  const saturation = 0.65; // Balanced saturation for visual appeal
  const lightness = 0.6; // Optimal lightness for readability

  for (let i = 0; i < count; i++) {
    const hue = generateHue(i, count);
    colors.push(hslToHex(hue, saturation, lightness));
  }

  return colors;
};

const PollVisualization = (data: PollData) => {
  const dynamicColors = React.useMemo(
    () => generateColors(data.options.length),
    [data.options.length]
  );

  // Enhanced label renderer for better visibility and positioning
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    percent: number;
    name: string;
  }) => {
    // Calculate the position for the label using trigonometry
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position labels further from the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Format the label text to include both name and percentage
    const labelText = `${name} (${(percent * 100).toFixed(1)}%)`;

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {labelText}
      </text>
    );
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Votes: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const chartContainerClass =
    "w-full h-[50dvh] flex items-center justify-center";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Poll Results Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>

          <TabsContent
            value="pie"
            className="flex items-center justify-center w-full"
          >
            <div className={chartContainerClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart className="w-full">
                  {/* Add Tooltip for the PieChart */}
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={data.options}
                    dataKey="votes_percentage"
                    nameKey="text"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelLine={true}
                    label={renderCustomizedLabel}
                  >
                    {data.options.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={dynamicColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent
            value="bar"
            className="flex items-center justify-center w-full"
          >
            <div className={chartContainerClass}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.options}>
                  <XAxis
                    dataKey="text"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes_count" fill="#3b82f6" name="Votes">
                    {data.options.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={dynamicColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PollVisualization;
