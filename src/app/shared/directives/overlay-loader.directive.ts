import { Directive, EmbeddedViewRef, Input, OnChanges, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[appOverlayLoader]',
})
export class AppOverlayLoaderDirective implements OnChanges {
  private readonly templateRef = inject<TemplateRef<any>>(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input('appOverlayLoader') isLoading: boolean = false;

  private embeddedView?: EmbeddedViewRef<any>;

  ngOnChanges(): void {
    this.viewContainer.clear();

    if (this.isLoading) {
      this.embeddedView = this.viewContainer.createEmbeddedView(this.templateRef);
      const hostElem = this.embeddedView.rootNodes[0];

      hostElem.style.position = 'relative';

      const overlay = document.createElement('div');
      overlay.className = 'app-overlay-loader';

      const spinner = document.createElement('div');
      spinner.className = 'app-overlay-loader__spinner';
      overlay.appendChild(spinner);

      hostElem.appendChild(overlay);
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
