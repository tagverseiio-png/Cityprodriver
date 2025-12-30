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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Additional Hours</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(actingDriverTariff.localTariff.extraPerHour)} per hour
                        </p>
                      </div>
                    </div>

                    {actingDriverTariff.localTariff.additionalPackages?.map((pkg, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Fixed Package ({pkg.hours} Hours)</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(pkg.amount)} (e.g. Kanchipuram, Mahabalipuram)
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Outstation (Same Day)</p>
                        <p className="text-sm text-muted-foreground">
                          12 Hours - {formatCurrency(actingDriverTariff.outstationTariff.perDayAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Extra: {formatCurrency(actingDriverTariff.outstationTariff.extraPerHour || 100)}/hr
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Car className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Food Allowance (Outstation)</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(actingDriverTariff.outstationTariff.foodAllowance)} - Applicable for Outstation duty only
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Night Charges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actingDriverTariff.nightCharges && (
                      <Alert className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                        <Moon className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center border-b border-amber-500/20 pb-1">
                              <span>Late Night Charges (10pm - 12am)</span>
                              <span className="font-bold">{formatCurrency(50)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-amber-500/20 pb-1">
                              <span>Early Morning Charges (12am - 5am)</span>
                              <span className="font-bold">{formatCurrency(100)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Early Morning Charges (5am - 8am)</span>
                              <span className="font-bold">{formatCurrency(50)}</span>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <Alert className="border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <AlertTitle className="text-destructive font-bold">
                        Cancellation Charges
                      </AlertTitle>
                      <AlertDescription className="text-foreground/80 mt-2">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-sm">
                            Cancels before 30 Minutes or if driver is sent back after reporting.
                          </span>
                          <span className="font-bold text-destructive whitespace-nowrap">{formatCurrency(50)}</span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span>Proper accommodation required for drivers during night stays.</span>
                  </div>
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
                    <div className={`grid grid-cols-1 ${tariff.outstationTariff.perDayAmount > 0 ? 'lg:grid-cols-2' : ''} gap-6`}>
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
                              {tariff.localTariff.minHours}hrs {tariff.localTariff.minKms > 0 ? `/ ${tariff.localTariff.minKms}kms` : ''}
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
                          {tariff.localTariff.extraPerKm > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Extra Km</span>
                              <span className="font-medium">
                                {formatCurrency(tariff.localTariff.extraPerKm)}/km
                              </span>
                            </div>
                          )}

                          {/* Additional Packages */}
                          {tariff.localTariff.additionalPackages && tariff.localTariff.additionalPackages.length > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground mb-2">Other Packages:</p>
                              <div className="space-y-1">
                                {tariff.localTariff.additionalPackages.map((pkg, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm">
                                    <span>{pkg.hours}hrs {pkg.kms > 0 ? `/ ${pkg.kms}kms` : ''}</span>
                                    <span className="font-semibold">{formatCurrency(pkg.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Outstation Tariff */}
                      {tariff.outstationTariff.perDayAmount > 0 && (
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
                            {tariff.outstationTariff.extraPerHour && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Extra Hour</span>
                                <span className="font-medium">
                                  {formatCurrency(tariff.outstationTariff.extraPerHour)}/hr
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Driver Allowance</span>
                              <span className="font-medium">
                                {formatCurrency(tariff.outstationTariff.driverBatta)}/day
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Food Allowance</span>
                              <span className="font-medium">
                                {formatCurrency(tariff.outstationTariff.foodAllowance)}/day
                              </span>
                            </div>
                            <div className="pt-2 mt-2 border-t text-[10px] text-muted-foreground italic">
                              * {tariff.outstationTariff.accommodation}
                            </div>
                          </div>
                        </div>
                      )}
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
                  <li>Customer pays City Pro via QR code / Bank Transfer only</li>
                  <li>Toll charges, parking fees, and state permits are extra</li>
                  <li>Late night & early morning charges apply from 10:00 PM to 8:00 AM (₹50 to ₹100 extra)</li>
                  <li>Cancellation fee of ₹50 applies if cancelled within 30 mins of reporting</li>
                  <li>Outstation trips: Food allowance (₹200) is applicable for Outstation duty only</li>
                  <li>Proper accommodation required for drivers during night stays.</li>
                  <li>Valet Parking: Neat uniform and valet tags provided</li>
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
