import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar_back/sidebar.component';
import { TopbarComponent } from '../../components/topbar_back/topbar.component';
import { FooterComponent } from '../../components/footer_back/footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent
],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

  constructor(private router: Router) {}

  goProfile() {
    this.router.navigate(['/admin/profile']);
  }

}