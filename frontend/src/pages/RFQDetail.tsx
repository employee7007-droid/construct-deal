import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, FileText, Users, Download, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetRfqQuery } from "@/store/api/rfqApi";
import { useGetBidComparisonQuery } from "@/store/api/bidApi";
import { useAwardContractMutation } from "@/store/api/contractApi";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const RFQDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: rfqData, isLoading } = useGetRfqQuery(id!);
  const { data: comparisonData } = useGetBidComparisonQuery(id!);
  const [awardContract, { isLoading: isAwarding }] = useAwardContractMutation();

  const rfq = rfqData?.data?.rfq;
  const bids = comparisonData?.data?.comparison || [];

  const handleAwardContract = async (bidId: string) => {
    try {
      const response = await awardContract({ rfqId: id, bidId }).unwrap();
      if (response.success) {
        toast({
          title: "Contract Awarded",
          description: "The contract has been awarded successfully.",
        });
        navigate("/contracts");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to award contract.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!rfq) {
    return <div className="min-h-screen flex items-center justify-center">RFQ not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="facility_manager" userName="John Manager" onLogout={() => navigate("/auth")} />
      
      <div className="flex">
        <Sidebar
          userRole="facility_manager"
          activePage="rfqs"
          onNavigate={(path) => navigate(path)}
        />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/rfqs")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{rfq.title}</h1>
                <p className="text-muted-foreground">RFQ #{rfq.id?.slice(0, 8)}</p>
              </div>
              <Badge variant={rfq.status === "published" ? "default" : "secondary"}>
                {rfq.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Closing Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Date(rfq.closeDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Budget Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{rfq.estBudgetMin?.toLocaleString()} - ₹{rfq.estBudgetMax?.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Total Bids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{bids.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    BOQ Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{rfq.boqItems?.length || 0}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="boq">BOQ</TabsTrigger>
                <TabsTrigger value="bids">Bids ({bids.length})</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{rfq.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {rfq.evaluationWeights && Object.entries(rfq.evaluationWeights).map(([key, value]: any) => (
                        <div key={key} className="text-center">
                          <p className="text-2xl font-bold text-primary">{value}%</p>
                          <p className="text-sm text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="boq">
                <Card>
                  <CardHeader>
                    <CardTitle>Bill of Quantities</CardTitle>
                    <CardDescription>Detailed breakdown of required items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Specifications</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rfq.boqItems?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="max-w-md text-sm text-muted-foreground">
                              {item.specifications}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bids">
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Bids</CardTitle>
                    <CardDescription>All bids received for this RFQ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Timeline</TableHead>
                          <TableHead>Validity</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bids.map((bid: any) => (
                          <TableRow key={bid.id}>
                            <TableCell className="font-medium">{bid.vendorName}</TableCell>
                            <TableCell>₹{bid.totalAmount?.toLocaleString()}</TableCell>
                            <TableCell>{bid.timelineDays} days</TableCell>
                            <TableCell>{bid.validityDays} days</TableCell>
                            <TableCell>{new Date(bid.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">View</Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAwardContract(bid.id)}
                                  disabled={isAwarding}
                                >
                                  <Trophy className="h-4 w-4 mr-1" />
                                  Award
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle>Bid Comparison Matrix</CardTitle>
                    <CardDescription>Compare all bids based on evaluation criteria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Timeline</TableHead>
                            <TableHead>Price Score</TableHead>
                            <TableHead>Timeline Score</TableHead>
                            <TableHead>Total Score</TableHead>
                            <TableHead>Rank</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bids.map((bid: any, index: number) => (
                            <TableRow key={bid.id} className={index === 0 ? "bg-accent/50" : ""}>
                              <TableCell className="font-medium">
                                {bid.vendorName}
                                {index === 0 && (
                                  <Badge className="ml-2" variant="default">Best</Badge>
                                )}
                              </TableCell>
                              <TableCell>₹{bid.totalAmount?.toLocaleString()}</TableCell>
                              <TableCell>{bid.timelineDays} days</TableCell>
                              <TableCell>{bid.priceScore || "N/A"}</TableCell>
                              <TableCell>{bid.timelineScore || "N/A"}</TableCell>
                              <TableCell className="font-bold">{bid.totalScore || "N/A"}</TableCell>
                              <TableCell>#{index + 1}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant={index === 0 ? "default" : "outline"}
                                  onClick={() => handleAwardContract(bid.id)}
                                  disabled={isAwarding}
                                >
                                  <Trophy className="h-4 w-4 mr-1" />
                                  Award
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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

export default RFQDetail;
