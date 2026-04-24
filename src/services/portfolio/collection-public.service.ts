import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionPublicService {
  private readonly requestService = inject(RequestService);

  getById(id: string): Observable<any> {
    return this.requestService.get(`v1/collections/public/${id}`);
  }
}
