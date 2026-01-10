export interface RegisterCourierDto {
  userId: string;
  fullName: string;
  phone: string;
  vehicleType?: string;
  licensePlate?: string;
}

export interface UpdateCourierDto {
  fullName?: string;
  phone?: string;
  vehicleType?: string;
  licensePlate?: string;
}
