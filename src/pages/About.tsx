import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Award, 
  Users, 
  Clock,
  CheckCircle,
  Car,
  Target,
  Heart
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/SectionHeading';

const stats = [
  { value: '50,000+', label: 'Trips Completed' },
  { value: '1,000+', label: 'Verified Drivers' },
  { value: 'Chennai', label: 'Service Area' },
  { value: '4.8/5', label: 'Customer Rating' },
];

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Every driver undergoes rigorous background verification, police checks, and skill assessments.',
  },
  {
    icon: Award,
    title: 'Professional Excellence',
    description: 'Our drivers are trained professionals who understand the responsibility of driving your personal vehicle.',
  },
  {
    icon: Clock,
    title: 'Always On Time',
    description: 'We value your time. Our drivers are punctual and committed to providing reliable service.',
  },
  {
    icon: Heart,
    title: 'Customer Care',
    description: '24/7 support team ready to assist you with any queries or concerns during your journey.',
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              About City Pro Drivers
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6"
            >
              Your Car. Our Driver.{' '}
              <span className="text-primary">Safe Journey.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl"
            >
              We connect you with verified, professional drivers who drive your own car with care and expertise. Whether it's a quick errand or a cross-country trip, we've got you covered.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <span className="font-display font-bold text-3xl md:text-4xl text-primary block mb-2">
                  {stat.value}
                </span>
                <span className="text-background/70">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Acting Driver */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                What We Do
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
                What is an Acting Driver?
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                An acting driver, also known as a call driver or hire driver, is a professional driver you can hire to drive your own personal vehicle. Unlike cab services, you stay in your own car while our trained driver takes the wheel.
              </p>
              <ul className="space-y-4">
                {[
                  'Drive your own car with a licensed professional',
                  'Perfect for events, parties, or long trips',
                  'No need to worry about parking or navigating',
                  'Available on hourly, daily, or monthly basis',
                  'Verified drivers with clean records',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-12 flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-48 h-48 bg-primary rounded-3xl flex items-center justify-center">
                  <Car className="w-24 h-24 text-primary-foreground" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-background" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Values"
            title="What Drives Us"
            description="We're committed to providing safe, reliable, and professional driving services."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                <Target className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To make every journey safe, convenient, and stress-free by connecting car owners with verified, professional drivers. We believe everyone deserves to travel comfortably in their own vehicle without the hassle of driving.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-4xl mb-6"
          >
            Ready to Experience the Difference?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-background/70 text-lg mb-8 max-w-xl mx-auto"
          >
            Book a verified driver today and enjoy a stress-free journey in your own car.
          </motion.p>
          <Link to="/booking">
            <Button size="lg">Book Your Driver</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
