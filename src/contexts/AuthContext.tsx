import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isVerified?: boolean;
  profileCompletion?: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUpWithPassword: (email: string, password: string, role: UserRole, name?: string) => Promise<{ error: any }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  sendVerificationOtp: (email: string) => Promise<{ error: any }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: any }>;
  sendPasswordResetOtp: (email: string) => Promise<{ error: any }>;
  resetPasswordWithOtp: (email: string, token: string, newPassword: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    // 1. Try to fetch existing profile (admin included)
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    // 2. If missing, try to create it (resilience for trigger failure)
    if (!data && (error?.code === 'PGRST116' || error === null)) {
      const { data: newData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || '',
          role: supabaseUser.user_metadata?.role || 'customer',
        })
        .select()
        .maybeSingle();

      if (!insertError && newData) {
        data = newData;
      } else if (insertError) {
        console.error('Manual profile creation failed:', insertError);
      }
    }

    if (data) {
      setUser({
        id: data.id,
        name: data.name || '',
        email: data.email,
        phone: data.phone || '',
        role: data.role as UserRole,
        isVerified: data.is_verified,
        profileCompletion: data.profile_completion,
      });
    }
  };

  const signInWithOtp = async (email: string, role: UserRole, name?: string) => {
    // This function is no longer used - kept for compatibility
    return { error: null };
  };

  const signUpWithPassword = async (email: string, password: string, role: UserRole, name?: string) => {
    try {
      console.log('Attempting to sign up with password:', email);
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name,
          },
        },
      });
      
      if (response.error) {
        console.error('Signup Error:', {
          message: response.error.message,
          status: response.error.status,
          code: response.error.code,
        });
      } else {
        console.log('Signup successful');
      }
      
      return response;
    } catch (error: any) {
      console.error('Signup Exception:', error);
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with password:', email);
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        console.error('Signin Error:', response.error);
      } else {
        console.log('Signin successful');
      }
      return response;
    } catch (error: any) {
      console.error('Signin Exception:', error);
      throw error;
    }
  };

  const sendVerificationOtp = async (email: string) => {
    try {
      console.log('Sending verification OTP to:', email);
      // Use email OTP with shouldCreateUser: false to send OTP to existing unverified user
      const response = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create new user, just send OTP
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (response.error) {
        console.error('Verification OTP Error:', response.error);
      } else {
        console.log('Verification OTP sent successfully');
      }
      
      return response;
    } catch (error: any) {
      console.error('Verification OTP Exception:', error);
      throw error;
    }
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    try {
      console.log('Verifying email OTP:', email);
      const response = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      
      if (response.error) {
        console.error('Email Verification Error:', response.error);
      } else {
        console.log('Email verified successfully');
      }
      
      return response;
    } catch (error: any) {
      console.error('Email Verification Exception:', error);
      throw error;
    }
  };

  const sendPasswordResetOtp = async (email: string) => {
    try {
      console.log('Sending password reset OTP to:', email);
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (response.error) {
        console.error('Password Reset OTP Error:', response.error);
      } else {
        console.log('Password reset OTP sent successfully');
      }
      
      return response;
    } catch (error: any) {
      console.error('Password Reset OTP Exception:', error);
      throw error;
    }
  };

  const resetPasswordWithOtp = async (email: string, token: string, newPassword: string) => {
    try {
      console.log('Resetting password with OTP:', email);
      // First verify the OTP with type 'recovery' (essential for password resets)
      const verifyResponse = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });
      
      if (verifyResponse.error) {
        console.error('Recovery OTP Verification Error:', verifyResponse.error);
        return verifyResponse;
      }
      
      // Then update the password
      const updateResponse = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateResponse.error) {
        console.error('Password Update Error:', updateResponse.error);
      } else {
        console.log('Password reset successfully');
      }
      
      return updateResponse;
    } catch (error: any) {
      console.error('Password Reset Exception:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        profile_completion: data.profileCompletion,
        is_verified: data.isVerified,
      })
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        signUpWithPassword,
        signInWithPassword,
        sendVerificationOtp,
        verifyEmailOtp,
        sendPasswordResetOtp,
        resetPasswordWithOtp,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
