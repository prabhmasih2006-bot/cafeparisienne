import { useState, useEffect } from "react";
import {
  Coffee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Search,
  Sparkles,
  MapPin,
  Utensils,
  Croissant,
} from "lucide-react";
import { drinks, foods, cafeName, address, phone } from "@/lib/naji-data";

export interface OrderItem {
  name: string;
  price: string;
  numericPrice: number;
  quantity: number;
  category: string;
}

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface CafeOrder {
  id: string;
  customerName: string;
  phone: string;
  orderType: "pickup" | "dine_in";
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  cancelledBy?: "owner" | "customer";
  cancellationReason?: string;
  cancelledAt?: string;
  customerNotified?: boolean;
  notifiedAt?: string;
}

const STORAGE_KEY = "cafe_parisienne_orders";
const ACTIVE_ORDER_ID_KEY = "cafe_parisienne_active_order_id";

// Pre-seeded demo order so user can immediately test tracking & cancellation
const DEFAULT_DEMO_ORDER: CafeOrder = {
  id: "CP-1042",
  customerName: "Sophie Taylor",
  phone: "+44 7911 123456",
  orderType: "pickup",
  items: [
    {
      name: "Iced Latte",
      price: "£4.75",
      numericPrice: 4.75,
      quantity: 1,
      category: "Coffee",
    },
    {
      name: "Avocado Sourdough Toast",
      price: "£9.50",
      numericPrice: 9.5,
      quantity: 1,
      category: "Food & Bakery",
    },
    {
      name: "Basque Burnt Cheesecake",
      price: "£6.50",
      numericPrice: 6.5,
      quantity: 1,
      category: "Food & Bakery",
    },
  ],
  total: 20.75,
  status: "preparing",
  createdAt: new Date(Date.now() - 8 * 60000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  estimatedMinutes: 12,
};

export function getStoredOrders(): CafeOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: CafeOrder[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("cafe-order-updated"));
  } catch (err) {
    console.error("Failed to save orders:", err);
  }
}

