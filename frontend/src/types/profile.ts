export interface BankInfo {
  bankName: string;
  accountType: string;
  accountNumber: string;
  agency: string;
  pixKey: string;
  verified?: boolean;
}

export interface NotificationSettings {
  newSubscriber: boolean;
  newMessage: boolean;
  newPurchase: boolean;
  newTip: boolean;
}

export interface ProfileData {
  name?: string;
  email: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  verificationStatus?: {
    emailVerified: boolean;
    cpfVerified: boolean;
    phoneVerified: boolean;
    bankVerified?: boolean;
  };
  bankInfo?: BankInfo;
  notifications?: NotificationSettings;
} 