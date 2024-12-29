import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { BeerService } from "../../services/beer.service";
import { Beer } from "../../models/beer";
import { map, NEVER, of } from "rxjs";

export const beerListResolver: ResolveFn<Object> = (route, state) => {
  const beerService = inject(BeerService);
  return beerService.getBeerList().pipe(
    map((response: Beer[]) => {
      return {beerList: response}
    })
  );
}

export const beerDetailResolver: ResolveFn<Object> = (route, state) => {
  const router = inject(Router);
  const beerId = route.paramMap.get('id');
  const beerService = inject(BeerService);
  if(!beerId){
    router.navigate(['/']);
    return of(NEVER);
  }
  return beerService.getBeerDetail(beerId).pipe(
    map((response: Beer) => {
      return {beer: response}
    })
  );
}

export const myCollectionResolver: ResolveFn<Object> = (route, state) => {
  const beerService = inject(BeerService);
  const currentCollection = localStorage.getItem(beerService.BEER_COLLECTION);  
  return beerService.getBeerList().pipe(
    map((response: Beer[]) => {
      if(currentCollection){
        const json = JSON.parse(currentCollection);
        const filtered = response.filter(elem => json.includes(elem.id));
        return {beerList: filtered, currentCollection: true};
      }
      return {beerList: [], currentCollection: true}
    })
  );
}