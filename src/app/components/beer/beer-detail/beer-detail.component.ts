import { Component, DestroyRef } from '@angular/core';
import { Beer } from '../../../models/beer';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BeerService } from '../../../services/beer.service';

@Component({
  selector: 'app-beer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beer-detail.component.html',
  styleUrl: './beer-detail.component.scss'
})
export class BeerDetailComponent {
  beer: Beer | undefined;

  constructor(
      private readonly destroyRef: DestroyRef,
      private readonly route: ActivatedRoute,
      readonly beerService: BeerService,
    ){}

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.beer = res?.['data'].beer;
    });
  }

}
