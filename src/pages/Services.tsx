import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CalendarDays, 
  Users, 
  MapPin, 
  Car, 
  ParkingCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/SectionHeading';

const services = [
  {
    icon: Clock,
    title: 'Hourly / Acting Drivers',
    description: 'Need a driver for a few hours? Our acting drivers are available on an hourly basis for short trips, shopping excursions, medical appointments, or any occasion where you need a professional behind the wheel.',
    features: ['Minimum 4 hours', 'Starting from ₹450', 'Ideal for city errands', 'Instant availability'],
    price: 'Starting from ₹450',
  },
  {
    icon: Calendar,
    title: 'Daily / Full-Day Driver',
    description: 'Daily/Full Day on hourly basis. Perfect for business meetings, wedding events, city tours, or any full-day requirement. Minimum 6 hours for local or 12 hours for Outstation.',
    features: ['Hourly basis', 'Minimum 6 hours local', 'Minimum 12 hours outstation', 'Flexible scheduling'],
    price: 'Based on hours',
  },
  {
    icon: CalendarDays,
    title: 'Monthly / Permanent Drivers',
    description: 'Tired of changing drivers every day? City Pro Drivers provides verified permanent drivers for home & office use. Permanent / Monthly Drivers Available. Verified & professional drivers. 8 / 10 / 12 hours options. Fixed monthly cost. No daily search. Replacement support. Call or WhatsApp to discuss best package.',
    features: ['8 / 10 / 12 hours options', '24 hours available', 'Dedicated driver', 'Replacement support'],
    price: 'Custom packages available',
  },
  {
    icon: ParkingCircle,
    title: 'Valet Parking Services',
    description: 'Professional valet parking services for events, restaurants, hotels, and corporate functions. Trained valets ensure safe handling of all vehicle types.',
    features: ['Neat & clean uniform', 'Valet tags provided', 'Trained professionals', 'Event management'],
    price: 'Starting from ₹600 (4 hours)',
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Services"
            title="Professional Driving Solutions"
            description="From hourly trips to permanent placements, we offer comprehensive driving services tailored to your needs."
          />
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isReversed = index % 2 === 1;
              
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center`}
                >
                  {/* Image/Icon Side */}
                  <div className="flex-1 w-full">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-12 flex items-center justify-center">
                      <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Side */}
                  <div className="flex-1 w-full">
                    <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className="text-lg font-semibold text-primary">
                        {service.price}
                      </span>
                      <Link to="/booking">
                        <Button className="gap-2">
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-4xl mb-6"
          >
            Can't find what you need?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-background/70 text-lg mb-8"
          >
            Contact us for custom requirements. We're here to help!
          </motion.p>
          <Link to="/contact">
            <Button size="lg">Contact Us</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
