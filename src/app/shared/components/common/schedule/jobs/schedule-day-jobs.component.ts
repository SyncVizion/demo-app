import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { booleanAttribute, Component, computed, DestroyRef, inject, input, model, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { tap } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { PopoverPanelComponent } from 'src/app/shared/components/core/popover/popover.component';
import { PopoverModule } from 'src/app/shared/components/core/popover/popover.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { JobAddUpdateDialogComponent } from 'src/app/shared/components/dialogs/job-add-dialog/job-add-update-dialog.component';
import { Job } from 'src/app/shared/models/accounts.model';
import { DateTimeExtractorPipe } from 'src/app/shared/pipes/date-hour.pipe';
import { CommonUtil } from 'src/services/common.util';
import { DialogService } from 'src/services/dialog.service';
import { JobService } from 'src/services/job.service';
import { DEFAULT_TIME_SLOTS, ScheduleDisplayTime, ScheduleUserRemove } from '../models/schedule.model';
import { ScheduleAdminJobEventComponent } from './job-event/schedule-admin-job-event.component';

@Component({
  selector: 'app-schedule-day-jobs',
  templateUrl: './schedule-day-jobs.component.html',
  styleUrl: './schedule-day-jobs.component.scss',
  host: {
    class: 'schedule-day-jobs',
    '[style.grid-template-rows]': "'repeat(' + timeSlots().length * 4 + ', 16px)'",
  },
  imports: [
    DatePipe,
    MatTooltip,
    MatMenuModule,
    MatIconModule,
    PopoverModule,
    DragDropModule,
    CdkDropList,
    ScheduleAdminJobEventComponent,
    DateTimeExtractorPipe,
    ButtonModule,
  ],
})
export class ScheduleDayJobsComponent {
  teamView = input(false, { transform: booleanAttribute });
  column = input<Date | string>();
  jobs = input<Job[]>([]);
  smallScreen = input<boolean>(false);
  timeSlots = input<ScheduleDisplayTime[]>(DEFAULT_TIME_SLOTS);
  jobUpdated = output<Job>();
  jobRemoved = output<Job>();
  userRemoved = output<ScheduleUserRemove>();

  dialogService = inject(DialogService);
  jobService = inject(JobService);
  popupService = inject(PopupService);
  destroyRef = inject(DestroyRef);

  columnId = computed(() => {
    if (this.teamView()) {
      return this.column();
    } else {
      return CommonUtil.formatDate(this.column(), 'yyyy-MM-dd');
    }
  });
  whileDragging = model(false);

  processDeleteLoading = false;
  loadingDeletable = true;
  isDeletable = false;

  onDropEvent(event: CdkDragDrop<string[]>) {
    this.updateTime(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.container.data = event.container.data ?? [];
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  updateTime(event: CdkDragDrop<string[]>) {
    let time = event.container.id.split(':');
    let date = new Date(`${time[0]}T00:00:00`);
    date.setHours(Number(time[1]));
    date.setMinutes(Number(time[2]));

    let job: Job = event.item.data;
    let jobTime = new Date(job.endTime).getTime() - new Date(job.startTime).getTime();

    job.startTime = CommonUtil.formatDate(date, "yyyy-MM-dd'T'HH:mm:ss");
    job.endTime = CommonUtil.formatDate(new Date(date.getTime() + jobTime), "yyyy-MM-dd'T'HH:mm:ss");
    this.jobUpdated.emit(job);
  }

  /**
   * When a job is clicked, this method opens the JobAddDialog to either edit or add a new job.
   *
   * @param job The job object that was clicked. If it's a new job, it will be an empty object.
   */
  onJobClick(panel: PopoverPanelComponent, job: Job): void {
    panel.close();

    this.dialogService
      .openDynamic(JobAddUpdateDialogComponent, {
        data: {
          job,
          // allowUserSelection: true,
        },
      })
      .onSaved()
      .pipe(
        tap((job) => this.onJobsUpdated(job)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  removeUserFromJob(job: Job, jobPanel: PopoverPanelComponent, removeUserPanel: PopoverPanelComponent) {
    this.popupService.showBottomMessage('Removing User from Job...');

    this.userRemoved.emit({ userId: Number(this.columnId()), job: job });
    jobPanel.close();
    removeUserPanel.close();

    return this.jobService.removeUser(job.id, Number(this.columnId())).subscribe({
      next: () => this.popupService.showBottomMessage('User Successfully Removed from Job', 5000),
      error: () =>
        this.popupService.showBottomMessage('Unable to remove user at this time. Please try again later.', 5000),
    });
  }

  /**
   * When a job is clicked, this method opens the JobAddDialog to either edit or add a new job.
   *
   * @param job The job object that was clicked. If it's a new job, it will be an empty object.
   */
  onJobDeleteClick(job: Job): void {
    this.loadingDeletable = true;
    this.isDeletable = false;

    this.jobService.isDeletable(job.id).subscribe((res) => {
      this.loadingDeletable = false;
      this.isDeletable = res;
    });
  }

  /**
   * Processes the job deletion after confirmation.
   *
   * @param job The job to be deleted.
   * @param jobPanel The popover panel displaying the job details.
   * @param jobDeletePanel The popover panel for confirming job deletion.
   */
  processJobDelete(job: Job, jobPanel: PopoverPanelComponent, jobDeletePanel: PopoverPanelComponent) {
    this.popupService.showBottomMessage('Deleting Job...');

    this.jobRemoved.emit(job);
    jobPanel.close();
    jobDeletePanel.close();

    return this.jobService.delete(job.id).subscribe({
      next: () => this.popupService.showBottomMessage('Job Successfully Deleted', 5000),
      error: () =>
        this.popupService.showBottomMessage('Unable to delete job at this time. Please try again later.', 5000),
    });
  }

  /**
   * Handles the updates to the job when a user is added or removed.
   *
   * @param modifiedJob The job that has been modified, either added or updated.
   * @param removed Indicates if the job was removed from the user.
   */
  onJobsUpdated(modifiedJob: Job, removed = false) {
    this.jobUpdated.emit(modifiedJob);
  }
}
