// Central Data Store & Analytics for Cafe Parisienne Admin Panel

import { getStoredOrders, saveOrders, type CafeOrder, type OrderStatus } from "@/components/order-system";

export interface FormSubmission {
  id: string;
  formType: "contact" | "catering" | "feedback" | "order_inquiry";
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string;
  formattedDate: string;
  status: "unread" | "read" | "replied";
}

export interface WhatsAppClick {
  id: string;
  timestamp: string;
  formattedDate: string;
  source: string; // e.g. "Header Desktop", "Floating Button", "Visit Page Contact Card"
  pageUrl: string;
  deviceType: "Mobile" | "Desktop" | "Tablet";
}

export interface DailyViewStat {
  date: string;
  views: number;
  orders: number;
  whatsappClicks: number;
}

export interface PageViewStats {
  totalViews: number;
  uniqueVisitors: number;
  pageBreakdown: {
    "/": number;
    "/menu": number;
    "/about": number;
    "/gallery": number;
    "/visit": number;
    "/admin": number;
    [path: string]: number;
  };
  dailyViews: DailyViewStat[];
  recentVisits: { timestamp: string; page: string }[];
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // stored credentials
  updatedAt?: string;
}

// Storage Keys
const KEY_CREDENTIALS = "cafe_admin_credentials";
const KEY_SESSION = "cafe_admin_session";
const KEY_LOGIN_FAILURES = "cafe_admin_login_failures";
const KEY_LOCKOUT_TIMESTAMP = "cafe_admin_lockout_ts";
const KEY_FORM_SUBMISSIONS = "cafe_admin_form_submissions";
const KEY_WHATSAPP_CLICKS = "cafe_admin_whatsapp_clicks";
const KEY_PAGE_VIEWS = "cafe_admin_page_views";
const KEY_VISITOR_ID = "cafe_visitor_id";

// Strong Default Credentials (can also be configured via VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD)
export const DEFAULT_ADMIN_USERNAME =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_USERNAME) ||
  "admin_parisienne";
export const DEFAULT_ADMIN_PASSWORD =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_PASSWORD) ||
  "Parisienne#Admin2026!Secure";

// Clean Defaults (Zero Records)
const INITIAL_SUBMISSIONS: FormSubmission[] = [];
const INITIAL_WHATSAPP_CLICKS: WhatsAppClick[] = [];
const INITIAL_PAGE_VIEWS: PageViewStats = {
  totalViews: 0,
  uniqueVisitors: 0,
  pageBreakdown: {
    "/": 0,
    "/menu": 0,
    "/about": 0,
    "/gallery": 0,
    "/visit": 0,
    "/admin": 0,
  },
  dailyViews: [
    { date: "Today", views: 0, orders: 0, whatsappClicks: 0 },
  ],
  recentVisits: [],
};

