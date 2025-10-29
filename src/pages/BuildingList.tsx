import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, MapPin, Users, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetBuildingsQuery } from "@/store/api/buildingApi";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/store/hooks";

const BuildingList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: buildingsData, isLoading } = useGetBuildingsQuery({ page, limit: 10 });
  const buildings = buildingsData?.data?.buildings || [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userRole={user?.role || "org_owner"} 
        userName={user?.name || "User"} 
        onLogout={() => navigate("/auth")} 
      />
      
      <div className="flex">
        <Sidebar
          userRole={user?.role || "org_owner"}
          activePage="buildings"
          onNavigate={(path) => navigate(path)}
        />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Buildings</h1>
                <p className="text-muted-foreground">Manage your organization's buildings</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Building
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    Total Buildings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{buildings.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Set(buildings.map((b: any) => b.address?.city)).size}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Total Managers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {buildings.reduce((sum: number, b: any) => sum + (b.managersCount || 0), 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Buildings</CardTitle>
                <CardDescription>View and manage building details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Managers</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buildings.map((building: any) => (
                      <TableRow key={building.id}>
                        <TableCell className="font-medium">{building.name}</TableCell>
                        <TableCell>
                          {building.address?.city}, {building.address?.state}
                        </TableCell>
                        <TableCell className="capitalize">{building.type}</TableCell>
                        <TableCell>{building.managersCount || 0}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate(`/buildings/${building.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuildingList;
