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
      <Navbar userRole="facility_manager" userName="John Smith" />
      <div className="flex">
        <Sidebar userRole="facility_manager" activePage="vendors" />
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
                    <Input placeholder="Search vendors by name or category..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="hvac">HVAC Contractor</SelectItem>
                      <SelectItem value="electrical">Electrical Contractor</SelectItem>
                      <SelectItem value="fire">Fire Safety</SelectItem>
                      <SelectItem value="general">General Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-smooth">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                          {vendor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{vendor.name}</CardTitle>
                          {vendor.verified && (
                            <Badge variant="default" className="bg-success">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          <Badge variant="outline">{vendor.category}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold text-foreground">{vendor.rating}</span>
                        <span className="text-sm text-muted-foreground">({vendor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{vendor.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Projects Completed</p>
                        <p className="text-lg font-semibold text-foreground">{vendor.projectsCompleted}</p>
                      </div>
                      <Button>View Profile</Button>
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

export default VendorList;
