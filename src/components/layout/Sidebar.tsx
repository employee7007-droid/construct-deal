import { Home, FileText, Users, Building, Award, DollarSign, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: "vendor" | "facility_manager" | "org_owner" | "super_admin";
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const Sidebar = ({ userRole = "facility_manager", activePage = "dashboard", onNavigate }: SidebarProps) => {
  const facilityManagerLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "RFQs", path: "/rfqs" },
    { icon: Users, label: "Vendors", path: "/vendors" },
    { icon: Building, label: "Buildings", path: "/buildings" },
    { icon: Award, label: "Contracts", path: "/contracts" },
    { icon: DollarSign, label: "Invoices", path: "/invoices" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const vendorLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Browse RFQs", path: "/rfqs" },
    { icon: Award, label: "My Bids", path: "/bids" },
    { icon: Award, label: "Contracts", path: "/contracts" },
    { icon: DollarSign, label: "Invoices", path: "/invoices" },
    { icon: Settings, label: "Profile", path: "/profile" },
  ];

  const orgOwnerLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "RFQs", path: "/rfqs" },
    { icon: Users, label: "Vendors", path: "/vendors" },
    { icon: Building, label: "Buildings", path: "/buildings" },
    { icon: Award, label: "Contracts", path: "/contracts" },
    { icon: DollarSign, label: "Invoices", path: "/invoices" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const superAdminLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Building, label: "Organizations", path: "/admin/organizations" },
    { icon: Users, label: "Vendors", path: "/admin/vendors" },
    { icon: FileText, label: "RFQs", path: "/admin/rfqs" },
    { icon: Award, label: "Contracts", path: "/admin/contracts" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const getLinksForRole = (role: string) => {
    switch (role) {
      case "vendor":
        return vendorLinks;
      case "org_owner":
        return orgOwnerLinks;
      case "super_admin":
        return superAdminLinks;
      default:
        return facilityManagerLinks;
    }
  };

  const links = getLinksForRole(userRole);

  // Extract the path from the current location to determine active page
  const getActivePage = (path: string) => {
    // Remove the leading slash and any query parameters
    const cleanPath = path.split('?')[0].substring(1);
    return cleanPath;
  };

  return (
    <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-sidebar">
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = getActivePage(activePage) === getActivePage(link.path);
          return (
            <button
              key={link.path}
              onClick={() => onNavigate?.(link.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;