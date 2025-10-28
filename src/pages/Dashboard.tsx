import { FileText, Users, Award, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const recentRFQs = [
    { id: "1", title: "HVAC System Installation", status: "active", bids: 12, closingIn: "3 days" },
    { id: "2", title: "Building Electrical Upgrade", status: "active", bids: 8, closingIn: "5 days" },
    { id: "3", title: "Fire Safety System", status: "closed", bids: 15, closingIn: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="facility_manager" userName="John Smith" />
      <div className="flex">
        <Sidebar userRole="facility_manager" activePage="dashboard" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Active RFQs"
                value={12}
                icon={FileText}
                trend={{ value: "+2 this week", positive: true }}
                variant="default"
              />
              <StatsCard
                title="Total Bids"
                value={87}
                icon={TrendingUp}
                trend={{ value: "+15%", positive: true }}
                variant="success"
              />
              <StatsCard
                title="Active Contracts"
                value={5}
                icon={Award}
                variant="warning"
              />
              <StatsCard
                title="Registered Vendors"
                value={234}
                icon={Users}
                trend={{ value: "+8 this month", positive: true }}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent RFQs</CardTitle>
                  <CardDescription>Latest requests for quotation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRFQs.map((rfq) => (
                      <div key={rfq.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{rfq.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={rfq.status === "active" ? "default" : "secondary"}>
                              {rfq.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{rfq.bids} bids</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-muted-foreground">{rfq.closingIn}</p>
                          <Button variant="ghost" size="sm" className="mt-1">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" size="lg">
                    <FileText className="mr-2 h-5 w-5" />
                    Create New RFQ
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Users className="mr-2 h-5 w-5" />
                    Browse Vendors
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Award className="mr-2 h-5 w-5" />
                    View Contracts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
