import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormServico } from './form-servico';

describe('FormServico', () => {
  let component: FormServico;
  let fixture: ComponentFixture<FormServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormServico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormServico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
