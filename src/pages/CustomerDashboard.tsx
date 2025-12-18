import { useState } from 'react';
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

const mockBookings = [
  {
    id: '1',
    service: 'Hourly Driver',
    pickup: 'Andheri West, Mumbai',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'completed',
    driver: 'Rajesh Kumar',
  },
  {
    id: '2',
    service: 'Outstation Driver',
    pickup: 'Mumbai',
    destination: 'Pune',
    date: '2024-01-25',
    time: '6:00 AM',
    status: 'assigned',
    driver: 'Amit Singh',
  },
  {
    id: '3',
    service: 'Daily Driver',
    pickup: 'Bandra, Mumbai',
    date: '2024-01-28',
    time: '9:00 AM',
    status: 'pending',
    driver: null,
  },
];

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader2 },
  assigned: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Car },
  completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings');
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    defaultPickup: '',
    preferredService: '',
  });

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser({ name: profile.name, email: profile.email });
    toast({ title: "Profile updated successfully" });
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

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
            <div className="flex gap-2 mb-8 p-1 bg-secondary rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'profile'
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
                {mockBookings.map((booking) => {
                  const statusConfig = statusColors[booking.status as keyof typeof statusColors];
                  const StatusIcon = statusConfig.icon;
                  
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
                          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Query about booking #${booking.id}`)}`}
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
                })}

                {mockBookings.length === 0 && (
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
                href="https://wa.me/919876543210" 
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
