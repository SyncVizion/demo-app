import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preference } from 'src/app/shared/models/preference.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class PreferenceService {
  requestService = inject(RequestService);

  getByKey<T>(key: string): Observable<Preference<T>> {
    return this.requestService.get<Preference<T>>(`v1/user/preference`, new Map().set('preferenceKey', [key]));
  }

  set(key: string, preferences: any): Observable<Preference<any>> {
    return this.requestService.post(`v1/user/preference`, { preferenceKey: key, preferences });
  }
}
