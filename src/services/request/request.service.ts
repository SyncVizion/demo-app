import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FileItem } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';

/**
 * Common Request Service
 *
 * @author Sam Butler
 * @since Dec 15, 2020
 */
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private readonly urlService = inject(UrlService);
  private readonly http = inject(HttpClient);

  /**
   * Get request service that will add the given parameters provided
   * and call the given url.
   *
   * @param url to call
   * @param params params to add to endpoint
   * @returns observable of the passed in object
   */
  get<T>(url: string, params?: Map<string, string[]>): Observable<T> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}?`;
    if (params) {
      params.forEach((value, key) => (endpoint = `${endpoint}${key}=${value}&`));
    }
    return this.http.get<T>(endpoint.slice(0, -1));
  }

  /**
   * Handle text string get requests.
   *
   * @param url the request url
   * @param params the request params
   */
  public getText(url: string, params?: Map<string, string[]>): Observable<string> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}?`;
    if (params) {
      params.forEach((value, key) => (endpoint = `${endpoint}${key}=${value}&`));
    }
    return this.http.get(endpoint, { responseType: 'text' });
  }

  /**
   * Post the given body to the passed in endpoint
   *
   * @param url to post body too
   * @param body to be posted to the endpoint
   * @returns observable of the passed in object
   */
  post<T>(url: string, body?: any): Observable<T> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}`;
    return this.http.post<T>(endpoint, body);
  }

  /**
   * Put the given body to the passed in endpoint
   *
   * @param url to post body too
   * @param body to be posted to the endpoint
   * @returns observable of the passed in object
   */
  put<T>(url: string, body?: any): Observable<T> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}`;
    return this.http.put<T>(endpoint, body);
  }

  /**
   * Delete the given data for the url.
   *
   * @param url The url to delete from.
   * @returns observable of the passed in object
   */
  delete<T>(url: string): Observable<T> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}`;
    return this.http.delete<T>(endpoint);
  }

  /**
   * Perform a download on the called endpoint.
   *
   * @param url to call.
   * @param params params to add to endpoint.
   * @returns Blob donwload of the passed in object.
   */
  download(url: string, params?: Map<string, string[]>): Observable<Blob> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}?`;
    if (params) {
      params.forEach((value, key) => {
        endpoint = `${endpoint}${key}=${value}&`;
      });
    }
    return this.http.get(endpoint.slice(0, -1), {
      responseType: 'blob',
    });
  }

  /**
   * Perform a download on the called url.
   *
   * @param url to call.
   * @returns Blob donwload of the passed in object.
   */
  downloadAssetsImage(url: string): Observable<ArrayBuffer> {
    return this.http.get(url, {
      observe: 'body',
      responseType: 'arraybuffer',
    });
  }

  /**
   * Upload the given {@link FileItem} array to the desired endpoint
   *
   * @param url to post body too
   * @param body to be posted to the endpoint
   * @param fileItem to be uploaded
   * @returns observable of the passed in object
   */
  uploadImages(url: string, body?: any, fileItem?: FileItem[]): Observable<any> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}`;
    const formData: FormData = new FormData();
    fileItem.forEach((f) => {
      let filename = f?.file?.name && f?.file?.name.trim().length > 0 ? f.file.name : f._file.name;
      formData.append('file', f._file, filename);
    });
    formData.append('body', new Blob([JSON.stringify(body)], { type: 'application/json' }));

    return this.http.post<FileItem>(endpoint, formData, {
      headers: {
        enctype: 'application/octet-stream',
      },
    });
  }

  /**
   * Upload the given {@link FileItem} array to the desired endpoint
   *
   * @param url to post body too
   * @param body to be posted to the endpoint
   * @param fileItem to be uploaded
   * @returns observable of the passed in object
   */
  uploadImage(url: string, body?: any, fileItem?: FileItem): Observable<any> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}`;
    const formData: FormData = new FormData();
    let filename =
      fileItem?.file?.name && fileItem?.file?.name.trim().length > 0 ? fileItem.file.name : fileItem._file.name;
    formData.append('file', fileItem._file, filename);
    formData.append('body', new Blob([JSON.stringify(body)], { type: 'application/json' }));

    return this.http.post(endpoint, formData, {
      responseType: 'text',
      headers: {
        enctype: 'application/octet-stream',
      },
    });
  }

  /**
   * Upload the given {@link FileItem} to the desired endpoint
   *
   * @param url to post body too
   * @param body to be posted to the endpoint
   * @returns observable of the passed in object
   */
  upload(url: string, fileItem?: FileItem, path?: string): Observable<any> {
    let endpoint = `${this.urlService.getAPIUrl()}/${url}`;
    const formData: FormData = new FormData();
    formData.append('file', fileItem._file, fileItem._file.name);
    formData.append('path', path);

    return this.http.post<FileItem>(endpoint, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
