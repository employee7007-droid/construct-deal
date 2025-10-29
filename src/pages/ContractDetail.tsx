import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, DollarSign, Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetContractQuery } from "@/store/api/contractApi";
import { useGetInvoicesForContractQuery } from "@/store/api/invoiceApi";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/store/hooks";

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const { data: contractData, isLoading } = useGetContractQuery(id!);
  const { data: invoicesData } = useGetInvoicesForContractQuery(id!);

  const contract = contractData?.data?.contract;
  const invoices = invoicesData?.data?.invoices || [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!contract) {
    return <div className="min-h-screen flex items-center justify-center">Contract not found</div>;
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/contracts")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Contract Details</h1>
                <p className="text-muted-foreground">Contract #{contract.id?.slice(0, 8)}</p>
              </div>
              <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                {contract.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Total Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₹{contract.totalAmount?.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    End Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Vendor</p>
                        <p className="font-medium">{contract.vendorName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Organization</p>
                        <p className="font-medium">{contract.organizationName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Building</p>
                        <p className="font-medium">{contract.buildingName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Terms</p>
                        <p className="font-medium">{contract.paymentTerms}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {contract.termsConditions}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones">
                <Card>
                  <CardHeader>
                    <CardTitle>Milestones</CardTitle>
                    <CardDescription>Track contract milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contract.milestones?.map((milestone: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{milestone.description}</TableCell>
                            <TableCell>{new Date(milestone.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>₹{milestone.amount?.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={milestone.status === "completed" ? "default" : "outline"}>
                                {milestone.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>Contract invoices and payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice: any) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                              #{invoice.id?.slice(0, 8)}
                            </TableCell>
                            <TableCell>₹{invoice.amount?.toLocaleString()}</TableCell>
                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={invoice.status === "paid" ? "default" : "outline"}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigate(`/invoices/${invoice.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
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

export default ContractDetail;
