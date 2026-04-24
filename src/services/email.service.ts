import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/shared/models/common.model';
import { BatchEmail, Email, EmailTemplate } from 'src/app/shared/models/email.model';
import { RequestService } from './request/request.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly requestService = inject(RequestService);


  get(params: Map<string, string[]>): Observable<Page<Email>> {
    return this.requestService.get<Page<Email>>(`v1/mail`, params);
  }

  getTemplates(): Observable<EmailTemplate[]> {
    return this.requestService.get<EmailTemplate[]>(`v1/mail/templates`);
  }

  send(batchEmail: BatchEmail): Observable<void> {
    return this.requestService.post<void>(`v1/mail/batch`, batchEmail);
  }
}
