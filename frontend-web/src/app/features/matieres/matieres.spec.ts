import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matieres } from './matieres';

describe('Matieres', () => {
  let component: Matieres;
  let fixture: ComponentFixture<Matieres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Matieres],
    }).compileComponents();

    fixture = TestBed.createComponent(Matieres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
