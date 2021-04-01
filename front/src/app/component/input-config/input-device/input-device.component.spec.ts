import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMediaComponent } from './input-device.component';

describe('InputMediaComponent', () => {
  let component: InputMediaComponent;
  let fixture: ComponentFixture<InputMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