// Optional Sample Demo Data (available only if admin explicitly clicks "Restore Sample Demo Data")
export const SAMPLE_DEMO_SUBMISSIONS: FormSubmission[] = [
  {
    id: "SUB-8021",
    formType: "contact",
    name: "Eleanor Vance",
    email: "eleanor.vance@example.co.uk",
    phone: "+44 7700 900142",
    subject: "Private Weekend Brunch Table Booking",
    message:
      "Hello! We are looking to book a table for 8 people this Saturday around 11:30 AM for a birthday brunch. Do you take advance reservations for your patio area?",
    submittedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    formattedDate: new Date(Date.now() - 3 * 3600000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "unread",
  },
  {
    id: "SUB-8020",
    formType: "catering",
    name: "Marcus Sterling",
    email: "marcus@battersea-studios.com",
    phone: "+44 20 7946 0918",
    subject: "Corporate Morning Pastry & Coffee Catering",
    message:
      "Good afternoon. Our design agency is hosting a client seminar next Thursday at Lavender Hill. Could you provide 30 almond croissants, fruit brioches, and two carafes of single-origin filter coffee?",
    submittedAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    formattedDate: new Date(Date.now() - 22 * 3600000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "read",
  },
  {
    id: "SUB-8019",
    formType: "contact",
    name: "Chloe Dupont",
    email: "chloe.d@gmail.com",
    phone: "+44 7911 883921",
    subject: "Artisan Uji Matcha & Oat Milk Options",
    message:
      "Just wanted to say the iced ceremonial matcha latte I had yesterday was exquisite! Are your house syrups refined sugar-free?",
    submittedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    formattedDate: new Date(Date.now() - 48 * 3600000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "replied",
  },
];

export const SAMPLE_DEMO_WHATSAPP_CLICKS: WhatsAppClick[] = [
  {
    id: "WA-501",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    formattedDate: new Date(Date.now() - 15 * 60000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: "Floating Action Button",
    pageUrl: "/",
    deviceType: "Mobile",
  },
  {
    id: "WA-502",
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
    formattedDate: new Date(Date.now() - 55 * 60000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: "Header Desktop",
    pageUrl: "/menu",
    deviceType: "Desktop",
  },
  {
    id: "WA-503",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    formattedDate: new Date(Date.now() - 2 * 3600000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: "Visit Page Contact Card",
    pageUrl: "/visit",
    deviceType: "Mobile",
  },
  {
    id: "WA-504",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    formattedDate: new Date(Date.now() - 5 * 3600000).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: "Footer Connect Banner",
    pageUrl: "/",
    deviceType: "Desktop",
  },
];

export const SAMPLE_DEMO_PAGE_VIEWS: PageViewStats = {
  totalViews: 1420,
  uniqueVisitors: 685,
  pageBreakdown: {
    "/": 640,
    "/menu": 380,
    "/about": 160,
    "/gallery": 115,
    "/visit": 125,
    "/admin": 0,
  },
  dailyViews: [
    { date: "25 Sep", views: 180, orders: 12, whatsappClicks: 9 },
    { date: "26 Sep", views: 210, orders: 15, whatsappClicks: 14 },
    { date: "27 Sep", views: 195, orders: 11, whatsappClicks: 8 },
    { date: "28 Sep", views: 240, orders: 18, whatsappClicks: 16 },
    { date: "29 Sep", views: 220, orders: 14, whatsappClicks: 11 },
    { date: "30 Sep", views: 265, orders: 20, whatsappClicks: 19 },
    { date: "Today", views: 110, orders: 7, whatsappClicks: 7 },
  ],
  recentVisits: [],
};

// Auto-clean storage on first boot to ensure completely clean slate
if (typeof window !== "undefined" && !localStorage.getItem("cafe_cleaned_fresh_v2")) {
  try {
    localStorage.setItem("cafe_parisienne_orders", JSON.stringify([]));
    localStorage.setItem("cafe_admin_form_submissions", JSON.stringify([]));
    localStorage.setItem("cafe_admin_whatsapp_clicks", JSON.stringify([]));
    localStorage.setItem("cafe_admin_page_views", JSON.stringify(INITIAL_PAGE_VIEWS));
    localStorage.setItem("cafe_cleaned_fresh_v2", "true");
  } catch {
    // ignore
  }
}

// Dispatch real-time cross-component event
export function notifyAdminUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cafe-admin-store-updated"));
  }
}

// ----------------------------------------------------
// 1. ADMIN AUTH & CREDENTIALS
// ----------------------------------------------------
export function getAdminCredentials(): { username: string; password: string } {
  if (typeof window === "undefined") {
    return { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
  }
  try {
    const raw = localStorage.getItem(KEY_CREDENTIALS);
    if (!raw) {
      const initial = {
        username: DEFAULT_ADMIN_USERNAME,
        password: DEFAULT_ADMIN_PASSWORD,
      };
      localStorage.setItem(KEY_CREDENTIALS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      username: parsed.username || DEFAULT_ADMIN_USERNAME,
      password: parsed.password || DEFAULT_ADMIN_PASSWORD,
    };
  } catch {
    return { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
  }
}

// Lockout & Brute-Force Rate Limiting
export function getAdminLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  if (typeof window === "undefined") return { isLocked: false, remainingSeconds: 0 };
  try {
    const rawLockout = localStorage.getItem(KEY_LOCKOUT_TIMESTAMP);
    if (!rawLockout) return { isLocked: false, remainingSeconds: 0 };
    const lockoutUntil = parseInt(rawLockout, 10);
    const now = Date.now();
    if (now < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    // Lockout period expired, clean up
    localStorage.removeItem(KEY_LOCKOUT_TIMESTAMP);
    localStorage.removeItem(KEY_LOGIN_FAILURES);
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

export function recordFailedLoginAttempt(): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  if (typeof window === "undefined") return { isLocked: false, remainingSeconds: 0, attemptsLeft: 5 };
  try {
    const currentFailures = parseInt(localStorage.getItem(KEY_LOGIN_FAILURES) || "0", 10) + 1;
    localStorage.setItem(KEY_LOGIN_FAILURES, currentFailures.toString());

    if (currentFailures >= 5) {
      const lockoutDurationMs = 60 * 1000; // 60 seconds lockout
      const lockoutUntil = Date.now() + lockoutDurationMs;
      localStorage.setItem(KEY_LOCKOUT_TIMESTAMP, lockoutUntil.toString());
      return { isLocked: true, remainingSeconds: 60, attemptsLeft: 0 };
    }
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: Math.max(0, 5 - currentFailures) };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: 5 };
  }
}

export function clearFailedLoginAttempts() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY_LOGIN_FAILURES);
    localStorage.removeItem(KEY_LOCKOUT_TIMESTAMP);
  } catch {}
}

export function updateAdminCredentials(
  newUsername: string,
  newPassword: string,
  currentPasswordVerification?: string
): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Server environment" };
  const current = getAdminCredentials();

  if (currentPasswordVerification !== undefined && currentPasswordVerification !== current.password) {
    return {
      success: false,
      message: "Current password verification failed. Please enter your correct existing password.",
    };
  }

  const trimmedUser = newUsername.trim();
  const trimmedPass = newPassword.trim();

  if (trimmedUser.length < 3) {
    return { success: false, message: "Username must be at least 3 characters long." };
  }
  if (trimmedPass.length < 8) {
    return {
      success: false,
      message: "Strong password required: Password must be at least 8 characters long.",
    };
  }

  try {
    const updated = {
      username: trimmedUser,
      password: trimmedPass,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY_CREDENTIALS, JSON.stringify(updated));
    // update current session if active
    if (isAdminAuthenticated()) {
      localStorage.setItem(
        KEY_SESSION,
        JSON.stringify({
          token: "auth_" + Date.now(),
          username: trimmedUser,
          loginAt: new Date().toISOString(),
        })
      );
    }
    notifyAdminUpdate();
    return { success: true, message: "Admin credentials successfully updated!" };
  } catch (e) {
    return { success: false, message: "Failed to save credentials: " + String(e) };
  }
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const current = getAdminCredentials();
  return (
    user.trim().toLowerCase() === current.username.trim().toLowerCase() &&
    pass === current.password
  );
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const session = localStorage.getItem(KEY_SESSION);
    if (!session) return false;
    const parsed = JSON.parse(session);
    return !!parsed?.token;
  } catch {
    return false;
  }
}

export function adminLogin(
  user: string,
  pass: string
): { success: boolean; message: string; remainingSeconds?: number } {
  const lockout = getAdminLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      message: `Security Lockout: Too many failed login attempts. Please wait ${lockout.remainingSeconds} seconds before trying again.`,
      remainingSeconds: lockout.remainingSeconds,
    };
  }

  if (verifyAdminCredentials(user, pass)) {
    clearFailedLoginAttempts();
    const sessionData = {
      token: "tok_" + Math.random().toString(36).substring(2) + Date.now(),
      username: user.trim(),
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY_SESSION, JSON.stringify(sessionData));
    notifyAdminUpdate();
    return { success: true, message: "Login successful!" };
  }

  const failure = recordFailedLoginAttempt();
  if (failure.isLocked) {
    return {
      success: false,
      message: `Security Lockout: Too many failed attempts! Access locked for 60 seconds to protect the admin portal.`,
      remainingSeconds: 60,
    };
  }

  return {
    success: false,
    message: `Invalid username or password. (${failure.attemptsLeft} attempt${
      failure.attemptsLeft === 1 ? "" : "s"
    } remaining before temporary security lock)`,
  };
}