export function OrderAndTrackingSection({
  defaultTab = "order",
}: {
  defaultTab?: "order" | "track";
}) {
  const [activeTab, setActiveTab] = useState<"order" | "track">(defaultTab);
  const [orders, setOrders] = useState<CafeOrder[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<{ [itemName: string]: number }>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "dine_in">("pickup");
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [activeTrackedOrder, setActiveTrackedOrder] =
    useState<CafeOrder | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState("");
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");

  // Sync orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      const loaded = getStoredOrders();
      setOrders(loaded);

      // Check if there is an active order stored
      const activeId = localStorage.getItem(ACTIVE_ORDER_ID_KEY);
      if (activeId) {
        const found = loaded.find((o) => o.id === activeId);
        if (found) {
          setActiveTrackedOrder(found);
          setTrackingIdInput(found.id);
          return;
        }
      }
      const firstOrder = loaded[0];
      if (firstOrder && !activeTrackedOrder) {
        setActiveTrackedOrder(firstOrder);
        setTrackingIdInput(firstOrder.id);
      }
    };

    loadOrders();
    window.addEventListener("cafe-order-updated", loadOrders);
    return () => window.removeEventListener("cafe-order-updated", loadOrders);
  }, []);

  const allItems = [...drinks, ...foods];
  const categories = [
    "All",
    "Coffee",
    "Signature",
    "Matcha & Tea",
    "Food & Bakery",
  ];

  const filteredItems =
    selectedCategory === "All"
      ? allItems
      : allItems.filter((i) => i.group === selectedCategory);

  const parsePrice = (priceStr: string) => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const addToCart = (name: string) => {
    setCart((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1,
    }));
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => {
      const current = prev[name] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: current - 1 };
    });
  };

  const cartItemsList: OrderItem[] = Object.entries(cart).flatMap(
    ([name, qty]) => {
      const item = allItems.find((i) => i.name === name);
      if (!item) return [];
      return [
        {
          name: item.name,
          price: item.price,
          numericPrice: parsePrice(item.price),
          quantity: qty,
          category: item.group,
        },
      ];
    }
  );

  const cartTotal = cartItemsList.reduce(
    (acc, curr) => acc + curr.numericPrice * curr.quantity,
    0
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemsList.length === 0) return;

    const newId = `CP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CafeOrder = {
      id: newId,
      customerName: customerName.trim() || "Guest",
      phone: customerPhone.trim() || phone,
      orderType,
      items: cartItemsList,
      total: parseFloat(cartTotal.toFixed(2)),
      status: "received",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      estimatedMinutes: 10 + cartItemsList.length * 2,
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    localStorage.setItem(ACTIVE_ORDER_ID_KEY, newId);
    setOrders(updated);
    setActiveTrackedOrder(newOrder);
    setTrackingIdInput(newId);
    setCart({});
    setOrderSuccessMsg(`Order ${newId} placed successfully!`);
    setActiveTab("track");

    setTimeout(() => setOrderSuccessMsg(""), 6000);
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingIdInput.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === query);
    if (found) {
      setActiveTrackedOrder(found);
    } else {
      alert(`No order found matching "${trackingIdInput}". Try CP-1042.`);
    }
  };

  const handleCancelOrder = () => {
    if (!activeTrackedOrder) return;
    if (activeTrackedOrder.status === "cancelled") return;

    const updated = orders.map((o) => {
      if (o.id === activeTrackedOrder.id) {
        return {
          ...o,
          status: "cancelled" as OrderStatus,
          cancelledBy: "customer" as const,
          cancellationReason: "Cancelled upon customer request",
          cancelledAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }
      return o;
    });

    saveOrders(updated);
    setOrders(updated);
    const refreshed = updated.find((o) => o.id === activeTrackedOrder.id);
    if (refreshed) setActiveTrackedOrder(refreshed);
    setCancelConfirmOpen(false);
    setCancelSuccessMsg(
      `Order ${activeTrackedOrder.id} has been cancelled successfully.`
    );
    setTimeout(() => setCancelSuccessMsg(""), 6000);
  };

  return (
    <div
      id="order-and-track-section"
      className="bg-[#120f0c] text-white rounded-3xl border border-sand/25 p-6 sm:p-8 lg:p-12 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      {/* Decorative ambient lights */}
      <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-sand/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#e8a355]/[0.06] blur-[120px]" />

      {/* Header & Tabs */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/15 border border-sand/30 text-sand text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kitchen &amp; Bar Orders</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-tight">
            Order Online &amp;{" "}
            <span className="italic text-sand font-light">Track Live</span>
          </h3>
          <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl">
            Order coffee and bakery delights for quick collection at 225 Lavender
            Hill, or check the live status of your order below.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.06] border border-white/10 self-start md:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("order")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "order"
                ? "bg-sand text-[#1a1510] shadow-md scale-[1.02]"
                : "text-white/75 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Place Order</span>
            {cartItemsList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1a1510] text-sand text-[11px] font-bold flex items-center justify-center ml-1">
                {cartItemsList.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("track")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "track"
                ? "bg-sand text-[#1a1510] shadow-md scale-[1.02]"
                : "text-white/75 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Track / Cancel Order</span>
          </button>
        </div>
      </div>

      {orderSuccessMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveTab("track")}
            className="underline font-semibold hover:text-white ml-2 text-xs uppercase tracking-wider"
          >
            View Live Tracker →
          </button>
        </div>
      )}

      {cancelSuccessMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: PLACE ORDER */}
      {activeTab === "order" && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Menu Selection (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-sand text-[#120f0c] shadow-sm"
                      : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const qty = cart[item.name] || 0;
                return (
                  <div
                    key={item.name}
                    className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-sand/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-lg text-white group-hover:text-sand transition-colors">
                          {item.name}
                        </h4>
                        <span className="font-serif text-base font-semibold text-sand shrink-0">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                        {item.group}
                      </span>
                      {qty > 0 ? (
                        <div className="inline-flex items-center gap-2 bg-[#1b1713] border border-sand/40 rounded-full px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.name)}
                            aria-label={`Decrease ${item.name}`}
                            className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-sand w-4 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(item.name)}
                            aria-label={`Increase ${item.name}`}
                            className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item.name)}
                          className="px-3.5 py-1 rounded-full bg-sand/15 hover:bg-sand text-sand hover:text-[#120f0c] text-xs font-semibold border border-sand/30 transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart & Checkout Summary (Right Column) */}
          <div className="lg:col-span-5 bg-[#191511] border border-white/15 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-sand font-serif text-xl font-normal">
                <ShoppingBag className="w-5 h-5" />
                <span>Your Order Bag</span>
              </div>
              <span className="text-xs text-white/50">
                {cartItemsList.length} items
              </span>
            </div>

            {cartItemsList.length === 0 ? (
              <div className="py-12 text-center text-white/50 space-y-2">
                <Coffee className="w-10 h-10 mx-auto text-sand/30 stroke-[1.2]" />
                <p className="text-sm font-medium">Your bag is currently empty.</p>
                <p className="text-xs text-white/40">
                  Select items from the left to start your order.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="mt-4 space-y-4">
                {/* Items in cart */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {cartItemsList.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-white/5"
                    >
                      <div className="flex-1 pr-2">
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-white/50 ml-1.5">
                          × {item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-sand font-semibold">
                          £{(item.numericPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.name)}
                          className="text-white/40 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup or Dine-in */}
                <div className="pt-2">
                  <label className="text-[11px] uppercase tracking-wider text-white/60 font-semibold block mb-2">
                    Service Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("pickup")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        orderType === "pickup"
                          ? "bg-sand text-[#120f0c] border-sand"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      Takeaway Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("dine_in")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        orderType === "dine_in"
                          ? "bg-sand text-[#120f0c] border-sand"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      Table / Dine In
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/60 font-semibold block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alex M."
                      className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-sand"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/60 font-semibold block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+44 7911..."
                      className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-sand"
                    />
                  </div>
                </div>

                {/* Subtotal & Submit */}
                <div className="pt-3 border-t border-white/15 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Total Amount:</span>
                    <span className="font-serif text-2xl font-bold text-sand">
                      £{cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-premium py-3.5 text-sm flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Confirm &amp; Place Order (£{cartTotal.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="text-[11px] text-center text-white/50">
                    Collection at 225 Lavender Hill, London SW11 1JR
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TRACK / CANCEL ORDER */}
      {activeTab === "track" && (
        <div className="mt-8 space-y-8 relative z-10">
          {/* Order Search & Quick Selector */}
          <div className="bg-[#191511] border border-white/15 p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form
              onSubmit={handleSearchOrder}
              className="flex-1 flex items-center gap-3"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-sand absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  placeholder="Enter Order ID (e.g. CP-1042)"
                  className="w-full rounded-xl bg-white/[0.06] border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sand uppercase tracking-wider font-mono"
                />
              </div>
              <button
                type="submit"
                className="btn-premium px-5 py-2.5 text-xs sm:text-sm shrink-0"
              >
                Track Order
              </button>
            </form>

            {/* Quick Demo Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">Quick demo:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingIdInput("CP-1042");
                  const demo = orders.find((o) => o.id === "CP-1042");
                  if (demo) setActiveTrackedOrder(demo);
                }}
                className="px-3 py-1 rounded-full bg-sand/15 border border-sand/30 text-sand text-xs font-mono hover:bg-sand hover:text-[#1a1510] transition-colors"
              >
                Load Demo Order CP-1042
              </button>
            </div>
          </div>

          {/* Active Order Details & Status Card */}
          {activeTrackedOrder ? (
            <div className="bg-[#17130f] border border-sand/30 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8 shadow-2xl">
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold text-sand tracking-wide">
                      {activeTrackedOrder.id}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
                        activeTrackedOrder.status === "cancelled"
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : activeTrackedOrder.status === "ready"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {activeTrackedOrder.status === "received" && "Order Received"}
                      {activeTrackedOrder.status === "preparing" && "Brewing & Preparing"}
                      {activeTrackedOrder.status === "ready" && "Ready for Collection!"}
                      {activeTrackedOrder.status === "completed" && "Order Completed"}
                      {activeTrackedOrder.status === "cancelled" && "Order Cancelled"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    Customer:{" "}
                    <strong className="text-white">
                      {activeTrackedOrder.customerName}
                    </strong>{" "}
                    · Placed at {activeTrackedOrder.createdAt} ·{" "}
                    {activeTrackedOrder.orderType === "pickup"
                      ? "Takeaway Pickup"
                      : "Dine-in"}
                  </p>
                </div>

                {/* Prominent Cancel Button if not yet completed/cancelled */}
                {activeTrackedOrder.status !== "cancelled" &&
                  activeTrackedOrder.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => setCancelConfirmOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-300 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 self-start sm:self-auto"
                    >
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>Cancel Order</span>
                    </button>
                  )}
              </div>

              {/* Cancel Confirmation Alert Modal / Banner */}
              {cancelConfirmOpen && (
                <div className="p-5 rounded-2xl bg-red-950/60 border border-red-500/50 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2.5 text-red-300 font-semibold text-sm">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>Are you sure you want to cancel order {activeTrackedOrder.id}?</span>
                  </div>
                  <p className="text-xs text-white/70">
                    The kitchen staff will be notified to halt preparation.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors"
                    >
                      Yes, Cancel This Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelConfirmOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              )}

              {/* Status Stepper Timeline */}
              {activeTrackedOrder.status === "cancelled" ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-red-950/30 border border-red-500/40 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{
                        backgroundColor: activeTrackedOrder.cancelledBy === "owner" ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.25)",
                        color: activeTrackedOrder.cancelledBy === "owner" ? "#fca5a5" : "#fcd34d",
                        border: `1px solid ${activeTrackedOrder.cancelledBy === "owner" ? "rgba(239, 68, 68, 0.5)" : "rgba(245, 158, 11, 0.5)"}`,
                      }}
                    >
                      {activeTrackedOrder.cancelledBy === "owner"
                        ? "❌ Cancelled by Café Owner / Kitchen Staff"
                        : "⚠️ Cancelled by Customer"}
                    </div>
                    <h4 className="font-serif text-2xl text-red-200">
                      Order {activeTrackedOrder.id} Has Been Cancelled
                    </h4>
                    <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md mx-auto">
                      <strong>Reason:</strong> {activeTrackedOrder.cancellationReason || (activeTrackedOrder.cancelledBy === "owner" ? "Kitchen unable to fulfill order at this time." : "Cancelled upon customer request.")}
                    </p>
                    <p className="text-[11px] text-white/50 mt-1.5 font-mono">
                      Cancelled at: {activeTrackedOrder.cancelledAt || "Recent request"}
                    </p>
                    {activeTrackedOrder.customerNotified && (
                      <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Notification sent to WhatsApp / Phone</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("order")}
                      className="btn-premium px-6 py-2.5 text-xs cursor-pointer"
                    >
                      Place a New Order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeTrackedOrder.status === "completed" && (
                    <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                        <div>
                          <strong className="block text-white">Order Completed by Café Owner &amp; Kitchen Staff</strong>
                          <span className="text-[11px] text-white/70">Thank you for ordering with {cafeName}! Your treats are ready for collection at 225 Lavender Hill.</span>
                        </div>
                      </div>
                      {activeTrackedOrder.customerNotified && (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Confirmation Sent</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs sm:text-sm text-sand font-medium">
                    <span>
                      Estimated ready time: ~{activeTrackedOrder.estimatedMinutes} mins
                    </span>
                    <span className="text-white/60">
                      Collection: 225 Lavender Hill
                    </span>
                  </div>

                  {/* 4-Step Visual Progress Track */}
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-5 left-4 right-4 h-1 bg-white/15 -z-0" />
                    <div
                      className="absolute top-5 left-4 h-1 bg-sand transition-all duration-700 -z-0"
                      style={{
                        width:
                          activeTrackedOrder.status === "received"
                            ? "25%"
                            : activeTrackedOrder.status === "preparing"
                            ? "60%"
                            : "100%",
                      }}
                    />

                    <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-sand text-[#120f0c] font-bold flex items-center justify-center text-sm shadow-lg">
                          ✓
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-white mt-2">
                          Received
                        </span>
                        <span className="text-[9px] text-white/50 hidden sm:block">
                          Ticket confirmed
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm transition-all ${
                            activeTrackedOrder.status === "preparing" ||
                            activeTrackedOrder.status === "ready" ||
                            activeTrackedOrder.status === "completed"
                              ? "bg-sand text-[#120f0c] shadow-lg ring-4 ring-sand/30"
                              : "bg-[#25201a] border border-white/20 text-white/40"
                          }`}
                        >
                          <Coffee className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-white mt-2">
                          Brewing &amp; Kitchen
                        </span>
                        <span className="text-[9px] text-white/50 hidden sm:block">
                          Freshly prepared
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm transition-all ${
                            activeTrackedOrder.status === "ready" ||
                            activeTrackedOrder.status === "completed"
                              ? "bg-sand text-[#120f0c] shadow-lg"
                              : "bg-[#25201a] border border-white/20 text-white/40"
                          }`}
                        >
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-white mt-2">
                          Quality Check
                        </span>
                        <span className="text-[9px] text-white/50 hidden sm:block">
                          Packaged &amp; boxed
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm transition-all ${
                            activeTrackedOrder.status === "ready"
                              ? "bg-emerald-400 text-[#120f0c] animate-bounce shadow-xl"
                              : activeTrackedOrder.status === "completed"
                              ? "bg-sand text-[#120f0c]"
                              : "bg-[#25201a] border border-white/20 text-white/40"
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-white mt-2">
                          Ready for You!
                        </span>
                        <span className="text-[9px] text-white/50 hidden sm:block">
                          Collect at bar counter
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Items Breakdown in Tracked Order */}
              <div className="pt-6 border-t border-white/10">
                <h5 className="font-serif text-lg text-white mb-3">
                  Items in this Order
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeTrackedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-medium text-white">{it.name}</p>
                        <p className="text-[10px] text-white/50">
                          Qty: {it.quantity} · {it.category}
                        </p>
                      </div>
                      <span className="text-xs font-serif font-semibold text-sand">
                        £{(it.numericPrice * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sand shrink-0" />
                    <span>
                      Collection counter: {address} ({cafeName})
                    </span>
                  </div>
                  <div className="font-serif text-base font-bold text-sand">
                    Total: £{activeTrackedOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-white/50 bg-[#17130f] rounded-3xl border border-white/10">
              <Search className="w-10 h-10 mx-auto text-sand/30 mb-2" />
              <p>No order selected to track.</p>
              <p className="text-xs text-white/40 mt-1">
                Enter an order ID above or click &quot;Load Demo Order CP-1042&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
