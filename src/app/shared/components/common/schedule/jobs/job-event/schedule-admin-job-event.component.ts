import { DatePipe } from '@angular/common';
import { booleanAttribute, Component, computed, input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import {
  DEFAULT_TIME_SLOTS,
  ScheduleDisplayTime,
} from 'src/app/shared/components/common/schedule/models/schedule.model';
import { Job, ScheduleJob } from 'src/app/shared/models/accounts.model';

@Component({
  selector: 'app-schedule-admin-job-event',
  templateUrl: './schedule-admin-job-event.component.html',
  styleUrl: './schedule-admin-job-event.component.scss',
  host: {
    class: 'schedule-job-event',
    '[class.position-absolute]': 'isDragging()',
    '[class.schedule-job-event__placeholder]': 'placeholder()',
    '[style.height]': 'display()?.height',
    '[style.background-color]': 'display()?.backgroundColor',
    '[style.border]': 'display()?.border',
    '[style.border-left]': 'display()?.borderLeft',
  },
  imports: [DatePipe, MatMenuModule],
})
export class ScheduleAdminJobEventComponent {
  readonly ROW_HOUR_HEIGHT = 64; // Height of each row in pixels
  readonly DEFAULT_STATUS_COLOR = '#607d8b'; // Default color for job status if not specified

  job = input.required<Job>();
  timeSlots = input<ScheduleDisplayTime[]>(DEFAULT_TIME_SLOTS);
  placeholder = input(false, { transform: booleanAttribute });
  isDragging = input(false, { transform: booleanAttribute });
  display = computed(() => this.buildJobDisplayItem(this.job(), this.timeSlots()[0].value ?? 0));

  /**
   * Builds the display item for a job based on its start and end times, and the current view mode (HORIZONTAL or VERTICAL).
   *
   * @param job The job object containing details like start time, end time, and status.
   * @param timeSlotHourStart The hour at which the time slots start (e.g., 6 for 6:00 AM).
   * @returns A ScheduleJob object containing CSS styles for displaying the job in the schedule.
   */
  buildJobDisplayItem(job: Job, timeSlotHourStart: number): ScheduleJob {
    let display: ScheduleJob = {
      color: job?.status?.color ?? this.DEFAULT_STATUS_COLOR,
      backgroundColor: (job?.status?.color ?? this.DEFAULT_STATUS_COLOR) + '30', // Fallback to default color with transparency
      border: `1px solid ${job?.status?.color ?? this.DEFAULT_STATUS_COLOR}`,
      borderLeft: `4px solid ${job?.status?.color ?? this.DEFAULT_STATUS_COLOR}`,
    };

    const startDate = new Date(job.startTime);
    const endDate = new Date(job.endTime);
    const start = this.getTimeSlotIndex(startDate.getHours(), startDate.getMinutes(), timeSlotHourStart);
    const end = this.getTimeSlotIndex(endDate.getHours(), endDate.getMinutes(), timeSlotHourStart);

    display = {
      ...display,
      height: (end - start) * (this.ROW_HOUR_HEIGHT / 4) + 'px',
    };

    return display;
  }

  /**
   * Gets the time slot index based on the provided hours and minutes. For Example, if the time slot starts at 8 AM,
   * the first slot is 8:00 AM - 8:15 AM, the second slot is 8:15 AM - 8:30 AM, and so on. There are 4 slots per hour,
   * so assuming the time slot start is 6:00 AM the index is calculated as follows:
   * * For 8:00 AM, the index is (8 - 6) * 4 + 2 = 10
   *
   * @param hours The hour of the day in 24-hour format (0-23)
   * @param minutes The minutes of the hour (0-59)
   * @param timeSlotHourStart The hour at which the time slots start (e.g., 6 for 6:00 AM)
   * @returns The index of the time slot, where each hour has 4 slots (15 minutes each).
   */
  getTimeSlotIndex(hours: number, minutes: number, timeSlotHourStart: number): number {
    const hourIndex = (hours - timeSlotHourStart) * 4 + 2;
    const minuteIndex = Math.floor(minutes / 15);
    return hourIndex + minuteIndex;
  }
}
