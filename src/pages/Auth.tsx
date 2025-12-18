import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight,
  Shield
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'role' | 'credentials' | 'otp'>('role');
  
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    otp: '',
  });

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('credentials');
  };

  const handleSendOTP = () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "OTP Sent!",
      description: `OTP sent to +91 ${formData.phone}`,
    });
    setStep('otp');
  };

  const handleLogin = () => {
    if (authMethod === 'phone' && formData.otp !== '123456') {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP. (Demo: 123456)",
        variant: "destructive",
      });
      return;
    }
    
    login(formData.phone || formData.email, role);
    
    toast({
      title: "Welcome!",
      description: `Successfully logged in as ${role}.`,
    });
    
    if (role === 'driver') {
      navigate('/driver/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const handleEmailLogin = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    login(formData.email, role);
    
    toast({
      title: "Welcome!",
      description: `Successfully logged in as ${role}.`,
    });
    
    if (role === 'driver') {
      navigate('/driver/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

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
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary-foreground" />
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
                        {role === 'customer' ? 'Customer' : 'Driver'} {mode === 'login' ? 'Login' : 'Signup'}
                      </span>
                    </div>

                    {/* Auth Method Toggle */}
                    <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                      <button
                        onClick={() => setAuthMethod('phone')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          authMethod === 'phone'
                            ? 'bg-background shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Phone + OTP
                      </button>
                      <button
                        onClick={() => setAuthMethod('email')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          authMethod === 'email'
                            ? 'bg-background shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Email
                      </button>
                    </div>

                    {authMethod === 'phone' ? (
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            +91
                          </span>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter 10-digit number"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              phone: e.target.value.replace(/\D/g, '').slice(0, 10) 
                            }))}
                            className="pl-12"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                      </>
                    )}

                    <Button 
                      onClick={authMethod === 'phone' ? handleSendOTP : handleEmailLogin}
                      className="w-full"
                      size="lg"
                    >
                      {authMethod === 'phone' ? 'Send OTP' : (mode === 'login' ? 'Login' : 'Create Account')}
                    </Button>
                  </motion.div>
                )}

                {/* Step 3: OTP Verification */}
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
                        onClick={() => setStep('credentials')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back
                      </button>
                    </div>

                    <div className="text-center mb-6">
                      <Phone className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-lg">Enter OTP</h3>
                      <p className="text-muted-foreground text-sm">
                        We sent a code to +91 {formData.phone}
                      </p>
                    </div>

                    <div>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          otp: e.target.value.replace(/\D/g, '').slice(0, 6) 
                        }))}
                        className="text-center text-2xl tracking-widest"
                        maxLength={6}
                      />
                      <p className="text-center text-muted-foreground text-xs mt-2">
                        Demo OTP: 123456
                      </p>
                    </div>

                    <Button onClick={handleLogin} className="w-full" size="lg">
                      Verify & Continue
                    </Button>

                    <button className="w-full text-center text-sm text-muted-foreground hover:text-primary">
                      Didn't receive OTP? Resend
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
