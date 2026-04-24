import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { VirtualCardsGridComponent } from 'src/app/shared/components/common/virtual-cards-grid/virtual-cards-grid.component';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { PokemonSet } from 'src/app/shared/models/pokemon-card.model';
import { SetsService } from 'src/services/pokemon/sets.service';

@Component({
  selector: 'app-sets-detail',
  templateUrl: './sets-detail.component.html',
  styleUrl: './sets-detail.component.scss',
  imports: [RouterModule, CardModule, ScrollingModule, VirtualCardsGridComponent],
})
export class SetsDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(SetsService);

  destroyRef = inject(DestroyRef);

  dataLoader: (params: any) => Observable<any>;

  set: PokemonSet;

  ngOnInit() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.set = res.set;
      this.setDataLoader();
    });
  }

  setDataLoader() {
    this.dataLoader = (params) => {
      params.set('setIds', [this.set.id]);
      return this.service.getCards(params);
    };
  }

  onRowClick(event: any) {
    this.router.navigateByUrl(`/cards/${event.id}`);
  }
}
