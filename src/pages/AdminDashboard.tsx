import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Settings,
    BarChart3,
    Calendar,
    ShieldCheck,
    TrendingUp,
    DollarSign,
    Car,
    Bell,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Eye,
    X,
    Check,
    Camera,
    Briefcase
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading, logout } = useAuth();
    const [activeView, setActiveView] = useState<'overview' | 'bookings' | 'drivers' | 'documents'>('overview');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        activeDrivers: 0,
        newCustomers: 0
    });
    const [bookings, setBookings] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [verifyingDoc, setVerifyingDoc] = useState<string | null>(null);
    const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'assigned' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled'>('all');
    const [bookingSearch, setBookingSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user || user.role !== 'admin') {
            navigate('/auth');
            return;
        }
        fetchDashboardData();
    }, [user, isAuthLoading]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch bookings
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError;

            // Fetch drivers with document details
            const { data: driversData, error: driversError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'driver')
                .order('created_at', { ascending: false });

            if (driversError) throw driversError;

            // Calculate stats
            const totalBookings = bookingsData?.length || 0;
            const completedBookings = bookingsData?.filter(b => b.status === 'completed') || [];
            const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
            const activeDrivers = driversData?.filter(d => d.is_online)?.length || 0;
            
            // Get customers created in last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const { data: customersData } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'customer')
                .gte('created_at', thirtyDaysAgo.toISOString());

            setStats({
                totalRevenue,
                totalBookings,
                activeDrivers,
                newCustomers: customersData?.length || 0
            });

            setBookings(bookingsData || []);
            setRecentBookings(bookingsData?.slice(0, 5) || []);
            setDrivers(driversData || []);
        } catch (error: any) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to load dashboard data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyDocument = async (driverId: string, docType: 'license' | 'aadhaar' | 'pan' | 'account', approve: boolean) => {
        const verifyKey = `${driverId}-${docType}`;
        setVerifyingDoc(verifyKey);
        
        try {
            const updateData: any = {};
            updateData[`${docType}_verified`] = approve;
            
            // Check if all documents are verified to set documents_verified
            const driver = drivers.find(d => d.id === driverId);
            if (driver) {
                const allVerified = 
                    (docType === 'license' ? approve : driver.license_verified) &&
                    (docType === 'aadhaar' ? approve : driver.aadhaar_verified) &&
                    (docType === 'pan' ? approve : driver.pan_verified) &&
                    (docType === 'account' ? approve : driver.account_verified);
                
                updateData.documents_verified = allVerified;
            }

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', driverId);

            if (error) throw error;

            toast({
                title: approve ? "Document Approved" : "Document Rejected",
                description: `${docType.charAt(0).toUpperCase() + docType.slice(1)} ${approve ? 'approved' : 'rejected'} successfully`,
                variant: approve ? "default" : "destructive",
            });

            // Refresh data
            await fetchDashboardData();
        } catch (error: any) {
            console.error('Error verifying document:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update document verification",
                variant: "destructive",
            });
        } finally {
            setVerifyingDoc(null);
        }
    };

    const handleBookingStatus = async (bookingId: string, status: 'pending' | 'assigned' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled') => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: 'Status Updated',
                description: `Booking marked as ${status}`,
            });

            await fetchDashboardData();
        } catch (error: any) {
            console.error('Error updating booking:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update booking status',
                variant: 'destructive',
            });
        }
    };

    const handleToggleDriverOnline = async (driverId: string, nextState: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_online: nextState })
                .eq('id', driverId);

            if (error) throw error;

            toast({
                title: nextState ? 'Driver Activated' : 'Driver Paused',
                description: `Driver is now ${nextState ? 'Online' : 'Offline'}`,
            });

            await fetchDashboardData();
        } catch (error: any) {
            console.error('Error toggling driver:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update driver status',
                variant: 'destructive',
            });
        }
    };

    const statsCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            change: '+12.5%',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings.toString(),
            change: '+8.2%',
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            title: 'Active Drivers',
            value: stats.activeDrivers.toString(),
            change: '+2',
            icon: Car,
            color: 'text-purple-600',
            bg: 'bg-purple-100'
        },
        {
            title: 'New Customers',
            value: stats.newCustomers.toString(),
            change: '+4.5%',
            icon: Users,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        }
    ];

    const filteredBookings = bookings.filter((booking) => {
        const statusMatch = bookingFilter === 'all' ? true : booking.status === bookingFilter;
        const search = bookingSearch.toLowerCase();
        const searchMatch =
            booking.customer_name?.toLowerCase().includes(search) ||
            booking.id?.toLowerCase().includes(search) ||
            booking.customer_phone?.toLowerCase().includes(search);
        return statusMatch && (search ? searchMatch : true);
    });

    if (isAuthLoading) {
        return (
            <Layout hideFooter>
                <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                    <Clock className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout hideFooter>
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
                    <div className="p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                            <ShieldCheck className="w-6 h-6" />
                            Admin Panel
                        </h2>
                    </div>
                    <nav className="flex-1 px-4 space-y-1">
                        <SidebarItem
                            icon={BarChart3}
                            label="Overview"
                            active={activeView === 'overview'}
                            onClick={() => setActiveView('overview')}
                        />
                        <SidebarItem
                            icon={Calendar}
                            label="Bookings"
                            active={activeView === 'bookings'}
                            onClick={() => setActiveView('bookings')}
                        />
                        <SidebarItem
                            icon={Car}
                            label="Drivers"
                            active={activeView === 'drivers'}
                            onClick={() => setActiveView('drivers')}
                        />
                        <SidebarItem
                            icon={FileText}
                            label="Document Verification"
                            active={activeView === 'documents'}
                            onClick={() => setActiveView('documents')}
                        />
                    </nav>
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                A
                            </div>
                            <div>
                                <p className="text-sm font-medium">Super Admin</p>
                                <p className="text-xs text-muted-foreground">admin@citypro.in</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header */}
                        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Manage your platform's operations and see live updates.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                                </Button>
                                <Button className="gap-2" onClick={logout} variant="destructive">
                                    Logout
                                </Button>
                            </div>
                        </header>

                        {activeView === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {statsCards.map((stat, idx) => (
                                        <Card key={idx} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                                        <stat.icon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                        {stat.change}
                                                    </span>
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Main Dashboard Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Recent Bookings Table */}
                                    <Card className="lg:col-span-2">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>Recent Bookings</CardTitle>
                                                <CardDescription>Latest service requests across cities.</CardDescription>
                                            </div>
                                            <Button variant="outline" size="sm">View All</Button>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Customer</TableHead>
                                                        <TableHead>Service</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {isLoading ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                                Loading bookings...
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : recentBookings.length > 0 ? (
                                                        recentBookings.map((booking) => (
                                                            <TableRow key={booking.id}>
                                                                <TableCell>
                                                                    <div className="font-medium">{booking.customer_name || 'N/A'}</div>
                                                                    <div className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</div>
                                                                </TableCell>
                                                                <TableCell>{booking.service_type || 'Driver Service'}</TableCell>
                                                                <TableCell>
                                                                    <AdminStatusBadge status={booking.status} />
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    ₹{booking.amount?.toLocaleString('en-IN') || '0'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                                No bookings found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>

                                    {/* Top Drivers */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Top Drivers</CardTitle>
                                            <CardDescription>Our best performers this month.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {isLoading ? (
                                                <p className="text-center text-muted-foreground py-4">Loading drivers...</p>
                                            ) : drivers.length > 0 ? (
                                                <>
                                                    {drivers.slice(0, 3).map((driver, idx) => (
                                                        <div key={idx} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                                                    {driver.name?.charAt(0) || 'D'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium leading-none">{driver.name || 'Driver'}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {driver.experience ? `${driver.experience} experience` : 'New driver'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant={driver.is_online ? 'secondary' : 'outline'}>
                                                                {driver.is_online ? 'Online' : 'Offline'}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                    <Button variant="ghost" className="w-full text-primary hover:bg-primary/5" onClick={() => setActiveView('drivers')}>
                                                        Manage All Drivers
                                                    </Button>
                                                </>
                                            ) : (
                                                <p className="text-center text-muted-foreground py-4">No drivers found</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeView === 'bookings' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-semibold">All Bookings</h2>
                                        <p className="text-sm text-muted-foreground">Review and manage every booking</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(['all','pending','assigned','in_progress','confirmed','completed','cancelled'] as const).map((status) => (
                                            <Button
                                                key={status}
                                                variant={bookingFilter === status ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setBookingFilter(status)}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </Button>
                                        ))}
                                        <Input
                                            placeholder="Search customer or ID"
                                            value={bookingSearch}
                                            onChange={(e) => setBookingSearch(e.target.value)}
                                            className="w-64"
                                        />
                                    </div>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bookings</CardTitle>
                                        <CardDescription>Update statuses and review trip details.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Customer</TableHead>
                                                    <TableHead>Trip</TableHead>
                                                    <TableHead>Driver</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                            Loading bookings...
                                                        </TableCell>
                                                    </TableRow>
                                                ) : filteredBookings.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                            No bookings found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredBookings.map((booking) => (
                                                        <TableRow key={booking.id}>
                                                            <TableCell>
                                                                <div className="font-medium">{booking.customer_name || 'N/A'}</div>
                                                                <div className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</div>
                                                                <div className="text-xs text-muted-foreground">Phone: {booking.customer_phone || 'N/A'}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">{booking.service_type || booking.vehicle_type || 'Driver Service'}</div>
                                                                <div className="text-xs text-muted-foreground">From {booking.pickup_location || 'N/A'}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {booking.driver_id ? (
                                                                    <div className="space-y-1">
                                                                        <div className="font-medium">{booking.driver_name || 'Driver'}</div>
                                                                        <div className="text-xs text-muted-foreground">ID: {booking.driver_id?.slice(0, 8)}</div>
                                                                    </div>
                                                                ) : (
                                                                    <Badge variant="outline">Unassigned</Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell><AdminStatusBadge status={booking.status} /></TableCell>
                                                            <TableCell>₹{booking.amount?.toLocaleString('en-IN') || '0'}</TableCell>
                                                            <TableCell className="text-right space-x-2">
                                                                {booking.status !== 'confirmed' && booking.status !== 'completed' && (
                                                                    <Button size="sm" variant="default" onClick={() => handleBookingStatus(booking.id, 'confirmed')}>
                                                                        Confirm
                                                                    </Button>
                                                                )}
                                                                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                                                    <Button size="sm" variant="outline" onClick={() => handleBookingStatus(booking.id, 'completed')}>
                                                                        Complete
                                                                    </Button>
                                                                )}
                                                                {booking.status !== 'cancelled' && (
                                                                    <Button size="sm" variant="destructive" onClick={() => handleBookingStatus(booking.id, 'cancelled')}>
                                                                        Cancel
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Driver Documents Verification View */}
                        {activeView === 'documents' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Driver Document Verification</CardTitle>
                                        <CardDescription>Review and verify driver documents for platform approval</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <p className="text-center py-8 text-muted-foreground">Loading drivers...</p>
                                        ) : drivers.length === 0 ? (
                                            <p className="text-center py-8 text-muted-foreground">No drivers found</p>
                                        ) : (
                                            <div className="space-y-6">
                                                {drivers.map((driver) => (
                                                    <Card key={driver.id} className="border-2">
                                                        <CardHeader className="pb-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                                        <span className="text-lg font-bold text-primary">
                                                                            {driver.name?.charAt(0) || 'D'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold">{driver.name || 'Driver'}</h3>
                                                                        <p className="text-sm text-muted-foreground">{driver.email}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge 
                                                                    variant={driver.documents_verified ? "default" : "secondary"}
                                                                    className={driver.documents_verified ? "bg-green-100 text-green-800 border-green-200" : ""}
                                                                >
                                                                    {driver.documents_verified ? (
                                                                        <><CheckCircle2 className="w-3 h-3 mr-1" /> All Verified</>
                                                                    ) : (
                                                                        <><Clock className="w-3 h-3 mr-1" /> Pending Review</>
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                <DocumentVerificationCard
                                                                    title="Driving License"
                                                                    icon={FileText}
                                                                    documentUrl={driver.license_doc_url}
                                                                    verified={driver.license_verified}
                                                                    onApprove={() => handleVerifyDocument(driver.id, 'license', true)}
                                                                    onReject={() => handleVerifyDocument(driver.id, 'license', false)}
                                                                    isVerifying={verifyingDoc === `${driver.id}-license`}
                                                                />
                                                                <DocumentVerificationCard
                                                                    title="Aadhaar Card"
                                                                    icon={FileText}
                                                                    documentUrl={driver.aadhaar_doc_url}
                                                                    verified={driver.aadhaar_verified}
                                                                    onApprove={() => handleVerifyDocument(driver.id, 'aadhaar', true)}
                                                                    onReject={() => handleVerifyDocument(driver.id, 'aadhaar', false)}
                                                                    isVerifying={verifyingDoc === `${driver.id}-aadhaar`}
                                                                />
                                                                <DocumentVerificationCard
                                                                    title="PAN Card"
                                                                    icon={FileText}
                                                                    documentUrl={driver.pan_doc_url}
                                                                    verified={driver.pan_verified}
                                                                    onApprove={() => handleVerifyDocument(driver.id, 'pan', true)}
                                                                    onReject={() => handleVerifyDocument(driver.id, 'pan', false)}
                                                                    isVerifying={verifyingDoc === `${driver.id}-pan`}
                                                                />
                                                                <DocumentVerificationCard
                                                                    title="Profile Photo"
                                                                    icon={Camera}
                                                                    documentUrl={driver.photo_url}
                                                                    verified={driver.photo_url ? true : false}
                                                                    onApprove={() => {}}
                                                                    onReject={() => {}}
                                                                    isVerifying={false}
                                                                    hideActions
                                                                />
                                                                <DocumentVerificationCard
                                                                    title="Bank Account Details"
                                                                    icon={Briefcase}
                                                                    documentUrl={driver.account_details_doc_url}
                                                                    verified={driver.account_verified}
                                                                    onApprove={() => handleVerifyDocument(driver.id, 'account', true)}
                                                                    onReject={() => handleVerifyDocument(driver.id, 'account', false)}
                                                                    isVerifying={verifyingDoc === `${driver.id}-account`}
                                                                />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {activeView === 'drivers' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">Drivers</h2>
                                        <p className="text-sm text-muted-foreground">Manage availability and documents</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setActiveView('documents')}>
                                        Go to Document Verification
                                    </Button>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Driver Roster</CardTitle>
                                        <CardDescription>Toggle availability and review statuses.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Docs</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            Loading drivers...
                                                        </TableCell>
                                                    </TableRow>
                                                ) : drivers.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No drivers found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    drivers.map((driver) => (
                                                        <TableRow key={driver.id}>
                                                            <TableCell>
                                                                <div className="font-medium">{driver.name || 'Driver'}</div>
                                                                <div className="text-xs text-muted-foreground">{driver.email}</div>
                                                                <div className="text-xs text-muted-foreground">{driver.phone || 'No phone'}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={driver.is_online ? 'secondary' : 'outline'}>
                                                                    {driver.is_online ? 'Online' : 'Offline'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={driver.documents_verified ? 'default' : 'secondary'} className={driver.documents_verified ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                                                                    {driver.documents_verified ? 'Verified' : 'Pending'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setActiveView('documents')}
                                                                >
                                                                    View Docs
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant={driver.is_online ? 'destructive' : 'default'}
                                                                    onClick={() => handleToggleDriverOnline(driver.id, !driver.is_online)}
                                                                >
                                                                    {driver.is_online ? 'Set Offline' : 'Set Online'}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </Layout>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick }: {
    icon: any,
    label: string,
    active: boolean,
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

function AdminStatusBadge({ status }: { status: string }) {
    const configs: Record<string, { color: string, icon: any }> = {
        pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
        assigned: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
        in_progress: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: CheckCircle2 },
        confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
        completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
        cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="w-3 h-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function DocumentVerificationCard({ 
    title, 
    icon: Icon, 
    documentUrl, 
    verified, 
    onApprove, 
    onReject,
    isVerifying,
    hideActions = false
}: {
    title: string;
    icon: any;
    documentUrl?: string;
    verified?: boolean;
    onApprove: () => void;
    onReject: () => void;
    isVerifying: boolean;
    hideActions?: boolean;
}) {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{title}</span>
                </div>
                {verified !== undefined && (
                    <Badge variant={verified ? "default" : "secondary"} className={verified ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                        {verified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    </Badge>
                )}
            </div>
            
            {documentUrl ? (
                <>
                    <a 
                        href={documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <Eye className="w-4 h-4" />
                        View Document
                    </a>
                    
                    {!hideActions && !verified && (
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="default"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={onApprove}
                                disabled={isVerifying}
                            >
                                {isVerifying ? (
                                    <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                    <><Check className="w-4 h-4 mr-1" /> Approve</>
                                )}
                            </Button>
                            <Button 
                                size="sm" 
                                variant="destructive"
                                className="flex-1"
                                onClick={onReject}
                                disabled={isVerifying}
                            >
                                <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                        </div>
                    )}
                    {!hideActions && verified && (
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                            onClick={onReject}
                            disabled={isVerifying}
                        >
                            <X className="w-4 h-4 mr-1" /> Revoke Approval
                        </Button>
                    )}
                </>
            ) : (
                <p className="text-xs text-muted-foreground">Not uploaded yet</p>
            )}
        </div>
    );
}
