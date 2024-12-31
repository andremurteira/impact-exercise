import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, Signal, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Beer } from '../../../models/beer';
import { BeerService } from '../../../services/beer.service';
import { ButtonModule } from 'primeng/button';
import { faker } from '@faker-js/faker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataViewModule, DataViewSortEvent } from 'primeng/dataview';
import { MessageService, SelectItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-beer-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, ReactiveFormsModule, DataViewModule, ToastModule, TooltipModule, DropdownModule, MultiSelectModule, RatingModule],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
  templateUrl: './beer-list.component.html',
  styleUrl: './beer-list.component.scss'
})
export class BeerListComponent implements OnInit {
  ROWS_PER_PAGE = 8;
  sortData: DataViewSortEvent | undefined;
  filteredBeers: Beer[] = [];
  allBeers: Beer[] = [];
  beerTypes: { name: string; id: string; }[] = [];
  selectedTypes: string[] = [];
  layout: Signal<"list" | "grid"> = signal('list');
  isCollectionPage = signal(false);
  sortOptions: SelectItem[] = [
    {
      label: 'Newest first',
      value: '!date' 
    },
    {
      label: 'Oldest first',
      value: 'date'
    },
    {
      label: 'Name A-Z',
      value: 'name' 
    },
    {
      label: 'Name Z-A',
      value: '!name'
    }
  ];
  sortOrder = 1;
  sortField = 'name';
  sortKey = 'name';

  @ViewChild('dataview') dataView: any | undefined;

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly beerService: BeerService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      const cachedImages = localStorage.getItem(this.beerService.CACHE_IMAGES);
      const imagesToCache: { [key: number]: string; } = {};
      const list = res?.['data'].beerList;
      this.isCollectionPage.set(res?.['data'].currentCollection);
      if(!cachedImages){
        const images = Array.from({ length: res?.['data'].beerList.length }, () => faker.image.urlPicsumPhotos({
          width: 300,
          height: 300,
          blur: 0,
          grayscale: false,
        }));
        this.allBeers = list.map((beer: Beer, index: number) => {
          imagesToCache[beer.id] = images[index];
          return ({
            ...beer,
            image: beer.image ?? images[index],
          });
        });
        localStorage.setItem(this.beerService.CACHE_IMAGES, JSON.stringify(imagesToCache));
      }
      else{
        this.allBeers = list.map((beer: Beer) => {
          return ({
            ...beer,
            image: beer.image ?? this.beerService.getImageById(beer.id),
          });
        });
      }
      this.beerTypes = Array.from(
        new Set(
          this.allBeers.map((beer: Beer) => {
            return ({
              name: beer.type,
              id: beer.type,
            });
          })
        )
      );
      this.assignBeers(this.allBeers);
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

  handleSort(event: DataViewSortEvent) {
    this.sortData = event;
  }

  assignBeers(beers: Beer[]){
    if(this.sortData){
      if(this.sortData.sortField === 'name'){
        beers.sort((a, b) => this.sortData?.sortOrder === 1 ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      }
      else if(this.sortData.sortField === 'date'){
        beers.sort((a, b) => this.sortData?.sortOrder === 1 ? new Date(a.date).getTime() - new Date(b.date).getTime(): new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    }
    this.filteredBeers = beers.slice();
    this.dataView?.paginate({
      first: 0,
      rows: 8,
    });
  }

  changedTypes(data: any){
    const selectedTypes = data.value.map((elem: any) => elem.name);
    if(selectedTypes.length > 0){
      const filterBeers = this.allBeers.filter((elem: Beer) => {
        return selectedTypes.indexOf(elem.type) > -1;
      });
      this.assignBeers(filterBeers);
    }
    else{
      this.assignBeers(this.allBeers);
    }
  }

  addToCollection(beerId: number, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.beerService.addToCollection(beerId);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Beer added to your collection!' });
  }

  removeFromCollection(beerId: number, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.beerService.removeFromCollection(beerId);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Beer removed from your collection!' });
    if(this.isCollectionPage()){
      this.allBeers = this.allBeers.filter((elem: Beer) => elem.id !== beerId);
      this.assignBeers(this.allBeers);
    }
  }

  isInCollection(id: number){
    return this.beerService.inCollection(id);
  }

  onSortChange(event: any) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  addNew(){
    this.router.navigate(['new']);
  }

  viewDetail(id: number){
    this.router.navigate(['detail', id]);
  }
}
