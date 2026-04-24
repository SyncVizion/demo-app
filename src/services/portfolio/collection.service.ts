import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { Collection, CollectionCard } from 'src/app/shared/models/collection.model';
import { Page } from 'src/app/shared/models/common.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly requestService = inject(RequestService);
  private readonly popupService = inject(PopupService);

  get(params?: Map<string, string[]>): Observable<Page<any>> {
    return this.requestService.get(`v1/collections`, params);
  }

  getList(): Observable<any[]> {
    return this.requestService.get(`v1/collections/list`);
  }

  getById(id: string): Observable<any> {
    return this.requestService.get(`v1/collections/${id}`);
  }

  getByIdPublic(id: string): Observable<any> {
    return this.requestService.get(`v1/collections/public/${id}`);
  }

  getCardsByCollectionId(id: string, params: Map<string, string[]>): Observable<Page<any>> {
    params.set('collectionId', [id]);
    return this.requestService.get(`v1/collections/cards`, params);
  }

  getCollectionsByCardId(cardId: string): Observable<any[]> {
    return this.requestService.get(`v1/collections/cards/${cardId}`);
  }

  updateCardQuantity(collectionCard: any): Observable<any> {
    return this.requestService.put(`v1/collections/quantity`, collectionCard);
  }

  addCard(collectionId: number, card: CollectionCard): Observable<any> {
    return this.requestService.put(`v1/collections/add`, {
      collectionId: collectionId,
      cardSource: { id: card.id },
      name: card.name,
      localId: card.localId,
      cardType: card.cardType,
      condition: card.condition,
      quantity: card.quantity,
    });
  }

  removeCard(collectionId: number, collectionCardId: number): Observable<any> {
    return this.requestService.put(`v1/collections/remove`, { collectionId: collectionId, id: collectionCardId });
  }

  create(body: Collection): Observable<any> {
    return this.requestService.post(`v1/collections`, body);
  }

  update(id: number, body: Collection): Observable<any> {
    return this.requestService.put(`v1/collections/update/${id}`, body);
  }

  delete(id: number): Observable<any> {
    return this.requestService.delete(`v1/collections/${id}`);
  }
}
