import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerListComponentComponent } from './beer-list-component.component';

describe('BeerListComponentComponent', () => {
  let component: BeerListComponentComponent;
  let fixture: ComponentFixture<BeerListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeerListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeerListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
