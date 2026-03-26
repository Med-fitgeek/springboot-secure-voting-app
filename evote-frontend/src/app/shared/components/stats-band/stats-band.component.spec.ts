import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBandComponent } from './stats-band.component';

describe('StatsBandComponent', () => {
  let component: StatsBandComponent;
  let fixture: ComponentFixture<StatsBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsBandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
