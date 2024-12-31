import { Component, DestroyRef } from '@angular/core';
import { Beer } from '../../../models/beer';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BeerService } from '../../../services/beer.service';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY } from 'rxjs';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-beer-detail',
  standalone: true,
  imports: [CommonModule, RatingModule, FormsModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './beer-detail.component.html',
  styleUrl: './beer-detail.component.scss'
})
export class BeerDetailComponent {
  beer: Beer | undefined;

  constructor(
      private readonly destroyRef: DestroyRef,
      private readonly route: ActivatedRoute,
      readonly beerService: BeerService,
      private messageService: MessageService,
    ){}

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.beer = res?.['data'].beer;
    });
  }

  rateBeer(beer: Beer, event: any){
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();
    this.beerService.addBeerRating(beer, event.value).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message});
        beer.ratings = beer.ratings;
        beer.rating = (beer.ratings.reduce((sum, val) => sum + val, 0))/beer.ratings.length;
        return EMPTY;
      })
    ).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Beer rated successfully!' });
      beer.ratings = res.ratings;
      beer.rating = (res.ratings.reduce((sum, val) => sum + val, 0))/res.ratings.length;
    });
  }

}
