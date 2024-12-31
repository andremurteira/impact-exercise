import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Beer } from '../models/beer';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  private readonly BASE_API = 'https://67629e2846efb373237542ad.mockapi.io/api';
  readonly CACHE_IMAGES = 'images';
  readonly BEER_COLLECTION = 'collection';

  collectionLength$ = new Subject<number>();

  httpClient = inject(HttpClient);

  getBeerList(): Observable<Beer[]> {
    const url = `${this.BASE_API}/list`;
    return this.httpClient.get<Beer[]>(url);
  }

  getBeerDetail(id: string): Observable<Beer> {
    const url = `${this.BASE_API}/list/${id}`;
    return this.httpClient.get<Beer>(url);
  }

  createBeer(beer: Partial<Beer>): Observable<Beer> {
    const url = `${this.BASE_API}/list/`;
    return this.httpClient.post<Beer>(url, beer);
  }

  getBeerYear(date: string){
    return new Date(date).getFullYear();
  }

  getImageById(id: number){
    const cache = localStorage.getItem(this.CACHE_IMAGES);
    if(cache){
      const json = JSON.parse(cache);
      return json[id];
    }
  }

  getCollection(){
    const currentCollection = localStorage.getItem(this.BEER_COLLECTION);
    if(currentCollection){
      return JSON.parse(currentCollection);
    }
    return [];
  }

  addToCollection(beerId: number){
    const collection: number[] = this.getCollection();
    if(collection.length > 0){
      collection.push(beerId);
      localStorage.setItem(this.BEER_COLLECTION, JSON.stringify(collection));
      this.collectionLength$.next(collection.length);
    }
    else{
      localStorage.setItem(this.BEER_COLLECTION, JSON.stringify([beerId]));
      this.collectionLength$.next(1);
    }
  }

  removeFromCollection(beerId: number){
    const collection: number[] = this.getCollection();
    if(collection.length > 0){
      const removed = collection.filter(elem => elem !== beerId);
      localStorage.setItem(this.BEER_COLLECTION, JSON.stringify(removed));
      this.collectionLength$.next(removed.length);
    }
  }

  inCollection(beerId: number){
    const collection: number[] = this.getCollection();
    if(collection.length > 0){
      const exists = collection.findIndex(elem => elem === beerId);
      return exists > -1;
    }
    return false;
  }

  addBeerRating(beer: Beer, rating: number): Observable<Beer> {
    const newRatings = beer.ratings.slice();
    newRatings.push(rating);
    const newRating = (newRatings.reduce((sum, val) => sum + val, 0))/newRatings.length;
    const url = `${this.BASE_API}/list/${beer.id}`;
    return this.httpClient.put<Beer>(url, {...beer, ratings: newRatings, rating: newRating});
  }
}
