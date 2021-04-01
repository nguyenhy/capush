import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOSettingComponent } from './io-setting.component';

describe('IOSettingComponent', () => {
  let component: IOSettingComponent;
  let fixture: ComponentFixture<IOSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IOSettingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IOSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
