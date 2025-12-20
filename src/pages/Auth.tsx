import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  User,
  Mail,
  ArrowRight,
  Shield,
  Loader2,
  Clock,
  Lock
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Auth = () => {
  const navigate = useNavigate();
  const { signUpWithPassword, signInWithPassword, sendVerificationOtp, verifyEmailOtp, sendPasswordResetOtp, resetPasswordWithOtp, logout, user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [step, setStep] = useState<'role' | 'credentials' | 'password' | 'otp' | 'forgot-password' | 'reset-password'>('role');
  const [suppressRedirect, setSuppressRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const isRequesting = useRef(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user && !suppressRedirect) {
      if (user.role === 'driver') {
        navigate('/driver/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/customer/dashboard');
      }
    }
  }, [user, navigate, suppressRedirect]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    if (selectedRole === 'admin') {
      setMode('login');
    }
    setRole(selectedRole);
    setStep('credentials');
  };

  const handleSubmitCredentials = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRequesting.current) return;

    if (mode === 'signup' && !formData.name) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setStep('password');
  };

  const handleSubmitPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRequesting.current) return;
    
    if (!formData.password || formData.password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup') {
      // Create account with password and keep user signed in; verification handled in dashboard
      isRequesting.current = true;
      setIsLoading(true);
      try {
        // First, create the account with password
        const { data, error: signupError } = await signUpWithPassword(
          formData.email,
          formData.password,
          role,
          formData.name
        );

        if (signupError) throw signupError;
        // Allow redirect to dashboard; verification will be prompted there
        setSuppressRedirect(false);
        toast({
          title: "Account Created",
          description: "You're signed in. Please verify your email from the dashboard.",
        });
      } catch (error: any) {
        console.error('Signup Error:', error);
        toast({
          title: "Signup Failed",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        isRequesting.current = false;
      }
    } else {
      // For login, directly sign in
      isRequesting.current = true;
      setIsLoading(true);
      try {
        const { error } = await signInWithPassword(formData.email, formData.password);
        if (error) throw error;

        toast({
          title: "Welcome Back!",
          description: "You are now signed in.",
        });
      } catch (error: any) {
        console.error('Auth Error:', error);
        let errorMessage = error.message || "Failed to sign in";
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "Email or password is incorrect.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        isRequesting.current = false;
      }
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRequesting.current) return;
    if (!formData.otp || formData.otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    isRequesting.current = true;
    setIsLoading(true);
    try {
      // Verify the OTP code entered by user
      const { error: verifyError } = await verifyEmailOtp(formData.email, formData.otp);
      if (verifyError) throw verifyError;

      // OTP verified successfully - email is now confirmed
      toast({
        title: "Email Verified!",
        description: "Your account is now active. Signing you in...",
      });

      // Sign in the user with their password
      const { error: signinError } = await signInWithPassword(formData.email, formData.password);
      if (signinError) throw signinError;

      // Allow redirect now that verification succeeded
      setSuppressRedirect(false);
      // User will be redirected by useEffect watching 'user'
    } catch (error: any) {
      console.error('Verification Error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isRequesting.current = false;
    }
  };

  const handleResendOtp = async () => {
    if (isRequesting.current || cooldown > 0) return;
    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    isRequesting.current = true;
    setIsLoading(true);
    try {
      const { error } = await sendVerificationOtp(formData.email);
      if (error) throw error;

      toast({
        title: "Code Resent",
        description: `Check ${formData.email} for the new code`,
      });
      setCooldown(60);
    } catch (error: any) {
      console.error('Resend OTP Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
      setCooldown(10);
    } finally {
      setIsLoading(false);
      isRequesting.current = false;
    }
  };

  const handleSendPasswordResetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRequesting.current) return;
    if (cooldown > 0) {
      toast({
        title: "Please wait",
        description: `You can request another code in ${cooldown} seconds.`,
      });
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    isRequesting.current = true;
    setIsLoading(true);
    try {
      const { error } = await sendPasswordResetOtp(formData.email);
      if (error) throw error;

      toast({
        title: "Reset Email Sent!",
        description: `Check your email at ${formData.email} for the reset code`,
      });
      setCooldown(60);
      setStep('reset-password');
    } catch (error: any) {
      console.error('Password Reset Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
      setCooldown(10);
    } finally {
      setIsLoading(false);
      isRequesting.current = false;
    }
  };

  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRequesting.current) return;

    if (!formData.otp || formData.otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    isRequesting.current = true;
    setIsLoading(true);
    try {
      const { error } = await resetPasswordWithOtp(formData.email, formData.otp, formData.newPassword);
      if (error) throw error;

      toast({
        title: "Password Reset!",
        description: "Your password has been reset successfully.",
      });

      // Reset form and go back to login
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setStep('role');
      setMode('login');
    } catch (error: any) {
      console.error('Password Reset Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isRequesting.current = false;
    }
  };

  

  if (isAuthLoading) {
    return (
      <Layout hideFooter>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <section className="min-h-[calc(100vh-80px)] flex items-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex flex-col items-center gap-3 mb-6">
                <img src="/logoDark.jpeg" alt="City Pro Drivers" className="h-20 w-auto object-contain" />
                <div className="space-y-1 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">
                    Registered under Govt of India
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    MSME Registered | GST: 33ATBPP4186E1ZS
                  </p>
                </div>
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground">
                Safe Journeys Start with Verified Drivers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card"
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {step === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="font-semibold text-lg mb-4">
                      {mode === 'login' ? 'Login as' : 'Sign up as'}
                    </h2>

                    <button
                      onClick={() => handleRoleSelect('customer')}
                      className="w-full flex items-center gap-4 p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                        <User className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="font-semibold block">Login as Customer</span>
                        <span className="text-muted-foreground text-sm">Book drivers for your trips</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </button>

                    <button
                      onClick={() => handleRoleSelect('driver')}
                      className="w-full flex items-center gap-4 p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Car className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="font-semibold block">Login as Driver</span>
                        <span className="text-muted-foreground text-sm">Join our driver network</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </button>

                    {mode === 'login' && (
                      <button
                        onClick={() => handleRoleSelect('admin')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-dashed rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                          <Shield className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="font-semibold block">Admin Login</span>
                          <span className="text-muted-foreground text-sm">Access management console</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Credentials */}
                {step === 'credentials' && (
                  <motion.div
                    key="credentials"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep('role')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back
                      </button>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-sm">
                        {role === 'customer' ? 'Customer' : role === 'driver' ? 'Driver' : 'Admin'} {mode === 'login' ? 'Login' : 'Signup'}
                      </span>
                    </div>

                    <form onSubmit={handleSubmitCredentials} className="space-y-4">
                      {mode === 'signup' && (
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-2"
                            required
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-2"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Continue
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* Step 3: Set Password */}
                {step === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep('credentials')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back
                      </button>
                    </div>

                    <div className="text-center mb-6">
                      <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-lg">
                        {mode === 'login' ? 'Enter Your Password' : 'Set Your Password'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {mode === 'login' 
                          ? 'Sign in with your password' 
                          : 'Create a secure password for your account'}
                      </p>
                    </div>

                    <form onSubmit={handleSubmitPassword} className="space-y-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="At least 8 characters"
                          autoComplete="new-password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="mt-2"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
                      </div>

                      {mode === 'signup' && (
                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="mt-2"
                            required
                          />
                        </div>
                      )}

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {mode === 'login' ? 'Sign In' : 'Continue'}
                      </Button>

                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setStep('forgot-password');
                            setFormData(prev => ({ ...prev, email: formData.email }));
                          }}
                          className="w-full text-center text-sm text-primary hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* Step 3.5: Email OTP Verification (for signup) */}
                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep('password')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back
                      </button>
                    </div>

                    <div className="text-center mb-6">
                      <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-lg">Verify Your Email</h3>
                      <p className="text-muted-foreground text-sm">
                        Enter the code sent to {formData.email}
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                      <div>
                        <Input
                          type="text"
                          placeholder="000000"
                          value={formData.otp}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            otp: e.target.value.replace(/\D/g, '').slice(0, 6)
                          }))}
                          className="text-center text-3xl tracking-[1em] font-bold"
                          maxLength={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Verify Email
                      </Button>
                    </form>

                    <button
                      onClick={handleResendOtp}
                      disabled={isLoading || cooldown > 0}
                      className="w-full text-center text-sm text-muted-foreground hover:text-primary disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {cooldown > 0 ? (
                        <>Resend in {cooldown}s</>
                      ) : (
                        <>Didn't receive code? Resend</>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Step 4: Forgot Password */}
                {step === 'forgot-password' && (
                  <motion.div
                    key="forgot-password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep('password')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back
                      </button>
                    </div>

                    <div className="text-center mb-6">
                      <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-lg">Reset Your Password</h3>
                      <p className="text-muted-foreground text-sm">
                        Enter your email to receive a reset code
                      </p>
                    </div>

                    <form onSubmit={handleSendPasswordResetOtp} className="space-y-4">
                      <div>
                        <Label htmlFor="reset-email">Email Address</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-2"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || cooldown > 0}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {cooldown > 0 ? `Wait ${cooldown}s` : 'Send Reset Code'}
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* Step 5: Reset Password with OTP */}
                {step === 'reset-password' && (
                  <motion.div
                    key="reset-password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep('forgot-password')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back
                      </button>
                    </div>

                    <div className="text-center mb-6">
                      <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-lg">Create New Password</h3>
                      <p className="text-muted-foreground text-sm">
                        Enter the code from your email and set a new password
                      </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <Label htmlFor="reset-otp">Verification Code</Label>
                        <Input
                          id="reset-otp"
                          type="text"
                          placeholder="000000"
                          value={formData.otp}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            otp: e.target.value.replace(/\D/g, '').slice(0, 6)
                          }))}
                          className="text-center text-3xl tracking-[1em] font-bold mt-2"
                          maxLength={6}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="At least 8 characters"
                          value={formData.newPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="mt-2"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
                      </div>

                      <div>
                        <Label htmlFor="confirm-new-password">Confirm Password</Label>
                        <Input
                          id="confirm-new-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmNewPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                          className="mt-2"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Reset Password
                      </Button>
                    </form>

                    <button
                      onClick={() => handleSendPasswordResetOtp()}
                      disabled={isLoading || cooldown > 0}
                      className="w-full text-center text-sm text-muted-foreground hover:text-primary disabled:opacity-50"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Didn't receive code? Resend"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Login/Signup */}
              {step === 'role' && (
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <span className="text-muted-foreground">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <button
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-primary font-semibold hover:underline"
                  >
                    {mode === 'login' ? 'Sign up' : 'Login'}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Your data is secure with us</span>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
