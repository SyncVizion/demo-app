import { Job } from 'src/app/shared/models/accounts.model';

export interface ScheduleDate {
  date: Date;
  jobs?: Job[];
}

export interface ScheduleTimeSlot {
  start: Date;
  end: Date;
}

export interface ScheduleDisplayTime {
  display: string;
  value: number;
}

export interface ScheduleUserRemove {
  userId?: number;
  job: Job;
}

export interface ScheduleUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  alias?: string;
  initials?: string;
  chipColor?: string;
  jobs?: Job[];
}

export interface UserSchedulePreferences {
  view: 'HORIZONTAL' | 'VERTICAL';
  timeSlots: ScheduleDisplayTime[];
}

export const SCHEDULE_LOADING_USERS: ScheduleUser[] = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export const DEFAULT_TIME_SLOTS: ScheduleDisplayTime[] = [
  { display: '12 AM', value: 0 },
  { display: '1 AM', value: 1 },
  { display: '2 AM', value: 2 },
  { display: '3 AM', value: 3 },
  { display: '4 AM', value: 4 },
  { display: '5 AM', value: 5 },
  { display: '6 AM', value: 6 },
  { display: '7 AM', value: 7 },
  { display: '8 AM', value: 8 },
  { display: '9 AM', value: 9 },
  { display: '10 AM', value: 10 },
  { display: '11 AM', value: 11 },
  { display: '12 PM', value: 12 },
  { display: '1 PM', value: 13 },
  { display: '2 PM', value: 14 },
  { display: '3 PM', value: 15 },
  { display: '4 PM', value: 16 },
  { display: '5 PM', value: 17 },
  { display: '6 PM', value: 18 },
  { display: '7 PM', value: 19 },
  { display: '8 PM', value: 20 },
  { display: '9 PM', value: 21 },
  { display: '10 PM', value: 22 },
  { display: '11 PM', value: 23 },
];

export const DRAG_TIME_SLOTS: ScheduleDisplayTime[] = [
  { display: '12 AM', value: 0 },
  { display: '1 AM', value: 1 },
  { display: '2 AM', value: 2 },
  { display: '3 AM', value: 3 },
  { display: '4 AM', value: 4 },
  { display: '5 AM', value: 5 },
  { display: '6 AM', value: 6 },
  { display: '7 AM', value: 7 },
  { display: '8 AM', value: 8 },
  { display: '9 AM', value: 9 },
  { display: '10 AM', value: 10 },
  { display: '11 AM', value: 11 },
  { display: '12 PM', value: 12 },
  { display: '1 PM', value: 13 },
  { display: '2 PM', value: 14 },
  { display: '3 PM', value: 15 },
  { display: '4 PM', value: 16 },
  { display: '5 PM', value: 17 },
  { display: '6 PM', value: 18 },
  { display: '7 PM', value: 19 },
  { display: '8 PM', value: 20 },
  { display: '9 PM', value: 21 },
  { display: '10 PM', value: 22 },
  { display: '11 PM', value: 23 },
];
