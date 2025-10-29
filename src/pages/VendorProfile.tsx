import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Award, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetVendorQuery } from "@/store/api/vendorApi";
import { useGetRatingsForUserQuery } from "@/store/api/ratingApi";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/store/hooks";

const VendorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { data: vendorData, isLoading } = useGetVendorQuery(id!);
  const { data: ratingsData } = useGetRatingsForUserQuery({ userId: id, page: 1, limit: 10 });

  const vendor = vendorData?.data?.vendor;
  const ratings = ratingsData?.data?.ratings || [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!vendor) {
    return <div className="min-h-screen flex items-center justify-center">Vendor not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userRole={user?.role || "facility_manager"} 
        userName={user?.name || "User"} 
        onLogout={() => navigate("/auth")} 
      />
      
      <div className="flex">
        <Sidebar
          userRole={user?.role || "facility_manager"}
          activePage="vendors"
          onNavigate={(path) => navigate(path)}
        />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/vendors")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{vendor.companyName}</h1>
                <p className="text-muted-foreground">{vendor.email}</p>
              </div>
              <Badge variant={vendor.verificationStatus === "verified" ? "default" : "outline"}>
                {vendor.verificationStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{vendor.avgRating?.toFixed(1) || "N/A"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    Completed Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{vendor.completedJobs || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {vendor.completedJobs > 0 ? Math.round((vendor.completedJobs / (vendor.totalBids || 1)) * 100) : 0}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Total Bids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{vendor.totalBids || 0}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{vendor.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{vendor.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">GST Number</p>
                        <p className="font-medium">{vendor.gstNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">PAN Number</p>
                        <p className="font-medium">{vendor.panNumber || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {vendor.address?.street}<br />
                      {vendor.address?.city}, {vendor.address?.state} {vendor.address?.pincode}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Categories</CardTitle>
                    <CardDescription>Categories this vendor specializes in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vendor.categories?.map((category: any) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ratings">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                    <CardDescription>Customer feedback and ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Review</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ratings.map((rating: any) => (
                          <TableRow key={rating.id}>
                            <TableCell>{new Date(rating.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="font-medium">{rating.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-md">{rating.review}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorProfile;
