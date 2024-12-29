import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeerComponent } from './new-beer.component';

describe('NewBeerComponent', () => {
  let component: NewBeerComponent;
  let fixture: ComponentFixture<NewBeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBeerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewBeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
