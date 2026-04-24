import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { UrlService } from '../request/url.service';
import { Notification } from './notification.model';
import { STOMP_SOCKET_CONFIG } from './stomp.config';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService extends RxStomp {
  private readonly urlService = inject(UrlService);
  private readonly authService = inject(AuthService);

  readonly TOKEN_NAME = 'auth-token';

  constructor() {
    super();
  }

  /**
   * Initialize the socket connection. This will only initialize if the connection
   * is not already established.
   */
  init() {
    if (!this.active) {
      this.configure(STOMP_SOCKET_CONFIG);
      this.configure({
        brokerURL: `${this.urlService.getSocketAPIUrl()}?${this.getToken()}`,
      });

      this.listenForDisconnect();
      this.activate();
    }
  }

  /**
   * Disconnects all STOMP socket connections.
   */
  disconnect() {
    if (this.active) {
      this.deactivate();
    }
  }

  /**
   * This will listen to the websocket url for any request and show it to the
   * provided user.
   *
   * @param destination What socket path to listen too.
   * @param userSession Determines if the connection is unique to the user.
   * @returns Observable of the caught Notification object.
   */
  listen(des: string, userSession: boolean = false): Observable<Notification> {
    return this.subscriptionSession().pipe(
      switchMap((session) =>
        super.watch(this.buildSocketPath(des, session, userSession)).pipe(map((res: Message) => JSON.parse(res.body))),
      ),
    );
  }

  /**
   * Builds out the socket path for the subscription. If the connection desires that it
   * be user specific then it will append the users unique sesion id to the
   * subscription call.
   *
   * @param des Where the subscription should take place.
   * @param ses The unique user session id.
   * @returns String of the built socket path.
   */
  private buildSocketPath(des: string, uuid: string, userSes: boolean): string {
    return userSes ? `${des}-${uuid}` : des;
  }

  /**
   * Gets the session id for the user. This will be a UUID that will
   * only belong to this user logged in.
   *
   * @returns Observable of the session id.
   */
  private subscriptionSession() {
    return this.serverHeaders$.pipe(map((session) => session['user-name']));
  }

  /**
   * Listen for when socket connection breaks. If it breaks then it means the
   * server is down or the users token has expired.
   */
  private listenForDisconnect() {
    this.connectionState$
      .pipe(
        filter((c) => c === RxStompState.CLOSED),
        filter(() => !this.authService.isAuthenticated$),
      )
      .subscribe(() => this.authService.logout());
  }

  /**
   * Gets the token from local storage. This is used to authenticate the user on
   * the socket connection.
   *
   * @returns The users token from local storage.
   */
  private getToken() {
    return localStorage.getItem(this.TOKEN_NAME);
  }
}
