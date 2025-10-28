import { Search, Filter, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RFQList = () => {
  const rfqs = [
    {
      id: "1",
      title: "HVAC System Installation for Alpha Tower",
      category: "HVAC Contractor",
      building: "Alpha Tower",
      budget: "₹3,00,000 - ₹4,00,000",
      status: "active",
      bids: 12,
      closeDate: "2025-11-15",
      visibility: "public",
    },
    {
      id: "2",
      title: "Complete Electrical Rewiring - Beta Complex",
      category: "Electrical Contractor",
      building: "Beta Complex",
      budget: "₹5,50,000 - ₹7,00,000",
      status: "active",
      bids: 8,
      closeDate: "2025-11-18",
      visibility: "private",
    },
    {
      id: "3",
      title: "Fire Safety & Alarm System Installation",
      category: "Fire Safety Contractor",
      building: "Gamma Building",
      budget: "₹2,00,000 - ₹2,50,000",
      status: "closed",
      bids: 15,
      closeDate: "2025-10-20",
      visibility: "public",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="facility_manager" userName="John Smith" />
      <div className="flex">
        <Sidebar userRole="facility_manager" activePage="rfqs" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Requests for Quotation</h1>
                <p className="text-muted-foreground">Manage and track all your RFQs</p>
              </div>
              <Button className="bg-accent hover:bg-accent-hover">
                <Plus className="mr-2 h-4 w-4" />
                Create RFQ
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search RFQs..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {rfqs.map((rfq) => (
                <Card key={rfq.id} className="hover:shadow-md transition-smooth cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{rfq.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{rfq.category}</Badge>
                            <span className="text-muted-foreground">•</span>
                            <span>{rfq.building}</span>
                            <span className="text-muted-foreground">•</span>
                            <Badge variant={rfq.visibility === "public" ? "default" : "secondary"}>
                              {rfq.visibility}
                            </Badge>
                          </div>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          rfq.status === "active" ? "default" : rfq.status === "closed" ? "secondary" : "outline"
                        }
                      >
                        {rfq.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Estimated Budget</p>
                        <p className="text-lg font-semibold text-foreground">{rfq.budget}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm font-medium text-muted-foreground">Bids Received</p>
                        <p className="text-lg font-semibold text-primary">{rfq.bids}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm font-medium text-muted-foreground">Close Date</p>
                        <p className="text-lg font-semibold text-foreground">
                          {new Date(rfq.closeDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button>View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RFQList;
