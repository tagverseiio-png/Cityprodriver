import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Camera,
  Home,
  Briefcase,
  Shield
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProfileCompletion } from '@/components/ProfileCompletion';
import { VerifyEmailCard } from '@/components/shared/VerifyEmailCard';

const documentStatuses = {
  pending: { label: 'Pending', icon: Loader2, bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { label: 'Approved', icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { label: 'Rejected', icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-800' },
};

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'documents'>('dashboard');
  const [isOnline, setIsOnline] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [acceptingTripId, setAcceptingTripId] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    alternatePhone: '',
    dob: '',
    address: '',
    city: '',
    pincode: '',
    experience: '',
    vehicleTypes: [] as string[],
    serviceArea: 'both',
    workingHours: 'day',
  });

  const [documents, setDocuments] = useState({
    drivingLicense: { file: null as File | null, url: '', status: 'pending' },
    aadhaar: { file: null as File | null, url: '', status: 'pending' },
    pan: { file: null as File | null, url: '', status: 'pending' },
    photo: { file: null as File | null, url: '', status: 'pending' },
    accountDetails: { file: null as File | null, url: '', status: 'pending' },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [documentsVerified, setDocumentsVerified] = useState(false);

  useEffect(() => {
    // Check if profile is complete
    if (user && (!user.phone || user.profileCompletion === 0)) {
      setShowProfileCompletion(true);
    } else {
      fetchDocuments();
      fetchTrips();
    }
  }, [user]);

  // Redirect unauthenticated users safely after mount
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth');
    }
  }, [isAuthLoading, user, navigate]);

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('license_doc_url, aadhaar_doc_url, pan_doc_url, photo_url, account_details_doc_url, license_verified, aadhaar_verified, pan_verified, account_verified, documents_verified')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setDocumentsVerified(data.documents_verified || false);
        setDocuments({
          drivingLicense: { 
            file: null, 
            url: data.license_doc_url || '', 
            status: data.license_verified ? 'approved' : (data.license_doc_url ? 'pending' : 'pending')
          },
          aadhaar: { 
            file: null, 
            url: data.aadhaar_doc_url || '', 
            status: data.aadhaar_verified ? 'approved' : (data.aadhaar_doc_url ? 'pending' : 'pending')
          },
          pan: { 
            file: null, 
            url: data.pan_doc_url || '', 
            status: data.pan_verified ? 'approved' : (data.pan_doc_url ? 'pending' : 'pending')
          },
          photo: { 
            file: null, 
            url: data.photo_url || '', 
            status: data.photo_url ? 'approved' : 'pending'
          },
          accountDetails: { 
            file: null, 
            url: data.account_details_doc_url || '', 
            status: data.account_verified ? 'approved' : (data.account_details_doc_url ? 'pending' : 'pending')
          },
        });
      }
    } catch (error: any) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchTrips = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Show bookings assigned to the driver or unassigned (available) for verified drivers
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`driver_id.eq.${user.id},driver_id.is.null`)
        .in('status', ['pending', 'assigned', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast({
        title: "Error",
        description: "Failed to load trips",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTrip = async (tripId: string) => {
    if (!user) return;
    if (!documentsVerified) {
      toast({
        title: "Verification required",
        description: "Complete document verification to accept trips.",
        variant: "destructive",
      });
      return;
    }

    setAcceptingTripId(tripId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          driver_id: user.id,
          driver_name: user.name || 'Driver',
          status: 'assigned',
        })
        .eq('id', tripId)
        .is('driver_id', null)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: "Trip accepted",
        description: "You have been assigned to this trip.",
      });
      fetchTrips();
    } catch (error: any) {
      console.error('Error accepting trip:', error);
      toast({
        title: "Unable to accept",
        description: error.message || "Trip may have been taken by another driver.",
        variant: "destructive",
      });
    } finally {
      setAcceptingTripId(null);
    }
  };

  const profileCompletion = user?.profileCompletion || 0;

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    navigate('/');
  };

  const handleFileUpload = async (docType: keyof typeof documents, file: File) => {
    if (!user) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${docType}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('docs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(fileName);

      // Update profile with document URL
      const fieldMap: Record<string, string> = {
        drivingLicense: 'license_doc_url',
        aadhaar: 'aadhaar_doc_url',
        pan: 'pan_doc_url',
        photo: 'photo_url',
        accountDetails: 'account_details_doc_url',
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [fieldMap[docType]]: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setDocuments(prev => ({
        ...prev,
        [docType]: { file, url: publicUrl, status: 'pending' }
      }));

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully and is pending admin verification.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    await updateUser({ name: profile.name });
    toast({ title: "Profile updated successfully" });
  };

  if (isAuthLoading) {
    return (
      <Layout hideFooter>
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }
  
  if (!user) {
    return null;
  }

  if (showProfileCompletion) {
    return <ProfileCompletion onComplete={() => setShowProfileCompletion(false)} />;
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
                  Driver Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Upload your details once. Drive with confidence.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-start sm:justify-end">
                {/* Online Toggle */}
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2 w-full sm:w-auto">
                  <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                  <Switch
                    checked={isOnline}
                    onCheckedChange={setIsOnline}
                  />
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2 w-full sm:w-auto">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </motion.div>

            {/* Profile Completion Banner */}
            {!user.isVerified && (
              <VerifyEmailCard email={user.email} />
            )}

            {profileCompletion < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Your documents help us keep every trip safe and trusted.
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary sm:text-right">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-secondary rounded-lg w-fit max-w-full overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'profile', label: 'Profile' },
                { id: 'documents', label: 'Documents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Verification Status */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Verification Status
                  </h3>
                  {documentsVerified ? (
                    <div className="flex items-center gap-3 text-green-700 bg-green-50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>You're verified and ready to accept trips!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-yellow-700 bg-yellow-50 rounded-lg p-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <div>
                        <p className="font-medium">Documents Under Verification</p>
                        <p className="text-sm text-yellow-600">Please upload all required documents in the Documents tab. Admin will verify them soon.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assigned Trips - Only show if verified */}
                {documentsVerified ? (
                  <div className="space-y-6">
                    {/* Available Trips */}
                    <div>
                      <h3 className="font-semibold mb-4">Available Trips</h3>
                      {isLoading ? (
                        <div className="text-center py-8 bg-card border border-border rounded-xl">
                          <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                        </div>
                      ) : trips.filter((t) => !t.driver_id).length > 0 ? (
                        <div className="space-y-4">
                          {trips.filter((t) => !t.driver_id).map((trip) => (
                            <div key={trip.id} className="bg-card border border-border rounded-xl p-5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold">{trip.customer_name || 'Customer'}</h4>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {trip.car_type || trip.service_type || 'Driver Service'}
                                    </span>
                                  </div>
                                  <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{trip.pickup_location} → {trip.destination || 'Open trip'}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {trip.pickup_date ? new Date(trip.pickup_date).toLocaleDateString() : 'Date TBD'}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {trip.pickup_time || 'Time TBD'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                                  <Button
                                    size="sm"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => handleAcceptTrip(trip.id)}
                                    disabled={acceptingTripId === trip.id}
                                  >
                                    {acceptingTripId === trip.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                    Accept Trip
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-card border border-border rounded-xl">
                          <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No available trips right now.</p>
                        </div>
                      )}
                    </div>

                    {/* Assigned Trips */}
                    <div>
                      <h3 className="font-semibold mb-4">Assigned Trips</h3>
                      {isLoading ? (
                        <div className="text-center py-12 bg-card border border-border rounded-xl">
                          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading trips...</p>
                        </div>
                      ) : trips.filter((t) => t.driver_id === user.id).length > 0 ? (
                        <div className="space-y-4">
                          {trips.filter((t) => t.driver_id === user.id).map((trip) => (
                            <div
                              key={trip.id}
                              className="bg-card border border-border rounded-xl p-5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold">{trip.customer_name || 'Customer'}</h4>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {trip.car_type || trip.service_type || 'Driver Service'}
                                    </span>
                                  </div>
                                  <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{trip.pickup_location} → {trip.destination}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(trip.pickup_date).toLocaleDateString()}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {trip.pickup_time}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" className="gap-2 w-full sm:w-auto">
                                  <Phone className="w-4 h-4" />
                                  Call Customer
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-card border border-border rounded-xl">
                          <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-semibold text-lg mb-2">No trips assigned</h3>
                          <p className="text-muted-foreground">Accept an available trip to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Complete Document Verification</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload all required documents in the Documents tab to start receiving trip assignments.
                    </p>
                    <Button onClick={() => setActiveTab('documents')} variant="outline">
                      Go to Documents
                    </Button>
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
                <h2 className="font-display font-semibold text-xl mb-6">Driver Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Full Name (as per ID) *</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-2"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number *</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="altPhone">Alternate Number</Label>
                    <Input
                      id="altPhone"
                      value={profile.alternatePhone}
                      onChange={(e) => setProfile(prev => ({ ...prev, alternatePhone: e.target.value }))}
                      className="mt-2"
                      placeholder="Alternative contact"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dob}
                      onChange={(e) => setProfile(prev => ({ ...prev, dob: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-2"
                      placeholder="Your full address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                      className="mt-2"
                      placeholder="Your city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={profile.pincode}
                      onChange={(e) => setProfile(prev => ({ ...prev, pincode: e.target.value }))}
                      className="mt-2"
                      placeholder="6-digit pincode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Driving Experience *</Label>
                    <Select
                      value={profile.experience}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Vehicle Types Experienced *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Hatchback', 'Sedan', 'SUV', 'Traveller'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setProfile(prev => ({
                              ...prev,
                              vehicleTypes: prev.vehicleTypes.includes(type)
                                ? prev.vehicleTypes.filter(t => t !== type)
                                : [...prev.vehicleTypes, type]
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${profile.vehicleTypes.includes(type)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Service Area *</Label>
                    <Select
                      value={profile.serviceArea}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, serviceArea: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inside-city">Inside City Only</SelectItem>
                        <SelectItem value="outstation">Outstation Only</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Preferred Working Hours *</Label>
                    <Select
                      value={profile.workingHours}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, workingHours: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day Shift</SelectItem>
                        <SelectItem value="night">Night Shift</SelectItem>
                        <SelectItem value="24x7">24/7 Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} size="lg" className="mt-6">
                  Save Profile
                </Button>
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm">
                    <strong>Your documents help us keep every trip safe and trusted.</strong> Upload clear images for faster verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Driving License */}
                  <DocumentUploadCard
                    title="Driving License"
                    description="Upload a clear image of your valid driving license (Front & Back)."
                    icon={FileText}
                    status={documents.drivingLicense.status}
                    onUpload={(file) => handleFileUpload('drivingLicense', file)}
                    file={documents.drivingLicense.file}
                    url={documents.drivingLicense.url}
                    isUploading={isUploading}
                  />

                  {/* Aadhaar */}
                  <DocumentUploadCard
                    title="Aadhaar Card"
                    description="Upload your Aadhaar card (both sides)."
                    icon={FileText}
                    status={documents.aadhaar.status}
                    onUpload={(file) => handleFileUpload('aadhaar', file)}
                    file={documents.aadhaar.file}
                    url={documents.aadhaar.url}
                    isUploading={isUploading}
                  />

                  {/* PAN Card */}
                  <DocumentUploadCard
                    title="PAN Card"
                    description="Upload a clear image of your PAN card."
                    icon={FileText}
                    status={documents.pan.status}
                    onUpload={(file) => handleFileUpload('pan', file)}
                    file={documents.pan.file}
                    url={documents.pan.url}
                    isUploading={isUploading}
                  />

                  {/* Profile Photo */}
                  <DocumentUploadCard
                    title="Profile Photo"
                    description="Upload a recent passport-size photo."
                    icon={Camera}
                    status={documents.photo.status}
                    onUpload={(file) => handleFileUpload('photo', file)}
                    file={documents.photo.file}
                    url={documents.photo.url}
                    isUploading={isUploading}
                  />

                  {/* Account Details */}
                  <DocumentUploadCard
                    title="Bank Account Details"
                    description="Upload cancelled cheque or bank statement with account details."
                    icon={Briefcase}
                    status={documents.accountDetails.status}
                    onUpload={(file) => handleFileUpload('accountDetails', file)}
                    file={documents.accountDetails.file}
                    url={documents.accountDetails.url}
                    isUploading={isUploading}
                  />
                </div>
              </motion.div>
            )}

            {/* WhatsApp Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-primary/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-primary" />
                <span className="font-medium">Need help with registration?</span>
              </div>
              <a
                href="https://wa.me/917604988481?text=Hi, I need help with driver registration"
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

// Document Upload Card Component
interface DocumentUploadCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  onUpload: (file: File) => void;
  file: File | null;
  url?: string;
  isUploading?: boolean;
  optional?: boolean;
}

function DocumentUploadCard({ title, description, icon: Icon, status, onUpload, file, url, isUploading, optional }: DocumentUploadCardProps) {
  const statusConfig = documentStatuses[status as keyof typeof documentStatuses];
  const StatusIcon = statusConfig.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">{title}</h4>
            {optional && <span className="text-xs text-muted-foreground">Optional</span>}
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
          <StatusIcon className={`w-3 h-3 ${status === 'pending' || isUploading ? 'animate-spin' : ''}`} />
          {isUploading ? 'Uploading...' : statusConfig.label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {url || file ? (
        <div className="space-y-2">
          {url && (
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Document uploaded</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium hover:underline">
                View
              </a>
            </div>
          )}
          <label className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-center p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all">
              <span className="text-primary text-sm font-medium">Replace Document</span>
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">{isUploading ? 'Uploading...' : 'Click to upload'}</span>
          <span className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (max 5MB)</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}

      {status === 'rejected' && (
        <p className="text-sm text-red-600 mt-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Please re-upload clear documents for approval.
        </p>
      )}
    </div>
  );
}

export default DriverDashboard;
