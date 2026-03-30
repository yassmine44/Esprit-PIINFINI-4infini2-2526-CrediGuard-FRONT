import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  cards = [
    {
      title: 'Events List',
      description: 'Manage all scheduled events and their status.',
      value: 0,
      action: 'Open Events'
    },
    {
      title: 'Registrations',
      description: 'Track participant registrations and confirmations.',
      value: 0,
      action: 'Open Registrations'
    },
    {
      title: 'Agenda',
      description: 'Manage sessions, schedules, and event timeline.',
      value: 0,
      action: 'Open Agenda'
    },
    {
      title: 'Speakers / Guests',
      description: 'Manage speakers, guests, and invited participants.',
      value: 0,
      action: 'Open Guests'
    },
    {
      title: 'Locations',
      description: 'Track venues, rooms, and event logistics.',
      value: 0,
      action: 'Open Locations'
    },
    {
      title: 'Notifications',
      description: 'Send and monitor event reminders and announcements.',
      value: 0,
      action: 'Open Notifications'
    }
  ];
}