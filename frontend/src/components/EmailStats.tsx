import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface EmailStatsProps {
  stats: {
    totalEmails: number;
    businessLeads: number;
    reports: number;
    general: number;
    todayEmails: number;
    weeklyGrowth: number;
  };
}

export const EmailStats = ({ stats }: EmailStatsProps) => {
  
  const pieData = [
    { name: "Business Leads", value: stats.businessLeads, color: "hsl(var(--business-lead))" },
    { name: "Reports", value: stats.reports, color: "hsl(var(--report))" },
    { name: "General", value: stats.general, color: "hsl(var(--general))" },
  ];

  const weeklyData = [
    { day: "Mon", emails: 18, leads: 5, reports: 3 },
    { day: "Tue", emails: 22, leads: 8, reports: 4 },
    { day: "Wed", emails: 19, leads: 6, reports: 2 },
    { day: "Thu", emails: 25, leads: 9, reports: 5 },
    { day: "Fri", emails: 28, leads: 12, reports: 6 },
    { day: "Sat", emails: 15, leads: 4, reports: 1 },
    { day: "Sun", emails: 12, leads: 3, reports: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Category Distribution */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Email Categories</CardTitle>
          <CardDescription>Distribution of processed emails by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Email volume over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="emails"
                  fill="hsl(var(--primary))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
