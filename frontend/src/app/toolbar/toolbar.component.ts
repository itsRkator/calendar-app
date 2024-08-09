import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatMenuModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  todayDate: string;
  xCoOrdinate: number;
  currentDate: Date;

  viewOptions = ['Day', 'Week', 'Month', 'Year', 'Schedule', '4 days'];

  selectedOption = this.viewOptions[0];

  constructor() {
    const today = new Date();
    this.todayDate = `${today.getDate()}`;
    this.xCoOrdinate = this.todayDate.length === 1 ? 75 : 60;
    this.currentDate = new Date();
  }

  previousDay(): void {
    this.currentDate = new Date(
      this.currentDate.setDate(this.currentDate.getDate() - 1)
    );
  }

  nextDay(): void {
    this.currentDate = new Date(
      this.currentDate.setDate(this.currentDate.getDate() + 1)
    );
  }
}