export function adminLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_SESSION);
  notifyAdminUpdate();
}

// ----------------------------------------------------
// 2. FORM SUBMISSIONS TRACKING
// ----------------------------------------------------
export function getFormSubmissions(): FormSubmission[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(KEY_FORM_SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

export function recordFormSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  formType?: "contact" | "catering" | "feedback" | "order_inquiry";
}): FormSubmission {
  const all = getFormSubmissions();
  const newSubmission: FormSubmission = {
    id: `SUB-${Math.floor(8000 + Math.random() * 1000)}`,
    formType: data.formType || "contact",
    name: data.name.trim() || "Anonymous Guest",
    email: data.email.trim() || "N/A",
    phone: data.phone?.trim() || "N/A",
    subject: data.subject?.trim() || "General Inquiry",
    message: data.message.trim(),
    submittedAt: new Date().toISOString(),
    formattedDate: new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "unread",
  };

  const updated = [newSubmission, ...all];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify(updated));
    notifyAdminUpdate();
  }
  return newSubmission;
}

export function updateSubmissionStatus(id: string, status: "unread" | "read" | "replied") {
  const all = getFormSubmissions();
  const updated = all.map((item) => (item.id === id ? { ...item, status } : item));
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify(updated));
    notifyAdminUpdate();
  }
}

