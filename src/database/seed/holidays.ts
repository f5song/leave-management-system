import { HolidayEntity } from "../entity/holidays.entity";

export const holidaysSeedData: Partial<HolidayEntity>[] = [
    {
      title: 'New Year\'s Day',
      startDate: new Date('2025-01-01T00:00:00'),
      endDate: new Date('2025-01-01T23:59:59'),
      totalDays: 1,
      color: '#FF0000',
      createdById: 'uuid-admin-1',  
      description: 'วันขึ้นปีใหม่',
    },
    {
      title: 'Labor Day',
      startDate: new Date('2025-05-01T00:00:00'),
      endDate: new Date('2025-05-01T23:59:59'),
      totalDays: 1,
      color: '#00FF00',
      createdById: 'uuid-admin-1',
      description: 'วันแรงงาน',
    },
  ];
  