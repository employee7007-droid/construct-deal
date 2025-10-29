import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, DollarSign, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetContractsQuery } from "@/store/api/contractApi";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/store/hooks";

const ContractList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: contractsData, isLoading } = useGetContractsQuery({ page, limit: 10 });
  const contracts = contractsData?.data?.contracts || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary";
      case "terminated": return "destructive";
      default: return "outline";
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
          activePage="contracts"
          onNavigate={(path) => navigate(path)}
        />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Contracts</h1>
                <p className="text-muted-foreground">Manage your active and completed contracts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Total Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{contracts.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {contracts.filter((c: any) => c.status === "active").length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {contracts.filter((c: any) => c.status === "completed").length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{contracts.reduce((sum: number, c: any) => sum + (c.totalAmount || 0), 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Contracts</CardTitle>
                <CardDescription>View and manage contract details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract: any) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          #{contract.id?.slice(0, 8)}
                        </TableCell>
                        <TableCell>{contract.vendorName || "N/A"}</TableCell>
                        <TableCell>₹{contract.totalAmount?.toLocaleString()}</TableCell>
                        <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate(`/contracts/${contract.id}`)}
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

export default ContractList;
