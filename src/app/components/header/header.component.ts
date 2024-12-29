import { Component, DestroyRef, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BeerService } from '../../services/beer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule, MenuModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items: MenuItem[] = [];
  
  constructor(private readonly beerService: BeerService,
        private readonly destroyRef: DestroyRef,){}

  ngOnInit() {
    const size: number[] = this.beerService.getCollection();
    this.items = [
      {
        label: 'My collection',
        icon: 'pi pi-list-check',
        routerLink: ['/my-collection'],
        badge: size.length.toString(),
      },
    ];
    this.beerService.collectionLength$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((size) => {
      this.items[0].badge = size.toString();
    })
  }
}
