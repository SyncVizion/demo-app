import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConcreteFormData } from 'src/app/shared/models/page-builder.model';
import { RequestService } from './request/request.service';

@Injectable({
  providedIn: 'root',
})
export class ConcreteFormService {
  private readonly requestService = inject(RequestService);


  get(params: Map<string, string[]>): Observable<any> {
    return this.requestService.get<any>(`v1/form-data`, params);
  }

  getById(id: string): Observable<ConcreteFormData> {
    return this.requestService.get<ConcreteFormData>(`v1/form-data/${id}`);
  }

  create(form: any): Observable<any> {
    return this.requestService.post<any>(`v1/form-data`, form);
  }

  update(form: any): Observable<any> {
    return this.requestService.put<any>(`v1/form-data`, form);
  }
}
