import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  imports: [MatIconModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  standalone: true
})
export class StatCard {
  title = input.required<string>();

  value = input.required<string | number>();

  icon = input.required<string>();

  color = input('orange');
}
