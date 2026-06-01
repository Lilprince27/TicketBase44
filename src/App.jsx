import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import SplashScreen from './components/SplashScreen';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import WaitingApproval from './components/WaitingApproval';
import DeviceCodeVerification from './components/DeviceCodeVerification';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import NameSetupModal from './components/onboarding/NameSetupModal';
import NotificationPermissionModal from './components/onboarding/NotificationPermissionModal';
import AdminNotificationBanner from './components/notifications/AdminNotificationBanner';
import EventsPage from './pages/EventsPage';
import AccountPage from './pages/AccountPage.jsx';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import CreateTicketPage from './pages/CreateTicketPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';

const AuthenticatedApp = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [deviceVerified, setDeviceVerified] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showNameSetup, setShowNameSetup] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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
          await base44.entities.UserProfile.create({ user_email: me.email, uid, notifications_enabled: false });
          setShowNameSetup(true);
        } else if (!profiles[0].first_name) {
          setShowNameSetup(true);
        } else {
          // Check if notification prompt has been shown
          const notifAsked = localStorage.getItem("notif_asked");
          if (!notifAsked) setShowNotifPrompt(true);
        }
        // Check subscription expiry
        const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: 'active' });
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

  if (checkingApproval) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (approvalStatus === 'pending') {
    return <WaitingApproval user={authUser} onRefresh={refreshApproval} />;
  }

  if (subscriptionExpired) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Subscription Expired</h2>
        <p className="text-gray-500 mb-6">Your subscription has expired. Please contact admin to renew your access.</p>
        <a href="https://t.me/ApfMF9J1DiM2OWQ0" target="_blank" rel="noopener noreferrer"
          className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
          style={{ backgroundColor: "#0088cc" }}>
          Contact Admin on Telegram
        </a>
        <button onClick={() => base44.auth.logout()}
          className="w-full max-w-xs py-4 rounded-xl font-bold border-2 bg-white cursor-pointer"
          style={{ color: "#003057", borderColor: "#003057" }}>
          Log Out
        </button>
      </div>
    );
  }

  if (authUser && !deviceVerified) {
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
    <InstallPrompt />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EventsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/ticket-detail/:id" element={<TicketDetailPage />} />
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App