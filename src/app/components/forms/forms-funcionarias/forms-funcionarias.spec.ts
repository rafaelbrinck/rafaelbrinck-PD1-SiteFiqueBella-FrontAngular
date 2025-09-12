import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsFuncionarias } from './forms-funcionarias';

describe('FormsFuncionarias', () => {
  let component: FormsFuncionarias;
  let fixture: ComponentFixture<FormsFuncionarias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsFuncionarias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsFuncionarias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
