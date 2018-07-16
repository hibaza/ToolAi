import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductHandComponent } from './add-product-hand.component';

describe('AddProductHandComponent', () => {
  let component: AddProductHandComponent;
  let fixture: ComponentFixture<AddProductHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
