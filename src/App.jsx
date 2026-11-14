import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { Suspense, lazy, useState, useEffect, useCallback } from "react";

import { supabase } from "@/lib/supabaseClient";
import PageNotFound from "./lib/PageNotFound";
import SplashScreen from "./components/SplashScreen";
import WaitingApproval from "./components/WaitingApproval.jsx";
import DeviceCodeVerification from "./components/DeviceCodeVerification.jsx";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import Layout from "./components/Layout";
import InstallPrompt from "./components/InstallPrompt";
import NameSetupModal from "./components/onboarding/NameSetupModal";
import NotificationPermissionModal from "./components/onboarding/NotificationPermissionModal";
import AdminNotificationBanner from "./components/notifications/AdminNotificationBanner";
import TicketNotificationBanner from "./components/notifications/TicketNotificationBanner";
import {
  getLocalSessionId,
  clearLocalSessionId
} from "@/lib/singleDeviceSession";

const EventsPage = lazy(() => import("./pages/EventsPage"));
const AccountPage = lazy(() => import("./pages/AccountPage.jsx"));
const TicketsPage = lazy(() => import("./pages/TicketsPage"));
const TicketDetailPage = lazy(() => import("./pages/TicketDetailPage.jsx"));
const CreateTicketPage = lazy(() => import("./pages/CreateTicketPage.jsx"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const SharedTicketPage = lazy(() => import("./pages/SharedTicketPage"));
const TransferPage = lazy(() => import("./pages/TransferPage"));
const ManageTransferPage = lazy(() => import("./pages/ManageTransferPage"));
const LoginPage = lazy(() => import("./pages/Login"));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
  </div>
);

function LoginGate({ navigateToLogin }) {
  useEffect(() => {
    navigateToLogin();
  }, [navigateToLogin]);

  return <PageLoader />;
}

function useDarkMode() {
  useEffect(() => {
    const apply = (dark) => {
      document.documentElement.classList.toggle("dark", dark);
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);
    mq.addEventListener("change", (e) => apply(e.matches));

    return () => mq.removeEventListener("change", (e) => apply(e.matches));
  }, []);
}

const AuthenticatedApp = () => {
  useDarkMode();

  const [splashDone, setSplashDone] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [deviceVerified, setDeviceVerified] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showNameSetup, setShowNameSetup] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    user,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
    isAuthenticated,
    logout
  } = useAuth();

  const email = user?.email?.toLowerCase().trim();

  const handleLogout = useCallback(async () => {
    if (email) {
      clearLocalSessionId(email);
      localStorage.removeItem(`tk_device_${email}`);
      localStorage.removeItem(`tk_device_${email}_permanent`);
    }

    await logout();
  }, [email, logout]);

  // Check Supabase account, administrator status, profile,
  // approval, subscription and device verification.
  useEffect(() => {
    if (
      !splashDone ||
      isLoadingAuth ||
      isLoadingPublicSettings ||
      authError ||
      !isAuthenticated ||
      !user?.email
    ) {
      return;
    }

    let cancelled = false;

    async function checkStatus() {
      setCheckingApproval(true);
      setSubscriptionExpired(false);
      setApprovalStatus(null);
      setDeviceVerified(false);
      setAuthUser(user);

      try {
        const normalizedEmail = user.email.toLowerCase().trim();

        // Administrator check
        const { data: adminResult, error: adminError } =
          await supabase.rpc("is_app_admin");

        if (adminError) throw adminError;

        if (cancelled) return;

        const admin = adminResult === true;
        setIsAdmin(admin);

        if (admin) {
          setApprovalStatus("approved");
          setDeviceVerified(true);
          setCheckingApproval(false);
          return;
        }

        // Load the user's profile
        const { data: profile, error: profileError } = await supabase
          .from("User Profile")
          .select(
            "id, user_email, first_name, last_name, uid, active_session_id, notifications_enabled"
          )
          .eq("user_email", normalizedEmail)
          .maybeSingle();

        if (profileError) throw profileError;

        if (cancelled) return;

        if (!profile) {
          setApprovalStatus("pending");
          setCheckingApproval(false);
          return;
        }

        // Check approval
        const { data: approval, error: approvalError } = await supabase
          .from("User approval")
          .select("status")
          .eq("user_email", normalizedEmail)
          .maybeSingle();

        if (approvalError) throw approvalError;

        if (cancelled) return;

        const status = approval?.status?.toLowerCase() || "pending";
        setApprovalStatus(status);

        // Check the user's subscription
        const { data: subscriptions, error: subscriptionError } =
          await supabase
            .from("Subscription")
            .select("duration, end_date, status")
            .eq("user_email", normalizedEmail);

        if (subscriptionError) throw subscriptionError;

        if (cancelled) return;

        const now = new Date();

        const activeSubscription = (subscriptions || []).find((sub) => {
          if (sub.status?.toLowerCase() !== "active") return false;

          if (sub.duration?.toLowerCase() === "lifetime") {
            return true;
          }

          return sub.end_date && new Date(sub.end_date) > now;
        });

        if (!activeSubscription && (subscriptions || []).length > 0) {
          setSubscriptionExpired(true);
          setCheckingApproval(false);
          return;
        }

        if (activeSubscription) {
          if (activeSubscription.duration?.toLowerCase() === "lifetime") {
            setDaysRemaining(null);
          } else {
            const days = Math.max(
              0,
              Math.ceil(
                (new Date(activeSubscription.end_date) - now) /
                  (1000 * 60 * 60 * 24)
              )
            );
            setDaysRemaining(days);
          }
        }

        // Check if the current device has already been verified.
        const localSessionId = getLocalSessionId(normalizedEmail);
        const remoteSessionId = profile.active_session_id;

        if (
          localSessionId &&
          remoteSessionId &&
          localSessionId === remoteSessionId
        ) {
          setDeviceVerified(true);
        } else {
          setDeviceVerified(false);
        }

        // Check whether the user needs to enter their name.
        if (!profile.first_name) {
          setShowNameSetup(true);
        } else if (!localStorage.getItem("notif_asked")) {
          setShowNotifPrompt(true);
        }

        // Automatically claim accepted shared tickets.
        if (status === "approved") {
          const { error: claimError } = await supabase.rpc(
            "claim_my_shared_tickets"
          );

          if (claimError) {
            console.error("Shared ticket claiming failed:", claimError);
          }
        }

        setCheckingApproval(false);
      } catch (error) {
        console.error("Account status check failed:", error);

        if (!cancelled) {
          setCheckingApproval(false);
        }
      }
    }

    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [
    splashDone,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    isAuthenticated,
    user
  ]);

  // Single-device protection.
  // A different session ID means another device has taken over.
  useEffect(() => {
    if (!authUser?.email || isAdmin || !deviceVerified) return;

    const normalizedEmail = authUser.email.toLowerCase().trim();

    const handleKickOut = async () => {
      clearLocalSessionId(normalizedEmail);
      localStorage.removeItem(`tk_device_${normalizedEmail}`);
      localStorage.removeItem(`tk_device_${normalizedEmail}_permanent`);
      await logout();
    };

    let kickedOut = false;

    const verifyCurrentDeviceSession = async () => {
      if (kickedOut) return;

      const localSid = getLocalSessionId(normalizedEmail);
      if (!localSid) return;

      const { data: profile, error } = await supabase
        .from("User Profile")
        .select("active_session_id")
        .eq("user_email", normalizedEmail)
        .maybeSingle();

      if (error) {
        console.error("Device session check failed:", error);
        return;
      }

      if (
        profile?.active_session_id &&
        profile.active_session_id !== localSid
      ) {
        kickedOut = true;
        await handleKickOut();
      }
    };

    const channel = supabase
      .channel(`device-session-${normalizedEmail}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "User Profile",
          filter: `user_email=eq.${normalizedEmail}`
        },
        (payload) => {
          const localSid = getLocalSessionId(normalizedEmail);
          const remoteSid = payload.new?.active_session_id;

          if (localSid && remoteSid && remoteSid !== localSid) {
            kickedOut = true;
            handleKickOut();
          }
        }
      )
      .subscribe();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        verifyCurrentDeviceSession();
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        verifyCurrentDeviceSession();
      }
    }, 10000);

    window.addEventListener("focus", verifyCurrentDeviceSession);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener("focus", verifyCurrentDeviceSession);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [authUser, isAdmin, deviceVerified, logout]);

  const refreshApproval = async () => {
    if (!email) return;

    const { data, error } = await supabase
      .from("User approval")
      .select("status")
      .eq("user_email", email)
      .maybeSingle();

    if (error) {
      console.error("Approval refresh failed:", error);
      return;
    }

    if (data?.status) {
      setApprovalStatus(data.status.toLowerCase());
    }
  };

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <PageLoader />;
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  // Public access: visitors can view events without logging in.
  if (!isAuthenticated && !authError) {
    return (
      <>
        <InstallPrompt />
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<PageLoader />}>
                  <EventsPage />
                </Suspense>
              }
            />
            <Route path="/account" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/tickets" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/subscriptions" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/create-ticket" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/profile" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/help" element={<LoginGate navigateToLogin={navigateToLogin} />} />
          </Route>
          <Route path="/ticket-detail/:id" element={<LoginGate navigateToLogin={navigateToLogin} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </>
    );
  }

  if (checkingApproval || !authUser) {
    return <PageLoader />;
  }

  if (approvalStatus === "rejected") {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">
          Your registration has been declined. Please contact admin if you believe this is an error.
        </p>
        <a
          href="https://wa.me/2347026855490"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
          style={{ backgroundColor: "#25d366" }}
        >
          Contact Admin on WhatsApp
        </a>
        <button
          onClick={handleLogout}
          className="w-full max-w-xs py-4 rounded-xl font-bold border-2 bg-white cursor-pointer"
          style={{ color: "#003057", borderColor: "#003057" }}
        >
          Log Out
        </button>
      </div>
    );
  }

  if (approvalStatus === "pending") {
    return <WaitingApproval user={authUser} onRefresh={refreshApproval} />;
  }

  if (subscriptionExpired) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Subscription Expired</h2>
        <p className="text-gray-500 mb-6">
          Your subscription has expired. Please contact admin to renew your access.
        </p>
        <a
          href="https://wa.me/2347026855490"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
          style={{ backgroundColor: "#25d366" }}
        >
          Contact Admin on WhatsApp
        </a>
        <button
          onClick={handleLogout}
          className="w-full max-w-xs py-4 rounded-xl font-bold border-2 bg-white cursor-pointer"
        >
          Log Out
        </button>
      </div>
    );
  }

  if (!deviceVerified && !isAdmin) {
    return (
      <DeviceCodeVerification
        user={authUser}
        onVerified={() => setDeviceVerified(true)}
      />
    );
  }

  const handleNameSetup = async (firstName, lastName) => {
    if (!authUser) return;

    const { data, error } = await supabase.rpc("update_my_profile", {
      p_first_name: firstName,
      p_last_name: lastName,
      p_notifications_enabled: null
    });

    if (error || data !== true) {
      console.error("Profile update failed:", error);
      return;
    }

    await supabase.auth.updateUser({
      data: {
        display_name: `${firstName} ${lastName}`
      }
    });

    setShowNameSetup(false);

    if (!localStorage.getItem("notif_asked")) {
      setShowNotifPrompt(true);
    }
  };

  const handleNotifAllow = async () => {
    localStorage.setItem("notif_asked", "1");
    setShowNotifPrompt(false);

    if ("Notification" in window) {
      await Notification.requestPermission();
    }

    const { error } = await supabase.rpc("update_my_profile", {
      p_first_name: null,
      p_last_name: null,
      p_notifications_enabled: true
    });

    if (error) {
      console.error("Notification preference update failed:", error);
    }
  };

  const handleNotifSkip = () => {
    localStorage.setItem("notif_asked", "1");
    setShowNotifPrompt(false);
  };

  return (
    <>
      {showNameSetup && (
        <NameSetupModal onComplete={handleNameSetup} />
      )}

      {showNotifPrompt && !showNameSetup && (
        <NotificationPermissionModal
          onAllow={handleNotifAllow}
          onSkip={handleNotifSkip}
        />
      )}

      {authUser && (
        <AdminNotificationBanner userEmail={authUser.email} />
      )}

      {authUser && (
        <TicketNotificationBanner userEmail={authUser.email} />
      )}

      <InstallPrompt />

      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <EventsPage />
              </Suspense>
            }
          />
          <Route path="/account" element={<Suspense fallback={<PageLoader />}><AccountPage /></Suspense>} />
          <Route path="/tickets" element={<Suspense fallback={<PageLoader />}><TicketsPage /></Suspense>} />
          <Route path="/subscriptions" element={<Suspense fallback={<PageLoader />}><SubscriptionPage /></Suspense>} />
          <Route path="/create-ticket" element={<Suspense fallback={<PageLoader />}><CreateTicketPage /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
          <Route path="/help" element={<Suspense fallback={<PageLoader />}><HelpPage /></Suspense>} />
        </Route>

        <Route
          path="/ticket-detail/:id"
          element={<Suspense fallback={<PageLoader />}><TicketDetailPage /></Suspense>}
        />

        <Route
          path="/manage-transfer/:id"
          element={<Suspense fallback={<PageLoader />}><ManageTransferPage /></Suspense>}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

function AppShell() {
  const location = useLocation();

  if (location.pathname.startsWith("/shared-ticket")) {
    return (
      <Routes>
        <Route
          path="/shared-ticket/:token/*"
          element={<Suspense fallback={<PageLoader />}><SharedTicketPage /></Suspense>}
        />
      </Routes>
    );
  }

  if (location.pathname.startsWith("/transfer/")) {
    return (
      <Routes>
        <Route
          path="/transfer/:token"
          element={<Suspense fallback={<PageLoader />}><TransferPage /></Suspense>}
        />
      </Routes>
    );
  }

  if (location.pathname === "/login") {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    );
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppShell />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;