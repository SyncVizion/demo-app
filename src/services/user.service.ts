import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/shared/models/common.model';
import { UserAccess } from 'src/app/shared/models/user-access.model';
import { User } from 'src/app/shared/models/user.model';
import { RequestService } from './request/request.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly requestService = inject(RequestService);

  getUsers(params: Map<string, string[]>): Observable<Page<User>> {
    return this.requestService.get(`v1/user`, params);
  }

  getById(id: string): Observable<any> {
    return this.requestService.get(`v1/user/${id}`);
  }

  emailExist(email): Observable<any> {
    return this.requestService.get(`v1/user/email/exist`, new Map().set('email', [email]));
  }

  getCurrentUser(): Observable<any> {
    return this.requestService.get(`v1/user/current`);
  }

  getUserAccess(): Observable<UserAccess> {
    return this.requestService.get(`v1/user/access`);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.requestService.put<User>(`v1/user`, user);
  }

  updateUserById(id: any, user: User): Observable<User> {
    return this.requestService.put<User>(`v1/user/${id}`, user);
  }

  updateUserPassword(passUpdate: any): Observable<any> {
    return this.requestService.put('v1/user/credentials', passUpdate);
  }

  adminUpdateUserPassword(updateUserId: any, passUpdate: any): Observable<any> {
    return this.requestService.put(`v1/user/credentials/${updateUserId}`, passUpdate);
  }

  createUser(user: User): Observable<User> {
    return this.requestService.post<User>(`v1/user`, user);
  }

  delete(userId: any): Observable<any> {
    return this.requestService.delete(`v1/user/${userId}`);
  }
}
