import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/shared/models/common.model';
import { PokemonCardSet, PokemonSet } from 'src/app/shared/models/pokemon-card.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class SetsService {
  private readonly requestService = inject(RequestService);

  get(params?: Map<string, string[]>): Observable<Page<PokemonSet>> {
    return this.requestService.get(`v1/pokemon/sets`, params);
  }

  getCards(params?: Map<string, string[]>): Observable<Page<PokemonCardSet>> {
    return this.requestService.get(`v1/pokemon/sets/cards`, params);
  }

  getById(id: string): Observable<PokemonSet> {
    return this.requestService.get(`v1/pokemon/sets/${id}`);
  }
}
