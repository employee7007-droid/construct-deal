import { Search, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetRfqsQuery } from "@/store/api/rfqApi";
import { useAppSelector } from "@/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const RFQList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  
  const queryParams = {
    ...(search && { search }),
    ...(status !== "all" && { status }),
    page,
    limit: 10,
  };
  
  const { data: rfqsData, isLoading, error } = useGetRfqsQuery(queryParams);
  const rfqs = rfqsData?.data?.rfqs || [];
  
  const formatCurrency = (min: number, max: number) => {
    return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={user?.role || "facility_manager"} userName={user?.name || "User"} />
      <div className="flex">
        <Sidebar userRole={user?.role || "facility_manager"} activePage="rfqs" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Requests for Quotation</h1>
                <p className="text-muted-foreground">Manage and track all your RFQs</p>
              </div>
              <Link to="/rfqs/create">
                <Button className="bg-accent hover:bg-accent-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Create RFQ
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search RFQs..." 
                      className="pl-10" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={status} onValueChange={setStatus}>
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
              {isLoading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-24" />
                        <Skeleton className="h-12 w-24" />
                        <Skeleton className="h-10 w-28" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Error loading RFQs. Please try again later.</p>
                  </CardContent>
                </Card>
              ) : rfqs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No RFQs found. {" "}
                      <Link to="/rfqs/create" className="text-primary hover:underline">
                        Create your first RFQ
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              ) : (
                rfqs.map((rfq: any) => (
                  <Link key={rfq.id} to={`/rfqs/${rfq.id}`}>
                    <Card className="hover:shadow-md transition-smooth cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl">{rfq.title}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline">{rfq.categoryName || "General"}</Badge>
                                <span className="text-muted-foreground">•</span>
                                <span>{rfq.buildingName || "Building"}</span>
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
                            <p className="text-lg font-semibold text-foreground">
                              {rfq.estBudgetMin && rfq.estBudgetMax 
                                ? formatCurrency(rfq.estBudgetMin, rfq.estBudgetMax)
                                : "Budget not specified"
                              }
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-sm font-medium text-muted-foreground">Bids Received</p>
                            <p className="text-lg font-semibold text-primary">{rfq.bidCount || 0}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-sm font-medium text-muted-foreground">Close Date</p>
                            <p className="text-lg font-semibold text-foreground">
                              {new Date(rfq.closeDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button onClick={(e) => e.preventDefault()}>View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RFQList;
