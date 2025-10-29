import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RFQList from "./pages/RFQList";
import VendorList from "./pages/VendorList";
import CreateRFQ from "./pages/CreateRFQ";
import RFQDetail from "./pages/RFQDetail";
import VendorProfile from "./pages/VendorProfile";
import ContractList from "./pages/ContractList";
import ContractDetail from "./pages/ContractDetail";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import BuildingList from "./pages/BuildingList";
import DisputeList from "./pages/DisputeList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rfqs"
              element={
                <ProtectedRoute>
                  <RFQList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute>
                  <VendorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rfqs/create"
              element={
                <ProtectedRoute allowedRoles={["facility_manager", "org_owner"]}>
                  <CreateRFQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rfqs/:id"
              element={
                <ProtectedRoute>
                  <RFQDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors/:id"
              element={
                <ProtectedRoute>
                  <VendorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts"
              element={
                <ProtectedRoute>
                  <ContractList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts/:id"
              element={
                <ProtectedRoute>
                  <ContractDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <InvoiceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buildings"
              element={
                <ProtectedRoute allowedRoles={["org_owner", "facility_manager"]}>
                  <BuildingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/disputes"
              element={
                <ProtectedRoute>
                  <DisputeList />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
