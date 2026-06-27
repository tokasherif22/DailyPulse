import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookPost } from './facebook-post';

describe('FacebookPost', () => {
  let component: FacebookPost;
  let fixture: ComponentFixture<FacebookPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookPost],
    }).compileComponents();

    fixture = TestBed.createComponent(FacebookPost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
