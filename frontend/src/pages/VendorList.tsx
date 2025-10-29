import { Search, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVendorsQuery } from "@/store/api/vendorApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useAppSelector } from "@/store/hooks";

const VendorList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");
  const [page, setPage] = useState(1);
  
  const queryParams = {
    ...(search && { search }),
    ...(category !== "all" && { category }),
    ...(city !== "all" && { city }),
    page,
    limit: 12,
  };
  
  const { data: vendorsData, isLoading, error } = useGetVendorsQuery(queryParams);
  const { data: categoriesData } = useGetCategoriesQuery({ page: 1, limit: 50 });
  
  const vendors = vendorsData?.data?.vendors || [];
  const categories = categoriesData?.data?.categories || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={user?.role || "facility_manager"} userName={user?.name || "User"} />
      <div className="flex">
        <Sidebar userRole={user?.role || "facility_manager"} activePage="vendors" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Vendor Marketplace</h1>
              <p className="text-muted-foreground">Discover and connect with verified contractors and service providers</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search vendors by name or category..." 
                      className="pl-10" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {isLoading ? (
                // Loading skeleton
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">Error loading vendors. Please try again later.</p>
                </div>
              ) : vendors.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No vendors found matching your criteria.</p>
                </div>
              ) : (
                vendors.map((vendor: any) => (
                  <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                    <Card className="hover:shadow-md transition-smooth cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                              {(vendor.companyName || vendor.name || "V")
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{vendor.companyName || vendor.name}</CardTitle>
                              {vendor.kycStatus === 'approved' && (
                                <Badge variant="default" className="bg-green-600">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <CardDescription>
                              <div className="flex flex-wrap gap-1">
                                {vendor.categories?.slice(0, 2).map((cat: any, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {cat.name || cat}
                                  </Badge>
                                ))}
                              </div>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-foreground">
                              {vendor.averageRating ? vendor.averageRating.toFixed(1) : "New"}
                            </span>
                            {vendor.ratingCount && (
                              <span className="text-sm text-muted-foreground">
                                ({vendor.ratingCount} reviews)
                              </span>
                            )}
                          </div>
                          {vendor.serviceCities?.length > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{vendor.serviceCities[0]}</span>
                              {vendor.serviceCities.length > 1 && (
                                <span className="text-xs">+{vendor.serviceCities.length - 1}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="text-sm font-medium">
                              <Badge 
                                variant={vendor.kycStatus === 'approved' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {vendor.kycStatus || 'pending'}
                              </Badge>
                            </p>
                          </div>
                          <Button onClick={(e) => e.preventDefault()}>View Profile</Button>
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

export default VendorList;
