import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  LogOut,
  MessageCircle,
  Car,
  ChevronRight,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProfileCompletion } from '@/components/ProfileCompletion';
import { VerifyEmailCard } from '@/components/shared/VerifyEmailCard';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    defaultPickup: '',
    preferredService: '',
  });

  useEffect(() => {
    // Check if profile is complete
    if (user && (!user.phone || user.profileCompletion === 0)) {
      setShowProfileCompletion(true);
    } else {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out successfully" });
  };

  const handleSaveProfile = async () => {
    await updateUser({ name: profile.name, email: profile.email, phone: profile.phone });
    toast({ title: "Profile updated successfully" });
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (showProfileCompletion) {
    return <ProfileCompletion onComplete={() => {
      setShowProfileCompletion(false);
      fetchBookings();
    }} />;
  }

  if (!user) {
    return null;
  }

  const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader2 },
    assigned: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Car },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Car },
    completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
  };

  return (
    <Layout hideFooter>
      <section className="py-8 md:py-12 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="font-display font-bold text-2xl md:text-3xl">
                  Welcome, {profile.name || 'Customer'}!
                </h1>
                <p className="text-muted-foreground">Manage your bookings and profile</p>
              </div>
              <div className="flex gap-3">
                <Link to="/booking">
                  <Button className="gap-2">
                    <Car className="w-4 h-4" />
                    Book Driver
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            {!user.isVerified && (
              <VerifyEmailCard email={user.email} />
            )}

            <div className="flex gap-2 mb-8 p-1 bg-secondary rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'bookings'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'profile'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Profile
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </div>
                ) : bookings.length > 0 ? (
                  bookings.map((booking) => {
                  const statusConfig = statusColors[booking.status] || statusColors.pending;
                  const StatusIcon = statusConfig?.icon || AlertCircle;

                  return (
                    <div
                      key={booking.id}
                      className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{booking.service}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                              <StatusIcon className={`w-3 h-3 ${booking.status === 'pending' ? 'animate-spin' : ''}`} />
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.pickup}</span>
                              {booking.destination && (
                                <>
                                  <ChevronRight className="w-4 h-4" />
                                  <span>{booking.destination}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </span>
                            </div>
                            {booking.driver && (
                              <div className="flex items-center gap-2 text-foreground">
                                <User className="w-4 h-4" />
                                <span>Driver: {booking.driver}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/917604988481?text=${encodeURIComponent(`Query about booking #${booking.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Support
                          </Button>
                        </a>
                      </div>
                    </div>
                  );
                })) : (
                  <div className="text-center py-12">
                    <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No bookings yet</p>
                    <Button className="mt-4" asChild>
                      <Link to="/booking">Book Your First Driver</Link>
                    </Button>
                  </div>
                )}

                {bookings.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-6">Book your first driver today!</p>
                    <Link to="/booking">
                      <Button>Book a Driver</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 md:p-8"
              >
                <h2 className="font-display font-semibold text-xl mb-6">Profile Details</h2>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-2"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-2"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">Phone number cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-2"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultPickup">Default Pickup Location</Label>
                    <Input
                      id="defaultPickup"
                      value={profile.defaultPickup}
                      onChange={(e) => setProfile(prev => ({ ...prev, defaultPickup: e.target.value }))}
                      className="mt-2"
                      placeholder="Your usual pickup address"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} size="lg">
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Quick WhatsApp Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-primary/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-primary" />
                <span className="font-medium">Need help? Chat with us on WhatsApp</span>
              </div>
              <a
                href="https://wa.me/917604988481"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Support
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CustomerDashboard;
