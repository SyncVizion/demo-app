import { ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';

export type ElementSelector = string | Element | ElementRef;

export const MIME_TYPE_EXT: { [key: string]: string } = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'application/json': '.json',
  'application/zip': '.zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/msword': '.doc',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
};

export enum ChangeMethod {
  BACKSPACE,
  BLUR,
  CLICK,
  COMMA,
  ENTER,
  PASTE,
  SELECT,
  SPACE,
}

export class Page<T> {
  content: T[];
  size: number;
  numberOfElements?: number;
  totalElements?: number;
  totalPages?: number;
  empty?: boolean;
  first?: boolean;
  last?: boolean;

  public static emptyPage() {
    const emptyPage = new Page<any>();
    emptyPage.content = [];
    emptyPage.size = 0;
    emptyPage.totalElements = 0;
    emptyPage.totalPages = 0;
    emptyPage.empty = true;
    emptyPage.first = true;
    emptyPage.last = true;
    return emptyPage;
  }

  public static of<T>(data: T[], totalElements?: number, totalPages = 1): Page<T> {
    const page = new Page<T>();
    page.content = data;
    page.size = data?.length;
    page.totalElements = totalElements ?? data?.length;
    page.totalPages = totalPages;
    page.empty = data?.length === 0;
    page.first = true;
    page.last = false;
    return page;
  }

  public static ofDataloader<T>(list: T[]): (params) => Observable<Page<T>> {
    return (params) => {
      const page = params.get('page') ? Number(params.get('page')[0] ?? 0) : 0;
      const size = params.get('size') ? Number(params.get('size')[0] ?? 5) : 1000;

      const start = page * size;
      const end = start + size;
      return of(this.of(list.slice(start, end), list.length, Math.ceil(list.length / size)));
    };
  }
}
