import { motion } from 'framer-motion';
import { 
  Car, 
  Clock, 
  MapPin, 
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Info
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VEHICLE_TARIFFS, formatCurrency } from '@/lib/tariffs';
import { SectionHeading } from '@/components/shared/SectionHeading';

const Tariff = () => {
  const actingDriverTariff = VEHICLE_TARIFFS.find(t => t.vehicleType === 'acting-driver');
  const vehicleTariffs = VEHICLE_TARIFFS.filter(t => t.vehicleType !== 'acting-driver');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-4xl md:text-5xl mb-4"
          >
            Transparent <span className="text-primary">Pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            No hidden charges. Clear, upfront pricing for all our services.
          </motion.p>
        </div>
      </section>

      {/* Acting Driver Tariff - Highlighted */}
      {actingDriverTariff && (
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4">
            <SectionHeading
              badge="Most Popular"
              title="Acting Driver - Hourly Service"
              description="Professional drivers for your own car, available on hourly basis"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-primary shadow-lg">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                        <Clock className="w-8 h-8 text-primary" />
                        {actingDriverTariff.displayName}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        Minimum 4 hours booking
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold text-primary">
                        {formatCurrency(actingDriverTariff.localTariff.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">for 4 hours</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Pricing Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Minimum Booking</p>
                        <p className="text-sm text-muted-foreground">
                          {actingDriverTariff.localTariff.minHours} hours - {formatCurrency(actingDriverTariff.localTariff.amount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Additional Hours</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(actingDriverTariff.localTariff.extraPerHour)} per hour
                        </p>
                      </div>
                    </div>

                    {actingDriverTariff.commission && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Commission (4 hours)</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(actingDriverTariff.commission)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Night Charges */}
                  {actingDriverTariff.nightCharges && (
                    <Alert className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                      <Moon className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-900 dark:text-amber-100">
                        Night Charges Apply
                      </AlertTitle>
                      <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            <span className="font-medium">4:00 AM booking:</span>
                            <span>{formatCurrency(actingDriverTariff.nightCharges.time4am)} extra</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            <span className="font-medium">6:00 AM booking:</span>
                            <span>{formatCurrency(actingDriverTariff.nightCharges.time6am)} extra</span>
                          </div>
                        </div>
                        <p className="text-sm italic mt-3">
                          {actingDriverTariff.nightCharges.description}
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Vehicle Tariffs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Vehicle Tariffs"
            title="Car Rental with Driver"
            description="Comprehensive pricing for all vehicle types - Local and Outstation"
          />

          <div className="space-y-6">
            {vehicleTariffs.map((tariff, index) => (
              <motion.div
                key={tariff.vehicleType}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl md:text-2xl">
                            {tariff.displayName}
                          </CardTitle>
                          <CardDescription>
                            Local & Outstation services available
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {tariff.vehicleType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Local Tariff */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Clock className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">Local / Round Trip</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Minimum Package</span>
                            <span className="font-semibold">
                              {tariff.localTariff.minHours}hrs / {tariff.localTariff.minKms}kms
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Base Fare</span>
                            <span className="font-bold text-lg text-primary">
                              {formatCurrency(tariff.localTariff.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Extra Hour</span>
                            <span className="font-medium">
                              {formatCurrency(tariff.localTariff.extraPerHour)}/hr
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Extra Km</span>
                            <span className="font-medium">
                              {formatCurrency(tariff.localTariff.extraPerKm)}/km
                            </span>
                          </div>

                          {/* Additional Packages */}
                          {tariff.localTariff.additionalPackages && tariff.localTariff.additionalPackages.length > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground mb-2">Other Packages:</p>
                              <div className="space-y-1">
                                {tariff.localTariff.additionalPackages.map((pkg, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm">
                                    <span>{pkg.hours}hrs / {pkg.kms}kms</span>
                                    <span className="font-semibold">{formatCurrency(pkg.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Outstation Tariff */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">Outstation</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Per Day (Min Kms)</span>
                            <span className="font-semibold">{tariff.outstationTariff.perDayMinKms} kms</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Per Day Rate</span>
                            <span className="font-bold text-lg text-primary">
                              {formatCurrency(tariff.outstationTariff.perDayAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Extra Km</span>
                            <span className="font-medium">
                              {formatCurrency(tariff.outstationTariff.extraPerKm)}/km
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Driver Allowance</span>
                            <span className="font-medium">
                              {formatCurrency(tariff.outstationTariff.driverBatta)}/day
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription className="mt-3 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All prices are in Indian Rupees (₹)</li>
                  <li>GST/taxes applicable as per government regulations</li>
                  <li>Toll charges, parking fees, and state permits are extra</li>
                  <li>Night charges apply for specific time slots (after 10 PM and early morning)</li>
                  <li>Outstation trips: Driver allowance (batta) is per day</li>
                  <li>Cancellation charges may apply as per policy</li>
                  <li>Prices subject to change during peak seasons and festivals</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to Book?
            </h2>
            <p className="text-background/70 mb-8">
              Get started with transparent pricing and professional service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/booking">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Book Now
                </button>
              </a>
              <a href="/contact">
                <button className="px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-background/90 transition-colors">
                  Contact Us
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Tariff;
