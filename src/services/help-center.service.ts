import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request/request.service';

@Injectable({
  providedIn: 'root',
})
export class HelpCenterService {
  constructor(private readonly requestService: RequestService) {}

  submitFeatureRequest(data: any): Observable<any> {
    return this.requestService.post('v1/help-center/feature', data);
  }

  submitBugRequest(data: any): Observable<any> {
    return this.requestService.post('v1/help-center/bug', data);
  }
}
