import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import SplashScreen from './components/SplashScreen';
import { base44 } from '@/api/base44Client';
import WaitingApproval from './components/WaitingApproval.jsx';
import DeviceCodeVerification from './components/DeviceCodeVerification.jsx';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import NameSetupModal from './components/onboarding/NameSetupModal';
import NotificationPermissionModal from './components/onboarding/NotificationPermissionModal';
import AdminNotificationBanner from './components/notifications/AdminNotificationBanner';
import MaintenanceFeeScreen from './components/MaintenanceFeeScreen';
import MaintenanceReminderBanner from './components/notifications/MaintenanceReminderBanner';
import TicketNotificationBanner from './components/notifications/TicketNotificationBanner';

const EventsPage = lazy(() => import('./pages/EventsPage'));
const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage.jsx'));
const CreateTicketPage = lazy(() => import('./pages/CreateTicketPage.jsx'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SharedTicketPage = lazy(() => import('./pages/SharedTicketPage'));
const TransferPage = lazy(() => import('./pages/TransferPage'));
const LoginPage = lazy(() => import('./pages/Login'));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
  </div>
);

function LoginGate({ navigateToLogin }) {
  useEffect(() => {
    navigateToLogin();
  }, [navigateToLogin]);
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );
}

// Sync system dark mode to the <html> element
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
  const [maintenanceLocked, setMaintenanceLocked] = useState(false);
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (splashDone && !isLoadingAuth && !authError && !isLoadingPublicSettings) {
      async function checkStatus() {
        setCheckingApproval(true);
        const me = await base44.auth.me().catch(() => null);
        if (!me) { setCheckingApproval(false); return; }
        setAuthUser(me);
        if (me.role === 'admin') {
          setApprovalStatus('approved');
          setDeviceVerified(true);
          setCheckingApproval(false);
          return;
        }
        // Check if user needs name setup
        const profiles = await base44.entities.UserProfile.filter({ user_email: me.email }).catch(() => []);
        if (profiles.length === 0) {
          // Generate 21-digit UID
          const uid = "UID:" + Array.from({ length: 21 }, () => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]).join("");
          // Generate auth code for new user
          const prefix = me.email.slice(0, 3).toLowerCase().replace(/[^a-z0-9]/g, "x");
          const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
          let suffix = "";
          for (let i = 0; i < 12; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
          const authCode = `${prefix}:${suffix}`;
          await base44.entities.UserProfile.create({ user_email: me.email, uid, notifications_enabled: false, auth_code: authCode });
          setShowNameSetup(true);
          // New user - skip device verification (they're registering, not logging in)
          setDeviceVerified(true);
        } else if (!profiles[0].first_name) {
          setShowNameSetup(true);
          // Also generate auth code if missing
          if (!profiles[0].auth_code) {
            const prefix = me.email.slice(0, 3).toLowerCase().replace(/[^a-z0-9]/g, "x");
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            let suffix = "";
            for (let i = 0; i < 12; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
            const authCode = `${prefix}:${suffix}`;
            await base44.entities.UserProfile.update(profiles[0].id, { auth_code: authCode }).catch(() => {});
          }
        } else {
          // Check if notification prompt has been shown
          const notifAsked = localStorage.getItem("notif_asked");
          if (!notifAsked) setShowNotifPrompt(true);
        }
        // Check subscription expiry
        const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: 'active' });
        const lifetimeSub = subs.find(s => s.duration === 'lifetime');
        if (lifetimeSub) {
          // Check monthly maintenance approval
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          if (lifetimeSub.maintenance_approved_month !== currentMonth) {
            setMaintenanceLocked(true);
            setCheckingApproval(false);
            return;
          }
        }
        const activeSub = subs.find(s => s.duration === 'lifetime' || new Date(s.end_date) > new Date());
        if (!activeSub) {
          // Check if they ever had a subscription (expired)
          const allSubs = await base44.entities.Subscription.filter({ user_email: me.email });
          if (allSubs.length > 0) {
            setSubscriptionExpired(true);
            setCheckingApproval(false);
            return;
          }
        } else {
          const days = Math.max(0, Math.ceil((new Date(activeSub.end_date) - new Date()) / (1000 * 60 * 60 * 24)));
          setDaysRemaining(days);
        }
        const records = await base44.entities.UserApproval.filter({ user_email: me.email });
        if (records.length === 0) {
          await base44.entities.UserApproval.create({ user_email: me.email, full_name: me.full_name || me.email, status: 'pending' });
          setApprovalStatus('pending');
        } else {
          setApprovalStatus(records[0].status);
          // Auto-claim accepted shared tickets into the user's wallet
          if (records[0].status === 'approved') {
            try {
              const shares = await base44.entities.SharedTicket.filter({ accepted_by: me.email });
              for (const share of shares) {
                if (share.claimed_date) continue;
                const ticketData = JSON.parse(share.ticket_snapshot);
                await base44.entities.Ticket.create({
                  ...ticketData,
                  owner_email: me.email,
                });
                await base44.entities.SharedTicket.update(share.id, { claimed_date: new Date().toISOString() });
              }
            } catch (e) {}
          }
        }
        setCheckingApproval(false);
      }
      checkStatus();
    }
  }, [splashDone, isLoadingAuth, isLoadingPublicSettings, authError]);

  const refreshApproval = async () => {
    const me = await base44.auth.me().catch(() => null);
    if (!me) return;
    const records = await base44.entities.UserApproval.filter({ user_email: me.email });
    if (records.length > 0) setApprovalStatus(records[0].status);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // App is public — if user is not logged in, show Events only; gate other routes behind login
  if (!isAuthenticated && !authError) {
    return (
      <>
        <InstallPrompt />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><EventsPage /></Suspense>} />
            <Route path="/account" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/tickets" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/subscriptions" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/create-ticket" element={<LoginGate navigateToLogin={navigateToLogin} />} />
            <Route path="/profile" element={<LoginGate navigateToLogin={navigateToLogin} />} />
          </Route>
          <Route path="/ticket-detail/:id" element={<LoginGate navigateToLogin={navigateToLogin} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </>
    );
  }

  if (checkingApproval) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (maintenanceLocked) {
    return <MaintenanceFeeScreen />;
  }

  if (approvalStatus === 'rejected') {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">Your registration has been declined. Please contact admin if you believe this is an error.</p>
        <a href="https://wa.me/2347026855490" target="_blank" rel="noopener noreferrer"
          className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
          style={{ backgroundColor: "#25d366" }}>
          Contact Admin on WhatsApp
        </a>
        <button
          onClick={() => base44.auth.logout()}
          className="w-full max-w-xs py-4 rounded-xl font-bold border-2 bg-white cursor-pointer"
          style={{ color: "#003057", borderColor: "#003057" }}
        >
          Log Out
        </button>
      </div>
    );
  }

  if (approvalStatus === 'pending') {
    return <WaitingApproval user={authUser} onRefresh={refreshApproval} />;
  }

  if (subscriptionExpired) {
    // Auto-logout on subscription expiry — data is preserved, user can log back in after renewal
    base44.auth.logout();
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Subscription Expired</h2>
        <p className="text-gray-500 mb-6">Your subscription has expired. Please contact admin to renew your access.</p>
        <a href="https://wa.me/2347026855490" target="_blank" rel="noopener noreferrer"
          className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
          style={{ backgroundColor: "#25d366" }}>
          Contact Admin on WhatsApp
        </a>
        <a href="https://t.me/+2347026855490" target="_blank" rel="noopener noreferrer"
          className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
          style={{ backgroundColor: "#0088cc" }}>
          Contact Admin on Telegram
        </a>
      </div>
    );
  }

  if (authUser && !deviceVerified) {
    // Check permanent verification — only ask once ever, not on every login
    const isPermanentlyVerified =
      localStorage.getItem(`tk_device_${authUser.email}`) === "verified" ||
      localStorage.getItem(`tk_device_${authUser.email}_permanent`) === "true";
    if (isPermanentlyVerified) {
      setTimeout(() => setDeviceVerified(true), 0);
      return null;
    }
    return <DeviceCodeVerification user={authUser} onVerified={() => setDeviceVerified(true)} />;
  }

  const handleNameSetup = async (firstName, lastName) => {
    if (!authUser) return;
    const profiles = await base44.entities.UserProfile.filter({ user_email: authUser.email }).catch(() => []);
    if (profiles.length > 0) {
      await base44.entities.UserProfile.update(profiles[0].id, { first_name: firstName, last_name: lastName });
    }
    await base44.auth.updateMe({ display_name: `${firstName} ${lastName}` });
    setShowNameSetup(false);
    const notifAsked = localStorage.getItem("notif_asked");
    if (!notifAsked) setShowNotifPrompt(true);
  };

  const handleNotifAllow = async () => {
    localStorage.setItem("notif_asked", "1");
    setShowNotifPrompt(false);
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    if (authUser) {
      const profiles = await base44.entities.UserProfile.filter({ user_email: authUser.email }).catch(() => []);
      if (profiles.length > 0) {
        await base44.entities.UserProfile.update(profiles[0].id, { notifications_enabled: true });
      }
    }
  };

  const handleNotifSkip = () => {
    localStorage.setItem("notif_asked", "1");
    setShowNotifPrompt(false);
  };

  return (
    <>
    {showNameSetup && <NameSetupModal onComplete={handleNameSetup} />}
    {showNotifPrompt && !showNameSetup && <NotificationPermissionModal onAllow={handleNotifAllow} onSkip={handleNotifSkip} />}
    {authUser && <AdminNotificationBanner userEmail={authUser.email} />}
    {authUser && <MaintenanceReminderBanner userEmail={authUser.email} />}
    {authUser && <TicketNotificationBanner userEmail={authUser.email} />}
    <InstallPrompt />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><EventsPage /></Suspense>} />
        <Route path="/account" element={<Suspense fallback={<PageLoader />}><AccountPage /></Suspense>} />
        <Route path="/tickets" element={<Suspense fallback={<PageLoader />}><TicketsPage /></Suspense>} />
        <Route path="/subscriptions" element={<Suspense fallback={<PageLoader />}><SubscriptionPage /></Suspense>} />
        <Route path="/create-ticket" element={<Suspense fallback={<PageLoader />}><CreateTicketPage /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
      </Route>
      <Route path="/ticket-detail/:id" element={<Suspense fallback={<PageLoader />}><TicketDetailPage /></Suspense>} />
      
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
        <Route path="/shared-ticket/:token/*" element={<Suspense fallback={<PageLoader />}><SharedTicketPage /></Suspense>} />
      </Routes>
    );
  }
  if (location.pathname.startsWith("/transfer/")) {
    return (
      <Routes>
        <Route path="/transfer/:token" element={<Suspense fallback={<PageLoader />}><TransferPage /></Suspense>} />
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
  )
}

export default App