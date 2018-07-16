import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductHandComponent } from './edit-product-hand.component';

describe('EditProductHandComponent', () => {
  let component: EditProductHandComponent;
  let fixture: ComponentFixture<EditProductHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
