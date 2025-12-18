import { useState } from 'react';
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

const mockTrips = [
  {
    id: '1',
    customer: 'Rahul Sharma',
    pickup: 'Andheri West, Mumbai',
    destination: 'BKC, Mumbai',
    date: '2024-01-28',
    time: '9:00 AM',
    carType: 'Sedan',
    status: 'upcoming',
  },
  {
    id: '2',
    customer: 'Priya Patel',
    pickup: 'Mumbai',
    destination: 'Pune',
    date: '2024-01-30',
    time: '6:00 AM',
    carType: 'SUV',
    status: 'upcoming',
  },
];

const documentStatuses = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader2, label: 'Pending Verification' },
  verified: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Verified' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Rejected' },
};

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'documents'>('dashboard');
  const [isOnline, setIsOnline] = useState(false);
  
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
    drivingLicense: { file: null as File | null, status: 'pending' },
    aadhaar: { file: null as File | null, status: 'pending' },
    photo: { file: null as File | null, status: 'pending' },
    addressProof: { file: null as File | null, status: 'pending' },
  });

  const profileCompletion = 60; // Mock value

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    navigate('/');
  };

  const handleFileUpload = (docType: keyof typeof documents, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: { ...prev[docType], file }
    }));
    toast({ 
      title: "Document Uploaded", 
      description: "Your document is under verification." 
    });
  };

  const handleSaveProfile = () => {
    updateUser({ name: profile.name });
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
                  Driver Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Upload your details once. Drive with confidence.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Online Toggle */}
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
                  <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                  <Switch
                    checked={isOnline}
                    onCheckedChange={setIsOnline}
                  />
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </motion.div>

            {/* Profile Completion Banner */}
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
                  <span className="text-2xl font-bold text-primary">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-secondary rounded-lg w-fit overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'profile', label: 'Profile' },
                { id: 'documents', label: 'Documents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
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
                  {profileCompletion < 100 ? (
                    <div className="flex items-center gap-3 text-yellow-700 bg-yellow-50 rounded-lg p-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Your documents are under verification.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-green-700 bg-green-50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>You're verified and ready to accept trips.</span>
                    </div>
                  )}
                </div>

                {/* Assigned Trips */}
                <div>
                  <h3 className="font-semibold mb-4">Assigned Trips</h3>
                  {mockTrips.length > 0 ? (
                    <div className="space-y-4">
                      {mockTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="bg-card border border-border rounded-xl p-5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{trip.customer}</h4>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {trip.carType}
                                </span>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{trip.pickup} → {trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {trip.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {trip.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" className="gap-2">
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
                      <p className="text-muted-foreground">Stay online to receive trip requests!</p>
                    </div>
                  )}
                </div>
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
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            profile.vehicleTypes.includes(type)
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
                  />

                  {/* Aadhaar */}
                  <DocumentUploadCard
                    title="Aadhaar / Government ID"
                    description="Upload your Aadhaar card or any valid government ID."
                    icon={FileText}
                    status={documents.aadhaar.status}
                    onUpload={(file) => handleFileUpload('aadhaar', file)}
                    file={documents.aadhaar.file}
                  />

                  {/* Profile Photo */}
                  <DocumentUploadCard
                    title="Profile Photo"
                    description="Upload a recent passport-size photo."
                    icon={Camera}
                    status={documents.photo.status}
                    onUpload={(file) => handleFileUpload('photo', file)}
                    file={documents.photo.file}
                  />

                  {/* Address Proof */}
                  <DocumentUploadCard
                    title="Address Proof (Optional)"
                    description="Utility bill, bank statement, or rental agreement."
                    icon={Home}
                    status={documents.addressProof.status}
                    onUpload={(file) => handleFileUpload('addressProof', file)}
                    file={documents.addressProof.file}
                    optional
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
                href="https://wa.me/919876543210?text=Hi, I need help with driver registration" 
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
  optional?: boolean;
}

function DocumentUploadCard({ title, description, icon: Icon, status, onUpload, file, optional }: DocumentUploadCardProps) {
  const statusConfig = documentStatuses[status as keyof typeof documentStatuses];
  const StatusIcon = statusConfig.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
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
          <StatusIcon className={`w-3 h-3 ${status === 'pending' ? 'animate-spin' : ''}`} />
          {statusConfig.label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      {file ? (
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <span className="text-sm truncate">{file.name}</span>
          <label className="cursor-pointer">
            <span className="text-primary text-sm font-medium hover:underline">Replace</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Click to upload</span>
          <span className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (max 5MB)</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="hidden"
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
