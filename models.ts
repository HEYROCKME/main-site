export type Donation = {
  KID: string;
  donor: string;
  donorId: number;
  email: string;
  id: number;
  paymentMethod: string;
  sum: string;
  timestamp: string;
  transactionCost: string;
};

export type AvtaleGiroAgreement = {
  ID: number;
  active: boolean;
  amount: string;
  KID: string;
  payment_date: number;
  created: string;
  last_updated: string;
  notice: boolean;
  full_name: string;
};

export type VippsAgreement = {
  ID: number;
  status: "EXPIRED" | "PENDING" | "ACTIVE" | "STOPPED";
  donorID: number;
  full_name: string;
  KID: string;
  timestamp_created: string;
  monthly_charge_day: number;
  force_charge_date: boolean;
  paused_until_date: string;
  amount: number;
  agreement_url_code: string;
};

export type Distribution = {
  kid: string;
  organizations: {
    id: number;
    name: string;
    share: string;
  }[];
};

export type Donor = {
  id: string;
  name: string;
  email: string;
  ssn: string;
  newsletter: boolean;
  registered: string;
};

export type AggregatedDonations = {
  abbriv: string;
  organization: string;
  organizationId: number;
  value: string;
  year: number;
};

export type DonationGraphData = {
  name: string;
};

export type Organization = {
  id: number;
  name: string;
  abbriv: string;
  shortDesc: string;
  standardShare: number;
  infoUrl: string;
};
