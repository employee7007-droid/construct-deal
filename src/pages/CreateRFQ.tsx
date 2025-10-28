import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateRfqMutation, usePublishRfqMutation } from "@/store/api/rfqApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetBuildingsQuery } from "@/store/api/buildingApi";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface BOQItem {
  description: string;
  quantity: number;
  unit: string;
  specifications: string;
}

const CreateRFQ = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [createRfq, { isLoading: isCreating }] = useCreateRfqMutation();
  const [publishRfq, { isLoading: isPublishing }] = usePublishRfqMutation();
  const { data: categoriesData } = useGetCategoriesQuery({});
  const { data: buildingsData } = useGetBuildingsQuery({});

  const [rfqData, setRfqData] = useState({
    title: "",
    description: "",
    categoryId: "",
    buildingId: "",
    estBudgetMin: "",
    estBudgetMax: "",
    closeDate: "",
    visibility: "public" as "public" | "private" | "invite_only",
  });

  const [boqItems, setBoqItems] = useState<BOQItem[]>([
    { description: "", quantity: 1, unit: "unit", specifications: "" },
  ]);

  const [evaluationWeights, setEvaluationWeights] = useState({
    price: 40,
    timeline: 20,
    experience: 20,
    warranty: 10,
    sustainability: 10,
  });

  const addBOQItem = () => {
    setBoqItems([...boqItems, { description: "", quantity: 1, unit: "unit", specifications: "" }]);
  };

  const removeBOQItem = (index: number) => {
    setBoqItems(boqItems.filter((_, i) => i !== index));
  };

  const updateBOQItem = (index: number, field: keyof BOQItem, value: any) => {
    const newItems = [...boqItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setBoqItems(newItems);
  };

  const handleSubmit = async (publish = false) => {
    try {
      const payload = {
        ...rfqData,
        estBudgetMin: parseFloat(rfqData.estBudgetMin),
        estBudgetMax: parseFloat(rfqData.estBudgetMax),
        evaluationWeights,
        boqItems,
      };

      const response = await createRfq(payload).unwrap();
      
      if (response.success) {
        if (publish) {
          await publishRfq(response.data.rfq.id).unwrap();
          toast({
            title: "RFQ Published",
            description: "Your RFQ has been created and published successfully.",
          });
        } else {
          toast({
            title: "RFQ Saved",
            description: "Your RFQ has been saved as draft.",
          });
        }
        navigate("/rfqs");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create RFQ. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/rfqs")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Create New RFQ</h1>
                <p className="text-muted-foreground">Fill in the details to create a request for quotation</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your RFQ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">RFQ Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., HVAC System Installation - Building A"
                      value={rfqData.title}
                      onChange={(e) => setRfqData({ ...rfqData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={rfqData.categoryId}
                      onValueChange={(value) => setRfqData({ ...rfqData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.data?.categories?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="building">Building *</Label>
                    <Select
                      value={rfqData.buildingId}
                      onValueChange={(value) => setRfqData({ ...rfqData, buildingId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select building" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingsData?.data?.buildings?.map((building: any) => (
                          <SelectItem key={building.id} value={building.id}>{building.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed description of the work required..."
                      rows={4}
                      value={rfqData.description}
                      onChange={(e) => setRfqData({ ...rfqData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Estimated Budget Min (₹)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      placeholder="300000"
                      value={rfqData.estBudgetMin}
                      onChange={(e) => setRfqData({ ...rfqData, estBudgetMin: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Estimated Budget Max (₹)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      placeholder="400000"
                      value={rfqData.estBudgetMax}
                      onChange={(e) => setRfqData({ ...rfqData, estBudgetMax: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closeDate">Closing Date *</Label>
                    <Input
                      id="closeDate"
                      type="datetime-local"
                      value={rfqData.closeDate}
                      onChange={(e) => setRfqData({ ...rfqData, closeDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={rfqData.visibility}
                      onValueChange={(value: any) => setRfqData({ ...rfqData, visibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="invite_only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Bill of Quantities (BOQ)</CardTitle>
                    <CardDescription>Add line items for the work to be done</CardDescription>
                  </div>
                  <Button onClick={addBOQItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {boqItems.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Input
                              placeholder="e.g., 2-ton split AC unit installation"
                              value={item.description}
                              onChange={(e) => updateBOQItem(index, "description", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity & Unit</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateBOQItem(index, "quantity", parseInt(e.target.value))
                                }
                                className="w-20"
                              />
                              <Select
                                value={item.unit}
                                onValueChange={(value) => updateBOQItem(index, "unit", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unit">Unit</SelectItem>
                                  <SelectItem value="sqft">Sq Ft</SelectItem>
                                  <SelectItem value="sqm">Sq M</SelectItem>
                                  <SelectItem value="lm">Linear M</SelectItem>
                                  <SelectItem value="kg">Kg</SelectItem>
                                  <SelectItem value="ton">Ton</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Specifications</Label>
                          <Textarea
                            placeholder="Detailed specifications, standards, and requirements..."
                            rows={2}
                            value={item.specifications}
                            onChange={(e) => updateBOQItem(index, "specifications", e.target.value)}
                          />
                        </div>
                      </div>
                      {boqItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBOQItem(index)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Criteria</CardTitle>
                <CardDescription>Set weights for bid evaluation (Total must equal 100%)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(evaluationWeights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key} Weight (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) =>
                          setEvaluationWeights({
                            ...evaluationWeights,
                            [key]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Total Weight:</span>
                  <span className={`text-lg font-bold ${
                    Object.values(evaluationWeights).reduce((a, b) => a + b, 0) === 100
                      ? "text-green-600"
                      : "text-destructive"
                  }`}>
                    {Object.values(evaluationWeights).reduce((a, b) => a + b, 0)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/rfqs")}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSubmit(false)}
                disabled={isCreating || isPublishing}
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save as Draft
              </Button>
              <Button onClick={() => handleSubmit(true)} disabled={isCreating || isPublishing}>
                {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish RFQ
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateRFQ;
