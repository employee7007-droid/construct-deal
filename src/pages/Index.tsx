import { Button } from "@/components/ui/button";
import { Building2, FileText, Users, Shield, TrendingUp, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <nav className="border-b border-border bg-card/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BidBOQ</span>
          </div>
          <Button asChild>
            <a href="/auth">Get Started</a>
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Building Bid & BOQ <br />
            <span className="text-gradient-primary">Marketplace Platform</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Connect Building Owners with Verified Contractors. Streamline tendering, bidding, and project management in one powerful platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent-hover" asChild>
              <a href="/auth">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/auth">View Demo</a>
            </Button>
          </div>
        </section>

        <section className="grid gap-8 py-20 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm transition-smooth hover:shadow-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Smart RFQ Management</h3>
            <p className="text-muted-foreground">Create detailed RFQs with BOQ, evaluate bids, and award contracts efficiently</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm transition-smooth hover:shadow-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-6 w-6 text-success" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Verified Vendor Network</h3>
            <p className="text-muted-foreground">Access a marketplace of KYC-verified contractors and service providers</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm transition-smooth hover:shadow-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure Project Tracking</h3>
            <p className="text-muted-foreground">Monitor milestones, manage invoices, and track payments securely</p>
          </div>
        </section>

        <section className="py-20">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Built for Scale, Designed for Simplicity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Multi-Role Access</h4>
                    <p className="text-muted-foreground">Facility Managers, Vendors, and Admins - all in one platform</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Intelligent Bid Comparison</h4>
                    <p className="text-muted-foreground">Automated evaluation matrices with weighted criteria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Complete Transparency</h4>
                    <p className="text-muted-foreground">Real-time tracking from RFQ to project completion</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
              <TrendingUp className="mx-auto h-24 w-24 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Procurement?</h3>
              <p className="text-muted-foreground mb-6">Join hundreds of organizations streamlining their building projects</p>
              <Button size="lg" className="bg-accent hover:bg-accent-hover" asChild>
                <a href="/auth">Get Started Today</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 BidBOQ Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
