import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { FileText, AlertCircle, CreditCard, Clock, MapPin, Car } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <SectionHeading
              badge="Legal"
              title="Terms and Conditions"
              description="Please read these terms carefully before availing our services."
            />
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            
            {/* General Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl mt-1">General Rules</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground list-disc pl-5">
                <li>Drivers are provided only for personal use and must not be used for any commercial purpose.</li>
                <li>The driver’s duty is strictly limited to driving the vehicle only.</li>
                <li><strong>Car washing, cleaning, loading, or other non-driving tasks are not included.</strong></li>
              </ul>
            </motion.div>

            {/* Customer Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl mt-1">Customer Responsibilities</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground list-disc pl-5">
                <li>Parking charges, toll charges, and entry fees (if any) must be paid by the customer, as the driver will be driving the customer’s own vehicle.</li>
              </ul>
            </motion.div>

            {/* Outstation Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl mt-1">Outstation Trip Rules</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground list-disc pl-5">
                <li>For outstation trips, the standard driver duty is <strong>12 hours per day</strong>.</li>
                <li>For outstation trips, the customer must provide:
                  <ul className="list-circle pl-5 mt-2 space-y-2">
                    <li>Food allowance of ₹200 per day.</li>
                    <li>Proper accommodation or a safe sleeping place for the driver during night stay, as adequate rest is essential for safe driving the next day.</li>
                  </ul>
                </li>
              </ul>
            </motion.div>

            {/* Payment Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl mt-1">Payment Policy</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground list-disc pl-5">
                <li>All payments must be made directly to <strong>City Pro Drivers (To The Company)</strong> only through the official payment gateway / QR code / GPay number provided by the company.</li>
                <li><strong>Payments should not be made directly to the driver under any circumstances.</strong></li>
                <li>City Pro Drivers will calculate duty hours and pay the driver directly as per company policy.</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
