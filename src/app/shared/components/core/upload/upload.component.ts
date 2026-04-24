import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType, HttpHeaderResponse, HttpProgressEvent } from '@angular/common/http';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileItem, FileUploaderOptions, FileUploadModule } from 'ng2-file-upload';
import { catchError, forkJoin, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { ButtonModule } from '../button/button.module';
import { PopupService } from '../popup/popup.service';
import { BaseFileUploader } from './file-uploader.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [
    FileUploadModule,
    MatIconModule,
    CommonModule,
    ButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UploadComponent implements OnInit, OnDestroy {
  options: ModelSignal<FileUploaderOptions> = model();
  uploadProcessor: InputSignal<(f: FileItem) => Observable<HttpEvent<any>>> = input();
  multiple = input(false, { transform: booleanAttribute });
  totalFileSizeLimit = input(32); // Amount in MB
  acceptedExtensions = input('', { transform: (types: string[]) => types.map((type) => `.${type}`).join(', ') });
  acceptedTypes = input<string[]>();

  popupService = inject(PopupService);

  uploaded = output<FileItem[]>();
  fileAdded = output<void>();

  fileQueueChange = output<any>();

  uploader: BaseFileUploader;
  hasFileOver: boolean;
  addingFile = false;

  private readonly MAX_FILE_SIZE = computed(() => this.totalFileSizeLimit() * 1024 * 1024);
  private readonly stopPreviousUpload = new Subject<void>();

  /**
   * Initialize component
   */
  ngOnInit() {
    if (!this.options()) {
      this.options.set({
        url: '',
        maxFileSize: this.MAX_FILE_SIZE(),
        allowedFileType: this.acceptedTypes(),
      });
    }

    this.uploader = new BaseFileUploader(this.options());

    this.uploader.onAfterAddingFile = (file) => {
      this.addingFile = false;
      this.readURL(file);
      this.fileAdded.emit();
      this.fileQueueChange.emit(this.uploader.queue);
    };

    this.uploader.onAfterAddingAll = (files) => {
      const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
      if (totalSize > this.MAX_FILE_SIZE()) {
        this.popupService.error(
          `Selected files exceeds the maximum size limit of ${this.MAX_FILE_SIZE() / (1024 * 1024)} MB. Please select smaller files or reduce the number of files being uploaded.`,
        );
        this.uploader.clearQueue();
        this.fileQueueChange.emit(this.uploader.queue);
      }
    };
  }

  /**
   * Clean up the component and confirm it destroys the current upload if
   * there is one in progress.
   */
  ngOnDestroy() {
    this.stopPreviousUpload.next();
  }

  /**
   * Read the file URL and set it for file preview.
   */
  readURL(file: FileItem) {
    const selectedFile = file._file;
    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (event) => {
      file.url = event.target.result as string;
    };
  }

  /**
   * Handle upload button click
   */
  upload() {
    this.stopPreviousUpload.next();
    this.resetQueueFileStatus();

    const filesToUpload: Observable<HttpEvent<any>>[] = this.uploader.queue.map((f) => this.getFileObservable(f));

    forkJoin(filesToUpload)
      .pipe(takeUntil(this.stopPreviousUpload))
      .subscribe(() => this.uploaded.emit(this.uploader.queue));
  }

  /**
   * Remove item from the queue.
   *
   * @param item FileItem object
   */
  remove(item: FileItem) {
    this.resetQueueFileStatus();
    item.remove();
  }

  /**
   * Get list of files to upload
   *
   * @param item FileItem[] object
   */
  getFiles(): FileItem[] {
    return this.uploader.queue;
  }

  /**
   * Clears the queue, convenience method, also allows controlling behavior better.
   */
  clearQueue() {
    this.uploader.clearQueue();
  }

  /**
   * Sets hasFileOver for styling
   *
   * @param event Event
   */
  fileOver(e: any) {
    this.hasFileOver = e;
  }

  /**
   * Change event handler for file select input
   *
   * @param event Event
   */
  onChange(event: any) {
    if (event?.target) {
      event.target.value = '';
    }
  }

  /**
   * Gets the file observeable for the upload.
   *
   * @param f FileItem object
   * @returns Observable<any>
   */
  private getFileObservable(f: FileItem) {
    f.progress = 0;
    return this.uploadProcessor()(f).pipe(
      tap((event: HttpEvent<any>) => {
        if (event?.type === HttpEventType.UploadProgress) {
          this.updateFileProgress(f, event);
        } else if (event instanceof HttpHeaderResponse) {
          this.completeFileUpload(f);
        }
      }),
      catchError(() => this.errorFileUpload(f)),
    );
  }

  /**
   * Updates the file progress based on the progress event.
   *
   * @param f FileItem object
   * @param progressEvent  Http Progress Event
   */
  private updateFileProgress(f: FileItem, progressEvent: HttpProgressEvent) {
    if (f.progress <= 99) {
      f.progress = (100 * progressEvent.loaded) / progressEvent.total;
    }
  }

  /**
   * Completes the file upload process.
   *
   * @param f FileItem object
   */
  private completeFileUpload(f: FileItem) {
    f.progress = 100;
    f.isUploaded = true;
    f.isUploading = false;
    f.isSuccess = true;
  }

  /**
   * Error handling for file upload.
   *
   * @param f FileItem object
   * @returns Observable<any>
   */
  private errorFileUpload(f: FileItem): Observable<any> {
    f.isUploaded = true;
    f.isUploading = false;
    f.isError = true;
    return of(null);
  }

  /**
   * Resets the file queue status. This will reset all the statuses of the files in the queue.
   */
  private resetQueueFileStatus() {
    this.uploader.queue.forEach((f) => {
      f.isUploaded = false;
      f.isUploading = false;
      f.isSuccess = false;
      f.isError = false;
    });
  }
}
