import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  User,
  Key,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  ShoppingBag,
  Eye as ViewIcon,
  Filter,
  Mail,
  Phone,
  Sliders,
  Sparkles,
  Check,
  XCircle,
  BarChart3,
  Coffee,
  Send,
  Copy,
  Share2,
} from "lucide-react";
import {
  getAdminCredentials,
  updateAdminCredentials,
  verifyAdminCredentials,
  isAdminAuthenticated,
  adminLogin,
  adminLogout,
  getFormSubmissions,
  updateSubmissionStatus,
  deleteFormSubmission,
  getWhatsAppClicks,
  getPageViewStats,
  updateAdminOrderStatus,
  deleteAdminOrder,
  clearAllOrders,
  clearAllFormSubmissions,
  clearAllWhatsAppClicks,
  deleteWhatsAppClick,
  resetPageViewsToZero,
  wipeAllDataToZero,
  resetAdminDataToDefault,
  generateCustomerNotification,
  markOrderNotified,
  formatPhoneForWhatsApp,
  type FormSubmission,
  type WhatsAppClick,
  type PageViewStats,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/admin-store";
import { getStoredOrders, type CafeOrder, type OrderStatus } from "@/components/order-system";
import { cafeName, address } from "@/lib/naji-data";
import { WhatsAppIcon } from "@/components/site-chrome";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal & Analytics | Cafe Parisienne" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "forms" | "whatsapp" | "traffic" | "settings"
  >("overview");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Live data states
  const [orders, setOrders] = useState<CafeOrder[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [whatsappClicks, setWhatsappClicks] = useState<WhatsAppClick[]>([]);
  const [trafficStats, setTrafficStats] = useState<PageViewStats | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState(DEFAULT_ADMIN_USERNAME);
  const [currentTime, setCurrentTime] = useState("");

  // Filters & searches
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [formFilter, setFormFilter] = useState<string>("all");
  const [formSearch, setFormSearch] = useState("");

  // Settings form state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsNotice, setSettingsNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load and sync data
  const refreshAllData = () => {
    setIsAuthenticated(isAdminAuthenticated());
    const creds = getAdminCredentials();
    setCurrentAdmin(creds.username);
    setOrders(getStoredOrders());
    setSubmissions(getFormSubmissions());
    setWhatsappClicks(getWhatsAppClicks());
    setTrafficStats(getPageViewStats());
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("cafe_cleaned_fresh_v3")) {
      wipeAllDataToZero();
      localStorage.setItem("cafe_cleaned_fresh_v3", "true");
    }
    refreshAllData();

    // Clock ticker
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    // Event listener for live updates
    const handleUpdate = () => refreshAllData();
    window.addEventListener("cafe-admin-store-updated", handleUpdate);
    window.addEventListener("cafe-order-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      clearInterval(timer);
      window.removeEventListener("cafe-admin-store-updated", handleUpdate);
      window.removeEventListener("cafe-order-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const res = adminLogin(loginUsername, loginPassword);
    if (res.success) {
      setIsAuthenticated(true);
      refreshAllData();
      setLoginPassword("");
    } else {
      setLoginError(res.message);
    }
  };

  // Quick Autofill for convenience
  const handleAutofillDefault = () => {
    const creds = getAdminCredentials();
    setLoginUsername(creds.username);
    setLoginPassword(creds.password);
    setLoginError("");
  };

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
  };

  // Handle Settings Update (Custom Username and Password)
  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsNotice(null);

    if (newPassword && newPassword !== confirmPassword) {
      setSettingsNotice({ type: "error", text: "New passwords do not match." });
      return;
    }

    const currentCreds = getAdminCredentials();
    const finalUser = newUsername.trim() || currentCreds.username;
    const finalPass = newPassword.trim() || currentCreds.password;

    const res = updateAdminCredentials(finalUser, finalPass);
    if (res.success) {
      setSettingsNotice({ type: "success", text: res.message });
      setCurrentAdmin(finalUser);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setSettingsNotice({ type: "error", text: res.message });
    }
  };

  // Customer Notification & Status Modal States
  const [cancelModalOrder, setCancelModalOrder] = useState<CafeOrder | null>(null);
  const [cancelReasonPreset, setCancelReasonPreset] = useState("Requested items are currently out of stock");
  const [cancelCustomReason, setCancelCustomReason] = useState("");

  const [completeModalOrder, setCompleteModalOrder] = useState<CafeOrder | null>(null);

  const [notifyModalData, setNotifyModalData] = useState<{
    order: CafeOrder;
    type: "completed" | "cancelled" | "ready";
    customReason?: string;
  } | null>(null);

  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Cancellation Handlers
  const openCancelModal = (order: CafeOrder) => {
    setCancelModalOrder(order);
    setCancelReasonPreset("Requested items are currently out of stock");
    setCancelCustomReason("");
  };

  const handleConfirmCancel = (sendWhatsApp: boolean) => {
    if (!cancelModalOrder) return;
    const finalReason = cancelCustomReason.trim() || cancelReasonPreset;

    updateAdminOrderStatus(cancelModalOrder.id, "cancelled", {
      cancelledBy: "owner",
      cancellationReason: finalReason,
      customerNotified: sendWhatsApp,
    });

    if (sendWhatsApp) {
      const notif = generateCustomerNotification(
        cancelModalOrder,
        "cancelled",
        finalReason
      );
      window.open(notif.whatsappUrl, "_blank", "noopener,noreferrer");
    }

    setCancelModalOrder(null);
    refreshAllData();
  };

  // Completion Handlers
  const openCompleteModal = (order: CafeOrder) => {
    setCompleteModalOrder(order);
  };

  const handleConfirmComplete = (sendWhatsApp: boolean) => {
    if (!completeModalOrder) return;

    updateAdminOrderStatus(completeModalOrder.id, "completed", {
      customerNotified: sendWhatsApp,
    });

    if (sendWhatsApp) {
      const notif = generateCustomerNotification(
        completeModalOrder,
        "completed"
      );
      window.open(notif.whatsappUrl, "_blank", "noopener,noreferrer");
    }

    setCompleteModalOrder(null);
    refreshAllData();
  };

  // Generic Customer Message Dialog (for re-sending WhatsApp or SMS)
  const openNotifyModal = (
    order: CafeOrder,
    type: "completed" | "cancelled" | "ready",
    customReason?: string
  ) => {
    setNotifyModalData({ order, type, customReason });
  };

  const handleSendNotification = (channel: "whatsapp" | "sms") => {
    if (!notifyModalData) return;
    const { order, type, customReason } = notifyModalData;
    const notif = generateCustomerNotification(order, type, customReason);
    markOrderNotified(order.id);
    refreshAllData();

    if (channel === "whatsapp") {
      window.open(notif.whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = notif.smsUrl;
    }
  };

  const handleCopyNotificationText = () => {
    if (!notifyModalData) return;
    const { order, type, customReason } = notifyModalData;
    const notif = generateCustomerNotification(order, type, customReason);
    navigator.clipboard.writeText(notif.message);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 3000);
  };

  // Metrics calculations
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "received" || o.status === "preparing"
  ).length;

  const unreadMessagesCount = submissions.filter((s) => s.status === "unread").length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "all" || o.status === orderFilter;
    const matchesSearch =
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Messages
  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter = formFilter === "all" || s.status === formFilter;
    const matchesSearch =
      !formSearch ||
      s.name.toLowerCase().includes(formSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(formSearch.toLowerCase()) ||
      s.subject.toLowerCase().includes(formSearch.toLowerCase()) ||
      s.message.toLowerCase().includes(formSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ==========================================================
  // VIEW 1: SECURE LOGIN SCREEN
  // ==========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0d0b] text-white flex flex-col justify-between selection:bg-sand selection:text-[#120f0c]">
        {/* Top minimal header */}
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full border border-sand/40 bg-white/5 flex items-center justify-center text-sand group-hover:scale-105 transition-transform">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg text-white font-normal group-hover:text-sand transition-colors">
                {cafeName}
              </span>
              <span className="block text-[8px] uppercase tracking-[0.2em] text-sand -mt-0.5">
                Staff &amp; Admin
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Back to Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-sand" />
          </Link>
        </header>

        {/* Center Login Box */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-[#161310] border border-sand/30 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-sand/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#e8a355]/[0.06] blur-3xl" />

            <div className="text-center relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-sand/15 border border-sand/35 flex items-center justify-center mx-auto text-sand shadow-inner mb-4">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="font-serif text-3xl text-white font-normal">Admin Portal Login</h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Enter your authorized credentials to manage orders, forms, and WhatsApp analytics.
              </p>
            </div>

            {loginError && (
              <div className="mt-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-sand absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="e.g. admin_parisienne"
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sand focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-sand absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sand focus:bg-white/[0.08] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-premium py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Key className="w-4 h-4" />
                <span>Authenticate &amp; Enter Dashboard</span>
              </button>
            </form>

            {/* Quick credentials hint & 1-click test button */}
            <div className="mt-6 pt-5 border-t border-white/10 text-xs text-white/60 space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sand">Default Credentials:</span>
                <button
                  type="button"
                  onClick={handleAutofillDefault}
                  className="text-[11px] text-sand underline hover:text-white transition-colors cursor-pointer"
                >
                  ⚡ One-Click Autofill
                </button>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 font-mono text-[11px] text-white/80 space-y-1">
                <div>
                  <span className="text-white/40">Username: </span>
                  <span className="text-sand">{getAdminCredentials().username}</span>
                </div>
                <div>
                  <span className="text-white/40">Password: </span>
                  <span className="text-sand">{getAdminCredentials().password}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/45 text-center">
                (You can change your username and password anytime in dashboard settings)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {cafeName} · Protected Administrative System
        </footer>
      </div>
    );
  }

  // ==========================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================================
  return (
    <div className="min-h-screen bg-[#0e0d0b] text-white selection:bg-sand selection:text-[#120f0c] flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#14110e]/95 backdrop-blur-md border-b border-sand/20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-full border border-sand/40 bg-sand/10 flex items-center justify-center text-sand shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-normal text-white">
                {cafeName} <span className="text-sand italic font-light">Admin Portal</span>
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold tracking-wider uppercase">
                Live Active
              </span>
            </div>
            <p className="text-[11px] text-white/55">
              Logged in as: <strong className="text-sand">{currentAdmin}</strong> · {currentTime || "Syncing..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs text-white/80 hover:text-white transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-sand" />
          </Link>

          <button
            type="button"
            onClick={refreshAllData}
            title="Refresh All Store Data"
            className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/75 hover:text-sand transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Orders */}
          <div
            onClick={() => setActiveTab("orders")}
            className="p-5 rounded-3xl bg-[#171410] border border-sand/25 hover:border-sand/50 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/55">
                Total Orders
              </span>
              <div className="w-9 h-9 rounded-full bg-sand/15 text-sand flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-white">{orders.length}</span>
              <span className="text-xs text-sand font-semibold">
                £{totalRevenue.toFixed(2)} sales
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              {pendingOrdersCount} orders currently in progress
            </p>
          </div>

          {/* Card 2: Website Views */}
          <div
            onClick={() => setActiveTab("traffic")}
            className="p-5 rounded-3xl bg-[#171410] border border-white/10 hover:border-sand/40 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/55">
                Website Views
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ViewIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-white">
                {trafficStats?.totalViews ?? 0}
              </span>
              <span className="text-xs text-blue-400 font-semibold">
                {trafficStats?.uniqueVisitors ?? 0} unique
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Across Home, Menu, Visit &amp; Gallery
            </p>
          </div>

          {/* Card 3: WhatsApp Clicks */}
          <div
            onClick={() => setActiveTab("whatsapp")}
            className="p-5 rounded-3xl bg-[#171410] border border-white/10 hover:border-[#25D366]/40 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/55">
                WhatsApp Clicks
              </span>
              <div className="w-9 h-9 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-white">
                {whatsappClicks.length}
              </span>
              <span className="text-xs text-[#25D366] font-semibold">inquiries</span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Tracked from header, footer &amp; floating button
            </p>
          </div>

          {/* Card 4: Form Messages */}
          <div
            onClick={() => setActiveTab("forms")}
            className="p-5 rounded-3xl bg-[#171410] border border-white/10 hover:border-sand/40 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/55">
                Form Submissions
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-white">{submissions.length}</span>
              {unreadMessagesCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                  {unreadMessagesCount} unread
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-white/50">Contact, catering &amp; event messages</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-sand text-[#120f0c] shadow-md"
                : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-sand text-[#120f0c] shadow-md"
                : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("forms")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "forms"
                ? "bg-sand text-[#120f0c] shadow-md"
                : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Form Messages ({submissions.length})</span>
            {unreadMessagesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-[#120f0c] text-[10px] font-bold flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "whatsapp"
                ? "bg-sand text-[#120f0c] shadow-md"
                : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
            }`}
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp Clicks ({whatsappClicks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("traffic")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "traffic"
                ? "bg-sand text-[#120f0c] shadow-md"
                : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
            }`}
          >
            <ViewIcon className="w-4 h-4" />
            <span>Website Views</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "settings"
                ? "bg-sand text-[#120f0c] shadow-md"
                : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Username &amp; Password</span>
          </button>
        </div>

        {/* ==========================================================
            TAB 1: OVERVIEW (QUICK SNAPSHOT OF EVERYTHING)
            ========================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders Preview */}
              <div className="lg:col-span-7 bg-[#15120f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 font-serif text-xl text-white">
                    <ShoppingBag className="w-5 h-5 text-sand" />
                    <span>Recent Customer Orders</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-sand hover:underline font-semibold"
                  >
                    View All ({orders.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-sand">
                            {order.id}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {order.customerName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase">
                            {order.orderType === "pickup" ? "Pickup" : "Dine-in"}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-1 line-clamp-1">
                          {order.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="font-serif text-sm font-bold text-sand">
                          £{order.total.toFixed(2)}
                        </span>
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full font-semibold uppercase ${
                            order.status === "cancelled"
                              ? order.cancelledBy === "customer"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-red-500/20 text-red-300 border border-red-500/40"
                              : order.status === "ready"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : order.status === "completed"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {order.status === "cancelled"
                            ? order.cancelledBy === "customer"
                              ? "Cancelled by Customer"
                              : "Cancelled by Owner"
                            : order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent WhatsApp Inquiries Preview */}
              <div className="lg:col-span-5 bg-[#15120f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 font-serif text-xl text-white">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    <span>Recent WhatsApp Clicks</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("whatsapp")}
                    className="text-xs text-[#25D366] hover:underline font-semibold"
                  >
                    View All ({whatsappClicks.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {whatsappClicks.slice(0, 4).map((click) => (
                    <div
                      key={click.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {click.source}
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          Page: {click.pageUrl} · {click.deviceType}
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">
                        {click.formattedDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Contact Form Messages */}
            <div className="bg-[#15120f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 font-serif text-xl text-white">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span>Latest Customer Form Messages</span>
                </div>
                <button
                  onClick={() => setActiveTab("forms")}
                  className="text-xs text-sand hover:underline font-semibold"
                >
                  Manage All Messages ({submissions.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {submissions.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{sub.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                            sub.status === "unread"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-sand font-medium mt-1">{sub.subject}</p>
                      <p className="text-xs text-white/60 line-clamp-3 mt-1 leading-relaxed">
                        &ldquo;{sub.message}&rdquo;
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                      <span>{sub.email}</span>
                      <span>{sub.formattedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 2: ORDERS MANAGEMENT
            ========================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Controls */}
            <div className="bg-[#15120f] border border-white/10 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-sand absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, Name, Phone..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/15 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sand"
                />
              </div>

              {/* Status Filter Tabs & Bulk Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["all", "received", "preparing", "ready", "completed", "cancelled"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                        orderFilter === st
                          ? "bg-sand text-[#120f0c]"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete ALL customer orders? This action cannot be undone.")) {
                        clearAllOrders();
                        refreshAllData();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    title="Delete All Orders"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Orders</span>
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#15120f] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-white/[0.04] border-b border-white/10 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-4 px-5">Order ID</th>
                      <th className="py-4 px-5">Customer &amp; Phone</th>
                      <th className="py-4 px-5">Items Ordered</th>
                      <th className="py-4 px-5">Type</th>
                      <th className="py-4 px-5">Total</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/50">
                          No orders found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-5 font-mono font-bold text-sand whitespace-nowrap">
                            {order.id}
                            <div className="text-[10px] text-white/40 font-normal">
                              {order.createdAt}
                            </div>
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap">
                            <div className="font-semibold text-white">{order.customerName}</div>
                            <div className="text-xs text-white/60">{order.phone}</div>
                          </td>

                          <td className="py-4 px-5 max-w-xs">
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs text-white/80 line-clamp-1">
                                  • {item.name} × <strong>{item.quantity}</strong> ({item.price})
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/80 uppercase">
                              {order.orderType === "pickup" ? "Pickup" : "Dine-in"}
                            </span>
                          </td>

                          <td className="py-4 px-5 font-serif font-bold text-sand whitespace-nowrap">
                            £{order.total.toFixed(2)}
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap">
                            {order.status === "cancelled" ? (
                              <div className="flex flex-col gap-1 items-start">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                    order.cancelledBy === "customer"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                                  }`}
                                >
                                  {order.cancelledBy === "customer" ? (
                                    <>
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Cancelled by Customer</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                                      <span>Cancelled by Owner / Kitchen</span>
                                    </>
                                  )}
                                </span>
                                {order.cancellationReason && (
                                  <span
                                    className="text-[11px] text-white/60 max-w-[220px] truncate"
                                    title={order.cancellationReason}
                                  >
                                    {order.cancellationReason}
                                  </span>
                                )}
                                {order.customerNotified && (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                    <Check className="w-3 h-3" /> Msg Sent {order.notifiedAt ? `(${order.notifiedAt})` : ""}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 items-start">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block ${
                                    order.status === "ready"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse"
                                      : order.status === "completed"
                                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  }`}
                                >
                                  {order.status === "ready"
                                    ? "Ready for Pickup"
                                    : order.status === "completed"
                                    ? "✓ Completed"
                                    : order.status}
                                </span>
                                {order.customerNotified && (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                    <Check className="w-3 h-3" /> Msg Sent {order.notifiedAt ? `(${order.notifiedAt})` : ""}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {order.status !== "preparing" && order.status !== "completed" && order.status !== "cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => updateAdminOrderStatus(order.id, "preparing")}
                                  className="px-2.5 py-1 rounded-lg bg-sand/15 hover:bg-sand text-sand hover:text-[#120f0c] text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Prepare
                                </button>
                              )}

                              {order.status !== "ready" && order.status !== "completed" && order.status !== "cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateAdminOrderStatus(order.id, "ready");
                                    openNotifyModal(order, "ready");
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Ready
                                </button>
                              )}

                              {order.status !== "completed" && order.status !== "cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => openCompleteModal(order)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Complete Order & Send WhatsApp"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Complete</span>
                                </button>
                              )}

                              {order.status !== "cancelled" && order.status !== "completed" && (
                                <button
                                  type="button"
                                  onClick={() => openCancelModal(order)}
                                  title="Cancel Order & Send Customer Message"
                                  className="px-2.5 py-1 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-600/40 text-red-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-3 h-3 text-red-400" />
                                  <span>Cancel</span>
                                </button>
                              )}

                              {(order.status === "completed" || order.status === "cancelled") && (
                                <button
                                  type="button"
                                  onClick={() => openNotifyModal(order, order.status as "completed" | "cancelled")}
                                  className="px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#120f0c] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Send / Resend Customer WhatsApp or SMS"
                                >
                                  <WhatsAppIcon className="w-3 h-3" />
                                  <span>{order.customerNotified ? "Resend Msg" : "📱 Msg"}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete order ${order.id}?`)) {
                                    deleteAdminOrder(order.id);
                                  }
                                }}
                                title="Delete Record"
                                className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 3: FORM SUBMISSIONS (CUSTOMER INQUIRIES)
            ========================================================== */}
        {activeTab === "forms" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Filter & Search */}
            <div className="bg-[#15120f] border border-white/10 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-sand absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formSearch}
                  onChange={(e) => setFormSearch(e.target.value)}
                  placeholder="Search messages by name, email, keyword..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/15 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sand"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["all", "unread", "read", "replied"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                        formFilter === st
                          ? "bg-sand text-[#120f0c]"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {submissions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete ALL customer form messages? This action cannot be undone.")) {
                        clearAllFormSubmissions();
                        refreshAllData();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    title="Delete All Messages"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Messages</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="bg-[#15120f] border border-white/10 rounded-3xl p-12 text-center text-white/50">
                  No customer form messages found.
                </div>
              ) : (
                filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-[#161310] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 transition-all hover:border-sand/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-lg font-normal text-white">
                            {sub.name}
                          </span>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-semibold ${
                              sub.status === "unread"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : sub.status === "replied"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-white/10 text-white/80"
                            }`}
                          >
                            {sub.status}
                          </span>
                          <span className="text-[11px] font-mono text-sand/80">{sub.id}</span>
                        </div>
                        <div className="text-xs text-white/60 mt-1 flex flex-wrap items-center gap-3">
                          <a
                            href={`mailto:${sub.email}`}
                            className="hover:text-sand flex items-center gap-1 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-sand" />
                            <span>{sub.email}</span>
                          </a>
                          {sub.phone && sub.phone !== "N/A" && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-sand" />
                              <span>{sub.phone}</span>
                            </span>
                          )}
                          <span>• {sub.formattedDate}</span>
                        </div>
                      </div>

                      {/* Status Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {sub.status !== "read" && (
                          <button
                            type="button"
                            onClick={() => updateSubmissionStatus(sub.id, "read")}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/80 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                        {sub.status !== "replied" && (
                          <button
                            type="button"
                            onClick={() => updateSubmissionStatus(sub.id, "replied")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs text-emerald-300 transition-colors"
                          >
                            Mark Replied
                          </button>
                        )}
                        <a
                          href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject)}`}
                          className="btn-premium px-3 py-1.5 text-xs"
                        >
                          Email Customer
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete message from ${sub.name}?`)) {
                              deleteFormSubmission(sub.id);
                            }
                          }}
                          className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subject & Message */}
                    <div>
                      <h4 className="text-xs font-semibold tracking-wider uppercase text-sand mb-1">
                        Subject: {sub.subject}
                      </h4>
                      <p className="text-sm text-white/85 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        {sub.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 4: WHATSAPP CLICKS LOG
            ========================================================== */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#15120f] border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-white">WhatsApp Button Click Tracker</h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Every time a visitor taps a WhatsApp button on your website, it is timestamped here.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-[#25D366]">
                    {whatsappClicks.length}
                  </span>
                  <div className="text-[11px] text-white/50">Clicks Recorded</div>
                </div>

                {whatsappClicks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete ALL WhatsApp click records? This action cannot be undone.")) {
                        clearAllWhatsAppClicks();
                        refreshAllData();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    title="Delete All WhatsApp Clicks"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Clicks</span>
                  </button>
                )}
              </div>
            </div>

            {/* Click Log Table */}
            <div className="bg-[#15120f] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-white/[0.04] border-b border-white/10 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-4 px-5">Click ID</th>
                      <th className="py-4 px-5">Button Source</th>
                      <th className="py-4 px-5">Website Page</th>
                      <th className="py-4 px-5">Device</th>
                      <th className="py-4 px-5">Timestamp</th>
                      <th className="py-4 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {whatsappClicks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-white/50">
                          No WhatsApp clicks recorded yet.
                        </td>
                      </tr>
                    ) : (
                      whatsappClicks.map((click) => (
                        <tr key={click.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-5 font-mono text-sand font-bold">{click.id}</td>
                          <td className="py-4 px-5">
                            <span className="inline-flex items-center gap-2 font-medium text-white">
                              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                              <span>{click.source}</span>
                            </span>
                          </td>
                          <td className="py-4 px-5 font-mono text-xs text-white/70">
                            {click.pageUrl}
                          </td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] text-white/70 uppercase">
                              {click.deviceType}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-xs text-white/50 font-mono">
                            {click.formattedDate}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                deleteWhatsAppClick(click.id);
                                refreshAllData();
                              }}
                              title="Delete Record"
                              className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 5: WEBSITE VIEWS & TRAFFIC
            ========================================================== */}
        {activeTab === "traffic" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#15120f] border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-white">Website Traffic &amp; Views</h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Real-time analytics for visitors navigating across your café website.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-sand">
                    {trafficStats?.totalViews || 0}
                  </span>
                  <div className="text-[11px] text-white/50">Total Views Recorded</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset website view counters back to 0?")) {
                      resetPageViewsToZero();
                      refreshAllData();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  title="Reset Page Views to 0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Views to 0</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Views */}
              <div className="bg-[#15120f] border border-white/10 p-6 rounded-3xl space-y-4">
                <h3 className="font-serif text-xl text-white">Views by Website Route</h3>
                <div className="space-y-3">
                  {[
                    { path: "/", label: "Home Page (/)", views: trafficStats?.pageBreakdown?.["/"] ?? 0 },
                    { path: "/menu", label: "Menu (/menu)", views: trafficStats?.pageBreakdown?.["/menu"] ?? 0 },
                    { path: "/about", label: "About Us (/about)", views: trafficStats?.pageBreakdown?.["/about"] ?? 0 },
                    { path: "/visit", label: "Visit & Contact (/visit)", views: trafficStats?.pageBreakdown?.["/visit"] ?? 0 },
                    { path: "/gallery", label: "Gallery (/gallery)", views: trafficStats?.pageBreakdown?.["/gallery"] ?? 0 },
                  ].map((p) => {
                    const total = trafficStats?.totalViews ?? 0;
                    const pct = total > 0 ? Math.round((p.views / total) * 100) : 0;
                    return (
                      <div key={p.path} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-medium">{p.label}</span>
                          <span className="text-sand font-mono">
                            {p.views} views ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-sand rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Traffic Breakdown */}
              <div className="bg-[#15120f] border border-white/10 p-6 rounded-3xl space-y-4">
                <h3 className="font-serif text-xl text-white">7-Day Activity Trends</h3>
                <div className="space-y-2.5">
                  {(trafficStats?.dailyViews || []).map((day) => (
                    <div
                      key={day.date}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-white">{day.date}</span>
                      <div className="flex items-center gap-4 text-white/70">
                        <span>
                          👁️ <strong className="text-white">{day.views}</strong> views
                        </span>
                        <span>
                          🛍️ <strong className="text-sand">{day.orders}</strong> orders
                        </span>
                        <span>
                          💬 <strong className="text-[#25D366]">{day.whatsappClicks}</strong> clicks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 6: SETTINGS (USERNAME & PASSWORD CUSTOMIZATION)
            ========================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div className="bg-[#161310] border border-sand/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sand/15 border border-sand/35 flex items-center justify-center text-sand">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-white">Admin Credentials Settings</h3>
                  <p className="text-xs text-white/60">
                    Set your own username and strong password. Only you will be able to log in.
                  </p>
                </div>
              </div>

              {settingsNotice && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
                    settingsNotice.type === "success"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                      : "bg-red-500/20 border-red-500/40 text-red-200"
                  }`}
                >
                  {settingsNotice.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <span>{settingsNotice.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Current Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentAdmin}
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-2.5 text-xs text-white/50 cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    New Username (Leave blank to keep current)
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username..."
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sand font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password..."
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sand font-mono"
                  />
                  <p className="text-[10px] text-white/40 mt-1">
                    Minimum 6 characters. We recommend a mix of uppercase, numbers, and symbols.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new strong password..."
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sand font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-premium px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer w-full"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Update Admin Credentials</span>
                  </button>
                </div>
              </form>

              {/* Comprehensive Data Deletion & Cleanup Options */}
              <div className="pt-8 border-t border-white/10 space-y-6">
                <div>
                  <h4 className="font-serif text-xl text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <span>Data Cleanup &amp; Delete Options</span>
                  </h4>
                  <p className="text-xs text-white/60 mt-1">
                    Select specific datasets to clear, or wipe all records clean to start fresh.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delete Orders */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          <ShoppingBag className="w-4 h-4 text-sand" />
                          <span>Orders Data</span>
                        </span>
                        <span className="text-[11px] text-sand font-mono">{orders.length} items</span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1">
                        Permanently delete all customer orders and kitchen tickets.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete ALL customer orders? This action cannot be undone.")) {
                          clearAllOrders();
                          refreshAllData();
                        }
                      }}
                      disabled={orders.length === 0}
                      className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed border border-red-600/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete All Orders</span>
                    </button>
                  </div>

                  {/* Delete Form Messages */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                          <span>Form Messages</span>
                        </span>
                        <span className="text-[11px] text-purple-400 font-mono">{submissions.length} messages</span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1">
                        Permanently delete all contact and catering form inquiries.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete ALL customer form messages? This action cannot be undone.")) {
                          clearAllFormSubmissions();
                          refreshAllData();
                        }
                      }}
                      disabled={submissions.length === 0}
                      className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed border border-red-600/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete All Messages</span>
                    </button>
                  </div>

                  {/* Delete WhatsApp Clicks */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                          <span>WhatsApp Clicks Log</span>
                        </span>
                        <span className="text-[11px] text-[#25D366] font-mono">{whatsappClicks.length} clicks</span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1">
                        Permanently delete all WhatsApp click records and timestamps.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete ALL WhatsApp click records? This action cannot be undone.")) {
                          clearAllWhatsAppClicks();
                          refreshAllData();
                        }
                      }}
                      disabled={whatsappClicks.length === 0}
                      className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed border border-red-600/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete All WhatsApp Clicks</span>
                    </button>
                  </div>

                  {/* Reset Page Views */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          <ViewIcon className="w-4 h-4 text-blue-400" />
                          <span>Website Views Counter</span>
                        </span>
                        <span className="text-[11px] text-blue-400 font-mono">{trafficStats?.totalViews || 0} views</span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1">
                        Reset total website views and daily analytics counter back to zero.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset website view counters back to 0?")) {
                          resetPageViewsToZero();
                          refreshAllData();
                        }
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Views to 0</span>
                    </button>
                  </div>
                </div>

                {/* Master Wipe & Factory Reset Actions */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/30 via-red-950/50 to-red-950/30 border border-red-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-red-300 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Master Clean Slate (Wipe All Data to Zero)</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Instantly wipes all test orders, messages, clicks, and resets views to zero. Your admin username and password will remain safe.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to WIPE ALL DATA to ZERO? All orders, form messages, WhatsApp clicks, and website views will be permanently reset to zero.")) {
                          wipeAllDataToZero();
                          refreshAllData();
                          alert("All data wiped clean to zero successfully!");
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Wipe All Data to 0 (Clean Slate)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Restore default sample demo data?")) {
                          resetAdminDataToDefault();
                          refreshAllData();
                          alert("Sample data restored successfully!");
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Restore Sample Demo Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            MODAL 1: OWNER ORDER CANCELLATION & CUSTOMER NOTIFICATION
            ========================================================== */}
        {cancelModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#171410] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Cancel Order #{cancelModalOrder.id}
                    </h3>
                    <p className="text-xs text-red-300 font-medium">
                      Cancel order from kitchen and notify customer via message
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="text-white/40 hover:text-white text-lg p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info Pill */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Customer:</span>
                  <span className="font-bold text-white">{cancelModalOrder.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Phone Number:</span>
                  <span className="font-mono text-sand font-semibold">{cancelModalOrder.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Order Total:</span>
                  <span className="font-bold text-sand">£{cancelModalOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Select Reason */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-white/80 block">
                  Select Cancellation Reason:
                </label>
                <div className="space-y-2">
                  {[
                    "Requested items are out of stock",
                    "Kitchen capacity reached / Rush hour",
                    "Café closing early today",
                    "Customer requested cancellation via phone call",
                    "Unable to fulfill order at this time",
                  ].map((preset) => (
                    <label
                      key={preset}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        cancelReasonPreset === preset && !cancelCustomReason
                          ? "bg-red-500/15 border-red-500/50 text-white"
                          : "bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/[0.05]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        checked={cancelReasonPreset === preset && !cancelCustomReason}
                        onChange={() => {
                          setCancelReasonPreset(preset);
                          setCancelCustomReason("");
                        }}
                        className="mt-0.5 accent-red-500"
                      />
                      <span>{preset}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Reason Input */}
                <div className="pt-1">
                  <label className="text-[11px] text-white/60 block mb-1">
                    Or write custom reason:
                  </label>
                  <input
                    type="text"
                    value={cancelCustomReason}
                    onChange={(e) => setCancelCustomReason(e.target.value)}
                    placeholder="Type reason here..."
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handleConfirmCancel(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#120f0c] text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>📱 Cancel Order &amp; Send WhatsApp Message to Customer</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmCancel(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel Only (No Message)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelModalOrder(null)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            MODAL 2: ORDER COMPLETION & CUSTOMER NOTIFICATION
            ========================================================== */}
        {completeModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#171410] border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Complete Order #{completeModalOrder.id}
                    </h3>
                    <p className="text-xs text-blue-300 font-medium">
                      Complete order and send pickup notification to customer
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCompleteModalOrder(null)}
                  className="text-white/40 hover:text-white text-lg p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Customer:</span>
                  <span className="font-bold text-white">{completeModalOrder.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Phone Number:</span>
                  <span className="font-mono text-sand font-semibold">{completeModalOrder.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Order Total:</span>
                  <span className="font-bold text-sand">£{completeModalOrder.total.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-white/70 line-clamp-2">
                  Items: {completeModalOrder.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                </div>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                Send an instant notification to the customer letting them know their order is completed and ready for pickup at 225 Lavender Hill!
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleConfirmComplete(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#120f0c] text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>📱 Complete &amp; Send WhatsApp Message to Customer</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmComplete(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Mark Completed (No Message)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompleteModalOrder(null)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            MODAL 3: DIRECT CUSTOMER MESSAGE PREVIEW & SENDER
            ========================================================== */}
        {notifyModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#171410] border border-sand/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sand/20 text-sand flex items-center justify-center">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white">
                      Message to {notifyModalData.order.customerName}
                    </h3>
                    <span className="text-[11px] text-white/50 font-mono">
                      Phone: {notifyModalData.order.phone} · Order #{notifyModalData.order.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyModalData(null)}
                  className="text-white/40 hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Message Preview Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-white/70">Message Preview:</span>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/90 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {generateCustomerNotification(
                    notifyModalData.order,
                    notifyModalData.type,
                    notifyModalData.customReason
                  ).message}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSendNotification("whatsapp")}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#120f0c] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>📱 Open in WhatsApp &amp; Send Message</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendNotification("sms")}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send as SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyNotificationText}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedFeedback ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
