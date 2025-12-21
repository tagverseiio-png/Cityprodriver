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
  };
  commission?: number;
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
    },
    outstationTariff: {
      perDayMinKms: 0,
      perDayAmount: 0,
      extraPerKm: 0,
      driverBatta: 0,
    },
    commission: 40,
    nightCharges: {
      time4am: 100,
      time6am: 50,
      description: 'Night-fare applies: after 10:00 PM to before 12:00 AM, and after 4:00 AM to before 6:00 AM',
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
    },
  },
];

export const getTariffByVehicleType = (vehicleType: string): TariffDetails | undefined => {
  return VEHICLE_TARIFFS.find(t => t.vehicleType === vehicleType);
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
