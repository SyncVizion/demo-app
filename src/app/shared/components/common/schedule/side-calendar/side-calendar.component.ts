import { animate, state, style, transition, trigger } from '@angular/animations';
import { booleanAttribute, Component, input, output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { CalendarComponent } from '../calendar/calendar.component';

export const calendarCollapseExpansion = trigger('bodyExpansion', [
  state('collapsed', style({ width: '0px', visibility: 'hidden' })),
  state('expanded', style({ width: '*', visibility: 'visible' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

@Component({
  selector: 'app-side-calendar',
  templateUrl: './side-calendar.component.html',
  styleUrl: './side-calendar.component.scss',
  imports: [HeaderModule, ButtonModule, RouterModule, MatMenuModule, IconModule, CalendarComponent],
})
export class SideCalendarComponent {
  selectedDate = input<Date>(new Date());
  expanded = input(true);
  autoHeight = input(false, { transform: booleanAttribute });
  onDateChange = output<Date>();
}
