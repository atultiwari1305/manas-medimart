import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownCarouselComponent } from './down-carousel.component';

describe('DownCarouselComponent', () => {
  let component: DownCarouselComponent;
  let fixture: ComponentFixture<DownCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
