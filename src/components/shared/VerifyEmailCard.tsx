import { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Props {
  email?: string;
}

export const VerifyEmailCard = ({ email = '' }: Props) => {
  const { sendVerificationOtp, verifyEmailOtp, updateUser } = useAuth();
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sentOnce, setSentOnce] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const handleSend = async () => {
    if (!email) {
      toast({
        title: 'Email missing',
        description: 'Add an email to send a verification code.',
        variant: 'destructive',
      });
      return;
    }
    if (cooldown > 0 || isSending) return;
    setIsSending(true);
    try {
      const { error } = await sendVerificationOtp(email);
      if (error) throw error;
      setCooldown(60);
      setSentOnce(true);
      toast({
        title: 'Code sent',
        description: `Check ${email} for the verification code.`,
      });
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send code',
        variant: 'destructive',
      });
      setCooldown(10);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      toast({
        title: 'Email missing',
        description: 'Add an email to verify.',
        variant: 'destructive',
      });
      return;
    }
    if (!otp || otp.length < 6) {
      toast({
        title: 'Invalid code',
        description: 'Enter the 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await verifyEmailOtp(email, otp);
      if (error) throw error;
      await updateUser({ isVerified: true });
      toast({
        title: 'Email verified',
        description: 'Your profile is now verified.',
      });
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      toast({
        title: 'Verification failed',
        description: error.message || 'Invalid code',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <Mail className="w-5 h-5 text-primary mt-1" />
        <div>
          <h3 className="font-semibold">Verify your email</h3>
          <p className="text-sm text-muted-foreground">Send a code to your email and verify to complete your profile.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Button onClick={handleSend} disabled={isSending || cooldown > 0} className="gap-2">
          {isSending && <Loader2 className="w-4 h-4 animate-spin" />}
          {cooldown > 0 ? `Resend in ${cooldown}s` : sentOnce ? 'Resend Code' : 'Send Code'}
        </Button>
        <div className="flex-1">
          <Input
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center tracking-[0.5em] font-semibold"
          />
        </div>
        <Button onClick={handleVerify} disabled={isVerifying} variant="secondary" className="gap-2">
          {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
          Verify
        </Button>
      </div>

      {!sentOnce && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>We’ll send a code to {email || 'your email'}.</span>
        </div>
      )}
      {sentOnce && (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4" />
          <span>Code sent. Enter it above to verify.</span>
        </div>
      )}
    </div>
  );
};
