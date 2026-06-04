import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuoteList } from './my-quote-list';

describe('MyQuoteList', () => {
  let component: MyQuoteList;
  let fixture: ComponentFixture<MyQuoteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQuoteList],
    }).compileComponents();

    fixture = TestBed.createComponent(MyQuoteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
