export interface TariffDetails {
  vehicleType: string;
  displayName: string;
  localTariff: {
    minHours: number;
    minKms: number;
    amount: number;
    extraPerHour: number;
    extraPerKm: number;
    additionalPackages?: {
      hours: number;
      kms: number;
      amount: number;
    }[];
  };
  outstationTariff: {
    perDayMinKms: number;
    perDayAmount: number;
    extraPerKm: number;
    driverBatta: number;
    extraPerHour?: number;
    foodAllowance: number;
    accommodation: string;
  };
  nightCharges?: {
    time4am: number;
    time6am: number;
    description: string;
  };
}

export const VEHICLE_TARIFFS: TariffDetails[] = [
  {
    vehicleType: 'acting-driver',
    displayName: 'Acting Driver (Hourly)',
    localTariff: {
      minHours: 4,
      minKms: 0,
      amount: 450,
      extraPerHour: 100,
      extraPerKm: 0,
      additionalPackages: [
        { hours: 6, kms: 0, amount: 700 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 0,
      perDayAmount: 1300,
      extraPerKm: 0,
      driverBatta: 200,
      extraPerHour: 100,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
    nightCharges: {
      time4am: 100,
      time6am: 50,
      description: 'Early morning charges: 12am-5am ₹100, 5am-8am ₹50 & Late night charges: 10pm-12am ₹50',
    },
  },
  {
    vehicleType: 'valet-parking',
    displayName: 'Valet Parking',
    localTariff: {
      minHours: 4,
      minKms: 0,
      amount: 600,
      extraPerHour: 130,
      extraPerKm: 0,
    },
    outstationTariff: {
      perDayMinKms: 0,
      perDayAmount: 0,
      extraPerKm: 0,
      driverBatta: 0,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'etios',
    displayName: 'Etios / Dzire',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 1400,
      extraPerHour: 280,
      extraPerKm: 14,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 2800 },
        { hours: 12, kms: 120, amount: 4200 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 3500,
      extraPerKm: 14,
      driverBatta: 600,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'innova',
    displayName: 'Innova',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 2000,
      extraPerHour: 400,
      extraPerKm: 20,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 4000 },
        { hours: 12, kms: 120, amount: 6000 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 5000,
      extraPerKm: 20,
      driverBatta: 700,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'crysta',
    displayName: 'Crysta',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 2200,
      extraPerHour: 440,
      extraPerKm: 22,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 4400 },
        { hours: 12, kms: 120, amount: 6600 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 5500,
      extraPerKm: 22,
      driverBatta: 700,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'hycross',
    displayName: 'Hycross',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 2400,
      extraPerHour: 500,
      extraPerKm: 25,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 4800 },
        { hours: 12, kms: 120, amount: 7200 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 6250,
      extraPerKm: 25,
      driverBatta: 700,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'corolla',
    displayName: 'Corolla Altis',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 2400,
      extraPerHour: 480,
      extraPerKm: 25,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 4800 },
        { hours: 12, kms: 120, amount: 7200 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 6250,
      extraPerKm: 25,
      driverBatta: 600,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'tempo-12',
    displayName: 'Tempo Traveller 12 Seater A/C',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 2500,
      extraPerHour: 500,
      extraPerKm: 25,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 5000 },
        { hours: 12, kms: 120, amount: 7500 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 6250,
      extraPerKm: 25,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'tourister',
    displayName: 'Mahindra Tourister',
    localTariff: {
      minHours: 4,
      minKms: 40,
      amount: 2500,
      extraPerHour: 500,
      extraPerKm: 25,
      additionalPackages: [
        { hours: 8, kms: 80, amount: 5000 },
        { hours: 12, kms: 120, amount: 7500 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 6250,
      extraPerKm: 25,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'minibus-20-nonac',
    displayName: 'Mini Bus 20 Seater (Non A/C)',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 7500,
      extraPerHour: 750,
      extraPerKm: 35,
      additionalPackages: [
        { hours: 12, kms: 120, amount: 11250 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 300,
      perDayAmount: 10500,
      extraPerKm: 35,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'minibus-20',
    displayName: 'Mini Bus 20 Seater',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 8500,
      extraPerHour: 850,
      extraPerKm: 38,
      additionalPackages: [
        { hours: 12, kms: 120, amount: 12750 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 300,
      perDayAmount: 11400,
      extraPerKm: 38,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'bus-25',
    displayName: '25 Seater Bus',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 12000,
      extraPerHour: 1200,
      extraPerKm: 40,
      additionalPackages: [
        { hours: 12, kms: 120, amount: 18000 },
      ],
    },
    outstationTariff: {
      perDayMinKms: 300,
      perDayAmount: 12000,
      extraPerKm: 40,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'camry',
    displayName: 'Toyota Camry',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 8500,
      extraPerHour: 1100,
      extraPerKm: 75,
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 18750,
      extraPerKm: 75,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'benz-e-bmw-5',
    displayName: 'Benz (E Class) / BMW (5 Series)',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 12000,
      extraPerHour: 1300,
      extraPerKm: 105,
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 26250,
      extraPerKm: 105,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'benz-s',
    displayName: 'Benz (S Class)',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 19500,
      extraPerHour: 1500,
      extraPerKm: 160,
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 40000,
      extraPerKm: 160,
      driverBatta: 1000,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'bus-45',
    displayName: 'Benz / Volvo Bus (45 Seater)',
    localTariff: {
      minHours: 10,
      minKms: 100,
      amount: 19500,
      extraPerHour: 1900,
      extraPerKm: 90,
    },
    outstationTariff: {
      perDayMinKms: 300,
      perDayAmount: 27000,
      extraPerKm: 90,
      driverBatta: 1300,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
  {
    vehicleType: 'rolls-royce',
    displayName: 'Rolls Royce',
    localTariff: {
      minHours: 8,
      minKms: 80,
      amount: 90000,
      extraPerHour: 10500,
      extraPerKm: 800,
    },
    outstationTariff: {
      perDayMinKms: 250,
      perDayAmount: 200000,
      extraPerKm: 800,
      driverBatta: 1500,
      foodAllowance: 200,
      accommodation: 'Proper accommodation required for drivers during night stays',
    },
  },
];

export const getTariffByVehicleType = (vehicleType: string): TariffDetails | undefined => {
  return VEHICLE_TARIFFS.find(t => t.vehicleType === vehicleType);
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateNightCharges = (time: string): { amount: number; description: string } => {
  if (!time) return { amount: 0, description: '' };
  
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  // 12 AM to 5 AM: 100 rs
  // 00:00 to 05:00
  if (totalMinutes >= 0 && totalMinutes < 300) {
    return { amount: 100, description: 'Early Morning Charge (12 AM - 5 AM): ₹100' };
  }

  // 5 AM to 8 AM: 50 rs
  // 05:00 to 08:00
  if (totalMinutes >= 300 && totalMinutes < 480) {
    return { amount: 50, description: 'Early Morning Charge (5 AM - 8 AM): ₹50' };
  }

  // 10 PM to 12 AM: 50 rs
  // 22:00 to 24:00
  if (totalMinutes >= 1320 && totalMinutes < 1440) {
    return { amount: 50, description: 'Late Night Charge (10 PM - 12 AM): ₹50' };
  }

  return { amount: 0, description: '' };
};