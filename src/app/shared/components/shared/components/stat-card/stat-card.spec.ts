import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCard } from './stat-card';

describe('StatCard', () => {
  let component: StatCard;
  let fixture: ComponentFixture<StatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'receipt_long');
    fixture.componentRef.setInput('title', 'Teste');
    fixture.componentRef.setInput('value', 10);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
