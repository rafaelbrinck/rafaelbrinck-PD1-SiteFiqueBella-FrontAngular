import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Funcionarias } from './funcionarias';

describe('Funcionarias', () => {
  let component: Funcionarias;
  let fixture: ComponentFixture<Funcionarias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Funcionarias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Funcionarias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
