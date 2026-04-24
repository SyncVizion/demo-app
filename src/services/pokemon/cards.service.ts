import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { Page } from 'src/app/shared/models/common.model';
import { PokemonCard } from 'src/app/shared/models/pokemon-card.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private readonly requestService = inject(RequestService);
  private readonly popupService = inject(PopupService);

  get(params?: Map<string, string[]>): Observable<Page<PokemonCard>> {
    return this.requestService.get(`v1/pokemon`, params);
  }

  getById(id: string): Observable<PokemonCard> {
    return this.requestService.get(`v1/pokemon/${id}`).pipe(
      catchError((error) => {
        this.popupService.errorBottom('Card ' + error?.statusText + ' For: ' + id || 'Service Error');
        return error;
      }),
    );
  }
}