export function deleteFormSubmission(id: string) {
  const all = getFormSubmissions();
  const updated = all.filter((item) => item.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify(updated));
    notifyAdminUpdate();
  }
}

// ----------------------------------------------------
// 3. WHATSAPP CLICK TRACKING
// ----------------------------------------------------
export function getWhatsAppClicks(): WhatsAppClick[] {
  if (typeof window === "undefined") return INITIAL_WHATSAPP_CLICKS;
  try {
    const raw = localStorage.getItem(KEY_WHATSAPP_CLICKS);
    if (!raw) {
      localStorage.setItem(KEY_WHATSAPP_CLICKS, JSON.stringify(INITIAL_WHATSAPP_CLICKS));
      return INITIAL_WHATSAPP_CLICKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_WHATSAPP_CLICKS;
  } catch {
    return INITIAL_WHATSAPP_CLICKS;
  }
}

export function recordWhatsAppClick(source: string, pageUrl?: string) {
  if (typeof window === "undefined") return;

  const currentClicks = getWhatsAppClicks();
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
  const deviceType: "Mobile" | "Desktop" | "Tablet" = isTablet
    ? "Tablet"
    : isMobile
    ? "Mobile"
    : "Desktop";

  const newClick: WhatsAppClick = {
    id: `WA-${Math.floor(500 + Math.random() * 500)}`,
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: source || "WhatsApp Link",
    pageUrl: pageUrl || window.location.pathname,
    deviceType,
  };

  const updated = [newClick, ...currentClicks];
  localStorage.setItem(KEY_WHATSAPP_CLICKS, JSON.stringify(updated));

  // Update today's page view stats counter as well
  incrementDailyWhatsAppClicks();
  notifyAdminUpdate();
}

function incrementDailyWhatsAppClicks() {
  try {
    const stats = getPageViewStats();
    if (stats.dailyViews && stats.dailyViews.length > 0) {
      const todayIndex = stats.dailyViews.length - 1;
      const todayEntry = stats.dailyViews[todayIndex];
      if (todayEntry) {
        todayEntry.whatsappClicks = (todayEntry.whatsappClicks || 0) + 1;
        localStorage.setItem(KEY_PAGE_VIEWS, JSON.stringify(stats));
      }
    }
  } catch {
    // ignore
  }
}

// ----------------------------------------------------
// 4. PAGE VIEWS TRACKING
// ----------------------------------------------------
export function getPageViewStats(): PageViewStats {
  if (typeof window === "undefined") return INITIAL_PAGE_VIEWS;
  try {
    const raw = localStorage.getItem(KEY_PAGE_VIEWS);
    if (!raw) {
      localStorage.setItem(KEY_PAGE_VIEWS, JSON.stringify(INITIAL_PAGE_VIEWS));
      return INITIAL_PAGE_VIEWS;
    }
    const parsed = JSON.parse(raw);
    return parsed?.totalViews ? parsed : INITIAL_PAGE_VIEWS;
  } catch {
    return INITIAL_PAGE_VIEWS;
  }
}

export function recordPageView(pathname: string) {
  if (typeof window === "undefined") return;

  // Don't count admin page views into public cafe traffic
  if (pathname.startsWith("/admin")) return;

  try {
    const stats = getPageViewStats();
    stats.totalViews = (stats.totalViews || 0) + 1;

    // Check unique visitor via visitor id in localStorage
    const hasVisitorId = localStorage.getItem(KEY_VISITOR_ID);
    if (!hasVisitorId) {
      localStorage.setItem(KEY_VISITOR_ID, "vis_" + Math.random().toString(36).substring(2));
      stats.uniqueVisitors = (stats.uniqueVisitors || 0) + 1;
    }

    // Page breakdown
    if (!stats.pageBreakdown) {
      stats.pageBreakdown = { "/": 0, "/menu": 0, "/about": 0, "/gallery": 0, "/visit": 0, "/admin": 0 };
    }
    stats.pageBreakdown[pathname] = (stats.pageBreakdown[pathname] || 0) + 1;

    // Daily views increment
    if (stats.dailyViews && stats.dailyViews.length > 0) {
      const todayIndex = stats.dailyViews.length - 1;
      const todayEntry = stats.dailyViews[todayIndex];
      if (todayEntry) {
        todayEntry.views = (todayEntry.views || 0) + 1;
      }
    }

    // Recent visits log (keep last 30)
    if (!stats.recentVisits) stats.recentVisits = [];
    stats.recentVisits.unshift({
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      page: pathname,
    });
    if (stats.recentVisits.length > 30) {
      stats.recentVisits = stats.recentVisits.slice(0, 30);
    }

    localStorage.setItem(KEY_PAGE_VIEWS, JSON.stringify(stats));
    notifyAdminUpdate();
  } catch (err) {
    console.error("Failed to record page view:", err);
  }
}

// ----------------------------------------------------
// 5. ORDERS ADMIN HELPERS & CUSTOMER NOTIFICATIONS
// ----------------------------------------------------
/**
 * Formats a phone number for international WhatsApp wa.me links
 * e.g. "07911 123456" -> "447911123456"
 * "+44 7911 123456" -> "447911123456"
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return "";
  let digits = phone.replace(/[^0-9]/g, "");
  // If UK local number starting with 0 (e.g. 07... 11 digits)
  if (digits.startsWith("0") && digits.length === 11) {
    digits = "44" + digits.slice(1);
  }
  return digits;
}

export function generateCustomerNotification(
  order: CafeOrder,
  type: "completed" | "cancelled" | "ready",
  customReason?: string
) {
  const itemsText = (order.items || [])
    .map((i) => `${i.name} (x${i.quantity})`)
    .join(", ");
  const cleanPhone = formatPhoneForWhatsApp(order.phone);

  let message = "";
  if (type === "completed") {
    message = `Hello ${order.customerName}! ☕\n\nYour order *#${order.id}* at *Café Parisienne* is now *COMPLETED*!\n\n📋 Items: ${itemsText}\n💰 Total: £${order.total.toFixed(2)}\n📍 Collection: 225 Lavender Hill, London SW11 1JR\n\nThank you for ordering with us! We hope you enjoy your meal ✨`;
  } else if (type === "cancelled") {
    const reason =
      customReason ||
      order.cancellationReason ||
      "Kitchen unable to fulfill order at this time.";
    message = `Hello ${order.customerName},\n\nWe regret to inform you that your order *#${order.id}* at *Café Parisienne* has been *CANCELLED by the Café Owner / Kitchen Staff*.\n\n❌ Reason: ${reason}\n💰 Total Amount: £${order.total.toFixed(2)}\n\nIf you have any questions or require a refund, please contact us at +44 20 7946 0912. We sincerely apologize for the inconvenience! 🙏`;
  } else if (type === "ready") {
    message = `Hello ${order.customerName}! 🎉\n\nYour order *#${order.id}* is fresh & *READY FOR PICKUP* at Café Parisienne!\n\n📋 Items: ${itemsText}\n📍 Counter: 225 Lavender Hill\n\nSee you shortly! ☕`;
  }

  const encoded = encodeURIComponent(message);
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
  const smsUrl = cleanPhone
    ? `sms:${cleanPhone}?body=${encoded}`
    : `sms:?body=${encoded}`;

  return {
    message,
    whatsappUrl,
    smsUrl,
    cleanPhone,
  };
}

export function markOrderNotified(orderId: string) {
  const orders = getStoredOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        customerNotified: true,
        notifiedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }
    return o;
  });
  saveOrders(updated);
  notifyAdminUpdate();
}

export function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
  options?: {
    cancelledBy?: "owner" | "customer";
    cancellationReason?: string;
    customerNotified?: boolean;
  }
) {
  const orders = getStoredOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      const isCancelled = status === "cancelled";
      return {
        ...o,
        status,
        ...(isCancelled
          ? {
              cancelledBy: options?.cancelledBy || "owner",
              cancellationReason:
                options?.cancellationReason ||
                "Cancelled by Café Owner / Kitchen Staff",
              cancelledAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : {}),
        customerNotified:
          options?.customerNotified !== undefined
            ? options.customerNotified
            : o.customerNotified,
        notifiedAt: options?.customerNotified
          ? new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : o.notifiedAt,
      };
    }
    return o;
  });
  saveOrders(updated);
  notifyAdminUpdate();
}

export function deleteAdminOrder(orderId: string) {
  const orders = getStoredOrders();
  const updated = orders.filter((o) => o.id !== orderId);
  saveOrders(updated);
  notifyAdminUpdate();
}

// Clear all customer orders
export function clearAllOrders() {
  saveOrders([]);
  notifyAdminUpdate();
}

// Clear all customer form submissions
export function clearAllFormSubmissions() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify([]));
  notifyAdminUpdate();
}

// Delete a single WhatsApp click record
export function deleteWhatsAppClick(clickId: string) {
  const clicks = getWhatsAppClicks();
  const updated = clicks.filter((c) => c.id !== clickId);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY_WHATSAPP_CLICKS, JSON.stringify(updated));
    notifyAdminUpdate();
  }
}

// Clear all WhatsApp click logs
export function clearAllWhatsAppClicks() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_WHATSAPP_CLICKS, JSON.stringify([]));
  notifyAdminUpdate();
}

// Reset page views to zero
export function resetPageViewsToZero() {
  if (typeof window === "undefined") return;
  const zeroStats: PageViewStats = {
    totalViews: 0,
    uniqueVisitors: 0,
    pageBreakdown: {
      "/": 0,
      "/menu": 0,
      "/about": 0,
      "/gallery": 0,
      "/visit": 0,
      "/admin": 0,
    },
    dailyViews: [
      {
        date: "Today",
        views: 0,
        orders: 0,
        whatsappClicks: 0,
      },
    ],
    recentVisits: [],
  };
  localStorage.setItem(KEY_PAGE_VIEWS, JSON.stringify(zeroStats));
  notifyAdminUpdate();
}

// Complete wipe: 0 orders, 0 forms, 0 clicks, 0 views (keeps admin credentials)
export function wipeAllDataToZero() {
  if (typeof window === "undefined") return;
  saveOrders([]);
  localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify([]));
  localStorage.setItem(KEY_WHATSAPP_CLICKS, JSON.stringify([]));
  resetPageViewsToZero();
  notifyAdminUpdate();
}

// Reset all store data back to sample demo (keeps custom admin credentials intact)
export function resetAdminDataToDefault() {
  if (typeof window === "undefined") return;
  // NOTE: Never reset custom admin credentials so the administrator's secure password is kept intact
  localStorage.setItem(KEY_FORM_SUBMISSIONS, JSON.stringify(SAMPLE_DEMO_SUBMISSIONS));
  localStorage.setItem(KEY_WHATSAPP_CLICKS, JSON.stringify(SAMPLE_DEMO_WHATSAPP_CLICKS));
  localStorage.setItem(KEY_PAGE_VIEWS, JSON.stringify(SAMPLE_DEMO_PAGE_VIEWS));
  notifyAdminUpdate();
}
