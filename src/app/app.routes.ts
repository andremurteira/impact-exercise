import { Routes } from '@angular/router';
import { BeerDetailComponent } from './components/beer/beer-detail/beer-detail.component';
import { BeerListComponent } from './components/beer/beer-list/beer-list.component';
import { beerDetailResolver, beerListResolver, myCollectionResolver } from './components/beer/beer.resolver';
import { NewBeerComponent } from './components/beer/new-beer/new-beer.component';

export const routes: Routes = [
  {
    path: '',
    component: BeerListComponent,
    resolve: {
      data: beerListResolver
    },
  },
  {
    path: 'detail/:id',
    component: BeerDetailComponent,
    resolve: {
      data: beerDetailResolver
    },
  },
  {
    path: 'new',
    component: NewBeerComponent,
  },
  {
    path: 'my-collection',
    component: BeerListComponent,
    resolve: {
      data: myCollectionResolver
    },
  },
];
