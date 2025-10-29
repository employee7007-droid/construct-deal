import { FileText, Users, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetRfqsQuery } from "@/store/api/rfqApi";
import { useGetVendorsQuery } from "@/store/api/vendorApi";
import { useGetContractsQuery } from "@/store/api/contractApi";
import { useAppSelector } from "@/store/hooks";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Fetch data from APIs
  const { data: rfqsData } = useGetRfqsQuery({ page: 1, limit: 5 });
  const { data: vendorsData } = useGetVendorsQuery({ page: 1, limit: 1 });
  const { data: contractsData } = useGetContractsQuery({ page: 1, limit: 1 });
  
  const recentRFQs = rfqsData?.data?.rfqs || [];
  const totalVendors = vendorsData?.data?.pagination?.total || 0;
  const totalContracts = contractsData?.data?.pagination?.total || 0;
  const activeRFQs = recentRFQs.filter(rfq => rfq.status === 'active').length;
  
  // Calculate days until close for each RFQ
  const getRFQClosingTime = (closeDate: string) => {
    const today = new Date();
    const close = new Date(closeDate);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

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
                value={activeRFQs}
                icon={FileText}
                variant="default"
              />
              <StatsCard
                title="Total RFQs"
                value={recentRFQs.length}
                icon={TrendingUp}
                variant="success"
              />
              <StatsCard
                title="Active Contracts"
                value={totalContracts}
                icon={Award}
                variant="warning"
              />
              <StatsCard
                title="Registered Vendors"
                value={totalVendors}
                icon={Users}
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
