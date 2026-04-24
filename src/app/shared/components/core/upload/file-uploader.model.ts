import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

export class BaseFileUploader extends FileUploader {
  constructor(options: FileUploaderOptions) {
    super(options);
  }
}
