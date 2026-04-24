import {
  DestroyRef,
  Directive,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSkeletonLoaderComponent, NgxSkeletonLoaderConfigTheme } from 'ngx-skeleton-loader';
import { UserAccessService } from 'src/services/auth/user-access.service';

@Directive({
  selector: '[skeletonLoading]',
  standalone: true,
})
export class AppSkeletonLoaderDirective implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly userAccessService = inject(UserAccessService);

  @Input('skeletonLoading') isLoading = false;
  @Input('skeletonLoadingCount') count = 1;
  @Input('skeletonLoadingAppearance') appearance: 'line' | 'square' | 'circle' = 'line';
  @Input('skeletonLoadingSize') size?: number | string;
  @Input('skeletonLoadingWidth') width?: number | string;
  @Input('skeletonLoadingHeight') height?: number | string;
  @Input('skeletonLoadingTheme') theme?: NgxSkeletonLoaderConfigTheme;
  @Input('skeletonLoadingAlign') align?: 'left' | 'center' | 'right';

  constructor() {
    this.userAccessService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.render());
  }

  // React when inputs (like isLoading) change
  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  private render(): void {
    this.vcr.clear();

    if (this.isLoading) {
      const componentRef = this.vcr.createComponent(NgxSkeletonLoaderComponent);

      componentRef.setInput('count', this.count);
      componentRef.setInput('appearance', this.appearance);

      const finalWidth = this.size ?? this.width;
      const finalHeight = this.size ?? this.height;

      if (this.align) componentRef.location.nativeElement.style.textAlign = this.align;

      componentRef.setInput('theme', {
        ...(finalWidth && { width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth }),
        ...(finalHeight && { height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight }),
        background: 'var(--mat-skeleton-loader-background-color)',
        '--ngx-skeleton-loader-background-image-light-mode': 'var(--mat-skeleton-loader-action-color)',
        'border-radius': this.appearance === 'circle' ? '50%' : '8px',
        margin: '0',
        ...this.theme,
      });
    } else {
      this.vcr.createEmbeddedView(this.templateRef);
    }
  }
}
