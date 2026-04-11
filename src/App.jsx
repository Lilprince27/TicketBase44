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
import EventsPage from './pages/EventsPage';
import AccountPage from './pages/AccountPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import CreateTicketPage from './pages/CreateTicketPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';

const AuthenticatedApp = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [deviceVerified, setDeviceVerified] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(false);
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
        const verified = localStorage.getItem(`tk_device_${me.email}`) === 'verified';
        setDeviceVerified(verified);
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

  if (authUser && !deviceVerified) {
    return <DeviceCodeVerification user={authUser} onVerified={() => setDeviceVerified(true)} />;
  }

  return (
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