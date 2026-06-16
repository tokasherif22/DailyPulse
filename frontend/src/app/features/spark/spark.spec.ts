import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spark } from './spark';

describe('Spark', () => {
  let component: Spark;
  let fixture: ComponentFixture<Spark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spark],
    }).compileComponents();

    fixture = TestBed.createComponent(Spark);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
