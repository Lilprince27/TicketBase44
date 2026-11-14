import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';

import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const updateAuthState = useCallback((currentUser) => {
    setUser(currentUser);
    setIsAuthenticated(!!currentUser);
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
    setAuthChecked(true);
  }, []);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      updateAuthState(null);
      setAuthError({
        type: 'auth_required',
        message: error.message
      });
      return null;
    }

    updateAuthState(data.user);
    return data.user;
  }, [updateAuthState]);

  const checkAppState = useCallback(async () => {
    setAppPublicSettings(null);
    setIsLoadingPublicSettings(false);
    return checkUserAuth();
  }, [checkUserAuth]);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        updateAuthState(session?.user ?? null);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setAuthError({
          type: 'unknown',
          message: error.message
        });
        updateAuthState(null);
        return;
      }

      updateAuthState(data.session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const logout = async (shouldRedirect = true) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError({
        type: 'unknown',
        message: error.message
      });
      return;
    }

    updateAuthState(null);

    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authChecked,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        checkUserAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};