import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { LabelTag, LabelTagType } from 'src/app/shared/models/label-tag.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class LabelTagService {
  private readonly requestService = inject(RequestService);
  private readonly popupService = inject(PopupService);

  getByType(type: LabelTagType): Observable<LabelTag[]> {
    return this.requestService.get(`v1/label-tags/${type}/type`);
  }
}
