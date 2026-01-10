import { WorkingHours } from "../entities/working-hours.entity";

export interface IWorkingHoursRepository {
  create(workingHours: WorkingHours): Promise<WorkingHours>;
  findByVendorId(vendorId: string): Promise<WorkingHours[]>;
  upsert(workingHours: WorkingHours): Promise<void>;
  deleteByVendorAndDay(vendorId: string, dayOfWeek: number): Promise<void>;
}
