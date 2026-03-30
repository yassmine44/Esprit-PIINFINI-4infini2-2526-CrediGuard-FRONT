import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss',
})
export class CreditComponent {}