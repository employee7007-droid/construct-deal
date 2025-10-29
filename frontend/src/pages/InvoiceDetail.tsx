import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, DollarSign, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetInvoiceQuery, useProcessInvoicePaymentMutation } from "@/store/api/invoiceApi";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/store/hooks";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const { data: invoiceData, isLoading } = useGetInvoiceQuery(id!);
  const [processPayment, { isLoading: isProcessing }] = useProcessInvoicePaymentMutation();

  const invoice = invoiceData?.data?.invoice;

  const handleProcessPayment = async () => {
    try {
      await processPayment({ invoiceId: id, paymentMethod: "bank_transfer" }).unwrap();
      toast({
        title: "Payment Processed",
        description: "Payment has been processed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to process payment.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!invoice) {
    return <div className="min-h-screen flex items-center justify-center">Invoice not found</div>;
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
          activePage="invoices"
          onNavigate={(path) => navigate(path)}
        />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Invoice Details</h1>
                <p className="text-muted-foreground">Invoice #{invoice.id?.slice(0, 8)}</p>
              </div>
              <Badge variant={invoice.status === "paid" ? "default" : "outline"}>
                {invoice.status}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoice Information</CardTitle>
                    <CardDescription>Invoice #{invoice.invoiceNumber}</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">From</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.vendorName}<br />
                      Vendor ID: {invoice.vendorId?.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">To</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.organizationName}<br />
                      Organization
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Date</p>
                    <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{invoice.paymentMethod || "N/A"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.lineItems?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">₹{item.amount?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <div className="text-right space-y-2">
                    <div className="flex justify-between gap-8">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>₹{invoice.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>₹{invoice.taxAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between gap-8 text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{((invoice.amount || 0) + (invoice.taxAmount || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {invoice.status !== "paid" && (
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleProcessPayment}
                      disabled={isProcessing}
                    >
                      Process Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceDetail;
