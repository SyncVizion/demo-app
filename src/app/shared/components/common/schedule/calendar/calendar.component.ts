import { booleanAttribute, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { isEqual } from 'date-fns';
import { AppOverlayLoaderDirective } from 'src/app/shared/directives/overlay-loader.directive';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  host: {
    class: 'app-calendar-container',
  },
  imports: [MatIconModule, AppOverlayLoaderDirective],
})
export class CalendarComponent {
  view: 'MONTH' | 'DAY' = 'MONTH';
  currentDate = input<Date>(new Date());
  floating = input(false, { transform: booleanAttribute });
  dateChange = output<Date>();

  currentMonth = this.currentDate().getMonth();
  currentYear = this.currentDate().getFullYear();

  calendarDays: { date: Date; isOtherMonth: boolean }[] = [];
  selectedDate: Date = null;
  loading = false;

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  ngOnInit() {
    this.selectedDate = this.currentDate();
    this.generateCalendar();
  }

  onDateSelected(date: Date) {
    if (!isEqual(date, this.selectedDate)) {
      this.selectedDate = date;
      this.dateChange.emit(date);
    }
  }

  generateCalendar() {
    this.calendarDays = [];

    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // Sunday = 0
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Step 1: Add trailing days from previous month to align first day
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, -i);
      this.calendarDays.push({ date, isOtherMonth: true });
    }

    // Step 2: Add current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.calendarDays.push({ date, isOtherMonth: false });

      // Stop adding more days if calendar already has 35 days
      if (this.calendarDays.length >= 35) break;
    }

    // Step 3: Fill remaining slots from next month to ensure exactly 35 days
    while (this.calendarDays.length < 35) {
      const lastDate = this.calendarDays[this.calendarDays.length - 1].date;
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      this.calendarDays.push({ date: nextDate, isOtherMonth: true });
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }
}
