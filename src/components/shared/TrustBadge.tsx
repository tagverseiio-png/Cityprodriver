import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function TrustBadge({ icon: Icon, title, description, delay = 0 }: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="flex items-start gap-4 p-4"
    >
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <h4 className="font-display font-semibold mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
