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
    features: ['Flexible hourly booking', 'Minimum 2 hours', 'Ideal for city errands', 'Instant availability'],
    price: 'Starting from ₹150/hour',
  },
  {
    icon: Calendar,
    title: 'Daily & Full-Day Drivers',
    description: 'Book a driver for your entire day without worrying about hourly charges. Perfect for business meetings, wedding events, city tours, or any full-day requirement.',
    features: ['8-12 hour packages', 'Fixed daily rates', 'City-wide coverage', 'Overtime available'],
    price: 'Starting from ₹1,200/day',
  },
  {
    icon: CalendarDays,
    title: 'Weekly & Monthly Drivers',
    description: 'Long-term driver solutions for extended travel needs, monthly office commutes, or temporary requirements. Consistent service with the same trusted driver.',
    features: ['Dedicated driver', 'Flexible schedules', 'Best value rates', 'Easy renewals'],
    price: 'Custom packages available',
  },
  {
    icon: Users,
    title: 'Permanent Drivers',
    description: 'Hire a verified, permanent driver for your household or business. We handle the entire recruitment, verification, and placement process.',
    features: ['Background verified', 'Police verification', 'Skill assessment', 'Replacement guarantee'],
    price: 'Contact for placement fees',
  },
  {
    icon: MapPin,
    title: 'Outstation Drivers',
    description: 'Planning a road trip or outstation journey? Our experienced drivers will take you safely to your destination in your own car. Comfortable long-distance travel guaranteed.',
    features: ['All India coverage', 'Experienced highway drivers', 'Night driving available', 'Return trip included'],
    price: 'Based on distance',
  },
  {
    icon: Car,
    title: 'Yellow Board Cars with Drivers',
    description: 'Commercial vehicles with licensed professional drivers for business transport, cargo movement, or any requirement needing a registered commercial vehicle.',
    features: ['Licensed commercial vehicles', 'All permits included', 'Business transport', 'Cargo friendly'],
    price: 'Custom quotes',
  },
  {
    icon: ParkingCircle,
    title: 'Valet Parking Services',
    description: 'Professional valet parking services for events, restaurants, hotels, and corporate functions. Trained valets ensure safe handling of all vehicle types.',
    features: ['Event management', 'Corporate functions', 'Trained professionals', 'Insurance covered'],
    price: 'Event-based pricing',
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
