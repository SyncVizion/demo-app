import { provideHttpClient } from '@angular/common/http';
import { TestModuleMetadata } from '@angular/core/testing';
import { AppComponent } from 'src/app/app.component';
import { AbstractTestBed } from './abstract-test-bed';

export class AppTestBed extends AbstractTestBed {
  static getModuleMetaData(): TestModuleMetadata {
    return {
      declarations: [AppComponent],
      providers: [provideHttpClient()],
    };
  }
}
