import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import {
  CdkDragMove,
  CdkDragEnd,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { AppointmentService } from '../services/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

interface Appointment {
  id?: string;
  title: string;
  date: Date;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatIconModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  appointments: Appointment[] = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  currentDate: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe((appointments) => {
      this.appointments = appointments;
    });
  }

  openAppointmentForm(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '250px',
      data: { title: '', date: new Date(this.currentDate) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService
          .createAppointment(result)
          .subscribe((newAppointment) => {
            this.appointments.push(newAppointment);
          });
      }
    });
  }

  getAppointmentsForHour(hour: number): Appointment[] {
    return this.appointments.filter((app) => {
      const appointmentDate = new Date(app.date);
      return (
        appointmentDate.getDate() === this.currentDate.getDate() &&
        appointmentDate.getMonth() === this.currentDate.getMonth() &&
        appointmentDate.getFullYear() === this.currentDate.getFullYear() &&
        appointmentDate.getHours() === hour
      );
    });
  }

  onDragMoved(event: CdkDragMove<any>, appointment: Appointment): void {
    const newPosition =
      event.pointerPosition.y -
      event.source.element.nativeElement.getBoundingClientRect().top;
    const newHour = Math.floor(newPosition / 50); // Assuming 50px per hour
    appointment.date.setHours(newHour);
  }

  onDragReleased(event: CdkDragEnd<any>, appointment: Appointment): void {
    const newPosition = event.distance.y;
    const newHour = Math.floor(newPosition / 50); // Assuming 50px per hour
    const newDate = new Date(appointment.date);
    newDate.setHours(newDate.getHours() + newHour);
    const updatedAppointment = { ...appointment, date: newDate };
    this.appointmentService
      .updateAppointment(appointment.id!, updatedAppointment)
      .subscribe(() => {
        appointment.date = newDate;
      });
  }

  deleteAppointment(id: string | undefined): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.appointments = this.appointments.filter((app) => app.id !== id);
    });
  }

  previousDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.loadAppointments();
  }

  nextDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.loadAppointments();
  }
}
