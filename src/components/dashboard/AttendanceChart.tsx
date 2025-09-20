import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", present: 189, total: 243 },
  { name: "Tue", present: 195, total: 243 },
  { name: "Wed", present: 182, total: 243 },
  { name: "Thu", present: 201, total: 243 },
  { name: "Fri", present: 178, total: 243 },
  { name: "Sat", present: 45, total: 243 },
  { name: "Sun", present: 0, total: 243 },
];

export const AttendanceChart = () => {
  return (
    <Card className="hrms-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weekly Attendance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-lg">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value} / {payload[1].value} Present
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="present" 
              strokeWidth={2}
              stroke="hsl(var(--primary))"
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <span>Average attendance: 78.2%</span>
          <span>This week vs last week: +5.3%</span>
        </div>
      </CardContent>
    </Card>
  );
};