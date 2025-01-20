import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import { PollData } from "@/types/poll";

export function PollChart(pollData: PollData) {
  const chartData = pollData.options.map((option, index) => ({
    browser: option.text,
    votes: option.votes_count,
    fill: `hsl(${(index * 40) % 360}, 70%, 60%)`, // Dynamic color
  }));

  const chartConfig = pollData.options.reduce((acc, option, index) => {
    acc[option.text.toLowerCase().replace(/\s+/g, "_")] = {
      label: option.text,
      color: `hsl(${(index * 40) % 360}, 70%, 60%)`, // Dynamic color
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardDescription>Total Votes: {pollData?.voters?.length}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] max-w-[300px] relative"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={360}
            innerRadius={30}
            outerRadius={110}
            defaultShowTooltip={true}
          >
            {/* Custom center text for total votes */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={18}
              fontWeight="bold"
            >
              {pollData.voters.length}
            </text>
            
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="votes" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-sm text-gray-500">Poll ends soon!</p>
      </CardFooter>
    </Card>
  );
}
