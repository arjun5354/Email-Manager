import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, TrendingUp, Users, FileText, Clock } from "lucide-react";
import { EmailList } from "./EmailList";
import { EmailStats } from "./EmailStats";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmails: 0,
    businessLeads: 0,
    reports: 0,
    general: 0,
    todayEmails: 0,
    weeklyGrowth: 0,
  });

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("https://email-manager-backend-aq68.onrender.com/api/emails"); 
        const data = await res.json();

        const total = data.length;
        const businessLeads = data.filter((e: any) => e.category === "business-lead").length;
        const reports = data.filter((e: any) => e.category === "report").length;
        const general = data.filter((e: any) => e.category === "general").length;

        const today = data.filter((e: any) => {
          const emailDate = new Date(e.timestamp);
          const todayDate = new Date();
          return emailDate.toDateString() === todayDate.toDateString();
        }).length;

        // For now weeklyGrowth is just dummy (you can calculate using past week stats)
        setStats({
          totalEmails: total,
          businessLeads,
          reports,
          general,
          todayEmails: today,
          weeklyGrowth: 12.5, 
        });
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Email Manager</h1>
              <p className="text-white/80 mt-1">
                Automated email categorization and analytics System
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails</CardTitle>
              <Mail className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmails.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time processed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Business Leads</CardTitle>
              <Users className="h-4 w-4 text-business-lead" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-business-lead">{stats.businessLeads}</div>
              <p className="text-xs text-muted-foreground">Potential opportunities</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
              <FileText className="h-4 w-4 text-report" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-report">{stats.reports}</div>
              <p className="text-xs text-muted-foreground">Status updates</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayEmails}</div>
              <div className="flex items-center text-xs text-business-lead">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.weeklyGrowth}% from last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <EmailStats stats={stats} />
          </div>
          <div>
            <EmailList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
