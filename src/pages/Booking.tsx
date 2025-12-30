import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Map,
  Loader2,
  IndianRupee
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LocationPicker } from '@/components/shared/LocationPicker';
import { VEHICLE_TARIFFS, getTariffByVehicleType, formatCurrency, calculateNightCharges } from '@/lib/tariffs';

const steps = [
  { id: 1, title: 'Service Type', icon: Car },
  { id: 2, title: 'Trip Details', icon: MapPin },
  { id: 3, title: 'Schedule', icon: Calendar },
  { id: 4, title: 'Your Info', icon: User },
];

const serviceTypes = [
  { value: 'hourly', label: 'Call Driver on Hourly Basis – Minimum 4 hours', desc: 'For short trips & errands' },
  { value: 'daily', label: 'Daily / Full-Day Driver', desc: 'Daily/Full Day on hourly basis' },
  { value: 'weekly', label: 'Weekly Driver', desc: '7-day booking' },
  { value: 'monthly', label: 'Monthly / Permanent Driver', desc: '30-day commitment' },
];



const Booking = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<ReturnType<typeof getTariffByVehicleType>>(undefined);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({
        title: "Login Required",
        description: "Please login to book a driver",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, isAuthLoading, navigate, toast]);
  
  const [formData, setFormData] = useState({
    serviceType: '',
    tripType: 'inside-city',
    pickupLocation: '',
    destination: '',
    date: '',
    time: '',
    duration: '',
    carType: '',
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerPhone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (formData.carType) {
      setSelectedTariff(getTariffByVehicleType(formData.carType));
    } else {
      setSelectedTariff(undefined);
    }
  }, [formData.carType]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.serviceType;
      case 2:
        return !!formData.pickupLocation && (formData.tripType === 'inside-city' || !!formData.destination);
      case 3:
        return !!formData.date && !!formData.time && !!formData.carType;
      case 4:
        return !!formData.customerName && !!formData.customerPhone && formData.customerPhone.length >= 10;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please login to complete your booking",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate duration based on service type
      const durationValue = formData.duration ? parseInt(formData.duration) : null;
      const durationHours = formData.serviceType === 'hourly' ? durationValue : null;
      const durationDays = formData.serviceType === 'daily' ? durationValue : null;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          service_type: formData.serviceType,
          pickup_location: formData.pickupLocation,
          destination: formData.destination || null,
          pickup_date: formData.date,
          pickup_time: formData.time,
          duration_hours: durationHours,
          duration_days: durationDays,
          car_type: formData.carType,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: "Your booking has been created successfully. We'll assign a driver soon.",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-20 md:py-32 min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Your booking request has been submitted. Our team will assign a driver and contact you shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/customer/dashboard')}
                >
                  View My Bookings
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    setFormData({
                      serviceType: '',
                      tripType: 'inside-city',
                      pickupLocation: '',
                      destination: '',
                      date: '',
                      time: '',
                      duration: '',
                      carType: '',
                      customerName: user?.name || '',
                      customerPhone: user?.phone || '',
                    });
                  }}
                >
                  Book Another
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
                Book Your Driver
              </h1>
              <p className="text-muted-foreground text-lg">
                Your Car. Our Driver. Safe Journey.
              </p>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
              <div 
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive || isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block ${
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Form Steps */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-card">
              <AnimatePresence mode="wait">
                {/* Step 1: Service Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display font-semibold text-xl mb-6">
                      Select Service Type
                    </h2>
                    <RadioGroup
                      value={formData.serviceType}
                      onValueChange={(value) => updateFormData('serviceType', value)}
                      className="space-y-3"
                    >
                      {serviceTypes.map((service) => (
                        <label
                          key={service.value}
                          className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                            formData.serviceType === service.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value={service.value} />
                          <div>
                            <span className="font-medium block">{service.label}</span>
                            <span className="text-muted-foreground text-sm">{service.desc}</span>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </motion.div>
                )}

                {/* Step 2: Trip Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="font-display font-semibold text-xl mb-6">
                      Trip Details
                    </h2>
                    
                    <div>
                      <Label className="mb-3 block">Trip Type</Label>
                      <RadioGroup
                        value={formData.tripType}
                        onValueChange={(value) => updateFormData('tripType', value)}
                        className="flex gap-4"
                      >
                        <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${
                          formData.tripType === 'inside-city'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}>
                          <RadioGroupItem value="inside-city" />
                          <span>Inside City</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${
                          formData.tripType === 'outstation'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}>
                          <RadioGroupItem value="outstation" />
                          <span>Outstation</span>
                        </label>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup">Pickup Location *</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="pickup"
                          placeholder="Enter your pickup address"
                          value={formData.pickupLocation}
                          onChange={(e) => updateFormData('pickupLocation', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPickupMap(true)}
                          className="gap-2"
                        >
                          <Map className="w-4 h-4" />
                          Map
                        </Button>
                      </div>
                    </div>
                    
                    {formData.tripType === 'outstation' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Label htmlFor="destination">Destination *</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="destination"
                            placeholder="Enter your destination"
                            value={formData.destination}
                            onChange={(e) => updateFormData('destination', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDestinationMap(true)}
                            className="gap-2"
                          >
                            <Map className="w-4 h-4" />
                            Map
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Schedule */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="font-display font-semibold text-xl mb-6">
                      Schedule & Vehicle
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateFormData('date', e.target.value)}
                          className="mt-2"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => updateFormData('time', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    {(formData.serviceType === 'hourly' || formData.serviceType === 'daily') && (
                      <div>
                        <Label htmlFor="duration">
                          {formData.serviceType === 'hourly' ? 'Number of Hours' : 'Number of Days'}
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder={formData.serviceType === 'hourly' ? 'e.g., 4' : 'e.g., 2'}
                          value={formData.duration}
                          onChange={(e) => updateFormData('duration', e.target.value)}
                          className="mt-2"
                          min="1"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label>Car Type *</Label>
                      <Select
                        value={formData.carType}
                        onValueChange={(value) => updateFormData('carType', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select your car type" />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_TARIFFS.map((tariff) => (
                            <SelectItem key={tariff.vehicleType} value={tariff.vehicleType}>
                              {tariff.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tariff Display */}
                    {selectedTariff && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-secondary/50 rounded-lg p-4 border border-border"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <IndianRupee className="w-4 h-4 text-primary" />
                          <h3 className="font-semibold">Pricing Details</h3>
                        </div>
                        
                        {formData.tripType === 'inside-city' ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Minimum Package:</span>
                              <span className="font-medium">
                                {selectedTariff.localTariff.minHours}hrs / {selectedTariff.localTariff.minKms}kms - {formatCurrency(selectedTariff.localTariff.amount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Extra per hour:</span>
                              <span className="font-medium">{formatCurrency(selectedTariff.localTariff.extraPerHour)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Extra per km:</span>
                              <span className="font-medium">{formatCurrency(selectedTariff.localTariff.extraPerKm)}</span>
                            </div>
                            
                            {calculateNightCharges(formData.time).amount > 0 && (
                              <div className="flex justify-between text-primary font-medium pt-1 border-t border-primary/20">
                                <span>{calculateNightCharges(formData.time).description.split(':')[0]}:</span>
                                <span>{formatCurrency(calculateNightCharges(formData.time).amount)}</span>
                              </div>
                            )}

                            {selectedTariff.localTariff.additionalPackages && selectedTariff.localTariff.additionalPackages.length > 0 && (
                              <div className="pt-2 border-t border-border">
                                <p className="text-muted-foreground mb-1">Additional Packages:</p>
                                {selectedTariff.localTariff.additionalPackages.map((pkg, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span>{pkg.hours}hrs / {pkg.kms}kms</span>
                                    <span>{formatCurrency(pkg.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Per day:</span>
                              <span className="font-medium">
                                {selectedTariff.outstationTariff.perDayMinKms > 0 
                                  ? `${selectedTariff.outstationTariff.perDayMinKms}kms` 
                                  : '12 hours'} - {formatCurrency(selectedTariff.outstationTariff.perDayAmount)}
                              </span>
                            </div>
                            {selectedTariff.outstationTariff.extraPerKm > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Extra per km:</span>
                                <span className="font-medium">{formatCurrency(selectedTariff.outstationTariff.extraPerKm)}</span>
                              </div>
                            )}
                            {selectedTariff.outstationTariff.extraPerHour && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Extra per hour:</span>
                                <span className="font-medium">{formatCurrency(selectedTariff.outstationTariff.extraPerHour)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Driver allowance:</span>
                              <span className="font-medium">
                                {selectedTariff.outstationTariff.driverBatta > 0 
                                  ? `${formatCurrency(selectedTariff.outstationTariff.driverBatta)}/day`
                                  : 'Included'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Food allowance:</span>
                              <span className="font-medium">
                                {formatCurrency(selectedTariff.outstationTariff.foodAllowance)}/day
                              </span>
                            </div>

                            {calculateNightCharges(formData.time).amount > 0 && (
                              <div className="flex justify-between text-primary font-medium pt-1 border-t border-primary/20">
                                <span>{calculateNightCharges(formData.time).description.split(':')[0]}:</span>
                                <span>{formatCurrency(calculateNightCharges(formData.time).amount)}</span>
                              </div>
                            )}

                            <div className="pt-2 mt-2 border-t border-border text-[10px] text-muted-foreground italic">
                              * {selectedTariff.outstationTariff.accommodation}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Customer Info */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="font-display font-semibold text-xl mb-6">
                      Your Information
                    </h2>
                    
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.customerName}
                        onChange={(e) => updateFormData('customerName', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your 10-digit phone number"
                        value={formData.customerPhone}
                        onChange={(e) => updateFormData('customerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="mt-2"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    size="lg"
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm Driver Booking
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Pickers */}
      <LocationPicker
        isOpen={showPickupMap}
        onClose={() => setShowPickupMap(false)}
        onSelectLocation={(address) => updateFormData('pickupLocation', address)}
        initialAddress={formData.pickupLocation}
        title="Select Pickup Location"
      />

      <LocationPicker
        isOpen={showDestinationMap}
        onClose={() => setShowDestinationMap(false)}
        onSelectLocation={(address) => updateFormData('destination', address)}
        initialAddress={formData.destination}
        title="Select Destination"
      />
    </Layout>
  );
};

export default Booking;
