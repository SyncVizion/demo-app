import { Component, input } from '@angular/core';
import { DEFAULT_TIME_SLOTS, ScheduleDisplayTime } from '../models/schedule.model';

@Component({
  selector: 'app-schedule-time-slots',
  templateUrl: './schedule-time-slots.component.html',
  host: {
    class: 'schedule-time-slots',
    '[style.grid-template-rows]': "'repeat(' + this.timeSlots()?.length + ', 64px)'",
  },
  styleUrl: './schedule-time-slots.component.scss',
})
export class ScheduleTimeSlotsComponent {
  timeSlots = input<ScheduleDisplayTime[]>(DEFAULT_TIME_SLOTS);
  smallScreen = input<boolean>(false);
}
