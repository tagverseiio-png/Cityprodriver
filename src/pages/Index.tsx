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
  Shield, 
  CheckCircle, 
  Star, 
  Phone,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { TrustBadge } from '@/components/shared/TrustBadge';
import { SectionHeading } from '@/components/shared/SectionHeading';

const services = [
  {
    icon: Clock,
    title: 'Hourly / Acting Drivers',
    description: 'Professional drivers available on hourly basis for short trips, shopping, or events.',
  },
  {
    icon: Calendar,
    title: 'Daily & Full-Day Drivers',
    description: 'Book a driver for your entire day. Perfect for business meetings or sightseeing.',
  },
  {
    icon: CalendarDays,
    title: 'Weekly & Monthly Drivers',
    description: 'Long-term driver solutions for extended travel needs or regular commutes.',
  },
  {
    icon: Users,
    title: 'Permanent Drivers',
    description: 'Hire verified permanent drivers for your household or business needs.',
  },
  {
    icon: MapPin,
    title: 'Outstation Drivers',
    description: 'Experienced drivers for long-distance trips in your own car. Safety guaranteed.',
  },
  {
    icon: Car,
    title: 'Yellow Board Cars',
    description: 'Commercial vehicles with licensed drivers for business or cargo transport.',
  },
  {
    icon: ParkingCircle,
    title: 'Valet Parking',
    description: 'Professional valet services for events, restaurants, and corporate functions.',
  },
];

const trustPoints = [
  {
    icon: Shield,
    title: 'Background Verified',
    description: 'All drivers undergo thorough background checks and police verification.',
  },
  {
    icon: CheckCircle,
    title: 'Licensed & Insured',
    description: 'Every driver holds a valid license with proper documentation.',
  },
  {
    icon: Star,
    title: 'Rated & Reviewed',
    description: 'Choose drivers based on genuine customer ratings and feedback.',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your queries and emergencies.',
  },
];

const Index = () => {
  const whatsappLink = `https://wa.me/917604988481?text=${encodeURIComponent('Hi, I would like to book a driver.')}`;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Your Car. Our Driver.
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight"
            >
              Professional Acting Drivers{' '}
              <span className="text-primary">For Your Own Car</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
            >
              Hire verified, professional drivers on hourly, daily, monthly basis or for outstation trips. 
              Drive stress-free in your own car with our trusted driving partners.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/booking">
                <Button size="xl" className="w-full sm:w-auto gap-2">
                  Book a Driver
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="xl" className="w-full sm:w-auto gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Booking
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl"
        />
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Services"
            title="Driving Solutions For Every Need"
            description="From quick hourly trips to long-distance journeys, we provide professional drivers for all your travel requirements."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="outline" size="lg" className="gap-2">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Why Choose Us"
            title="Trust & Safety First"
            description="We prioritize your safety and convenience with thoroughly verified drivers and 24/7 support."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point, index) => (
              <TrustBadge
                key={point.title}
                icon={point.icon}
                title={point.title}
                description={point.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6"
            >
              Ready to Travel <span className="text-primary">Stress-Free?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-background/70 text-lg mb-10"
            >
              Book your verified driver now and enjoy a safe, comfortable journey in your own car.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/booking">
                <Button size="lg" className="w-full sm:w-auto">
                  Book Now
                </Button>
              </Link>
              <a href="tel:+919876543210">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-background/30 text-background hover:bg-background hover:text-foreground gap-2">
                  <Phone className="w-4 h-4" />
                  Call +91 98765 43210
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
