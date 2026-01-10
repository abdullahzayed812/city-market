export interface WorkingHours {
  id: string;
  vendorId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}
