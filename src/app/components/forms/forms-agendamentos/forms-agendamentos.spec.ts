import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsAgendamentos } from './forms-agendamentos';

describe('FormsAgendamentos', () => {
  let component: FormsAgendamentos;
  let fixture: ComponentFixture<FormsAgendamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsAgendamentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsAgendamentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
