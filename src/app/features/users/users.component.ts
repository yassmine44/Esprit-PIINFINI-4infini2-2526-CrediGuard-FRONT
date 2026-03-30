import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { UserService, User } from '../../core/services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  loading = false;
  searchTerm = '';

  currentPage = 1;
  pageSize = 5;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.userService.getUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = [...data];
          this.currentPage = 1;
        },
        error: (err) => {
          console.error('LOAD USERS ERROR', err);
          this.users = [];
          this.filteredUsers = [];
        }
      });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.loading = true;

      this.userService.createUser(result)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res) => {
            console.log('CREATED ✅', res);
            this.loadUsers();
          },
          error: (err) => {
            console.error('CREATE ERROR ❌', err);
          }
        });
    });
  }

 openEditUserDialog(user: User): void {
  const dialogRef = this.dialog.open(EditUserDialogComponent, {
    width: '400px',
    data: user
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('EDIT RESULT =>', result);

    if (!result || !user.id) return;

    this.loading = true;

    this.userService.updateUser(user.id, result).subscribe({
      next: (res) => {
        console.log('UPDATED ✅', res);
        this.loadUsers();
      },
      error: (err) => {
        console.error('UPDATE ERROR ❌', err);
        console.error('UPDATE PAYLOAD ❌', result);
        console.error('UPDATE BACKEND BODY ❌', err.error);
        this.loading = false;
      }
    });
  });
}

  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) return;

    this.loading = true;

    this.userService.deleteUser(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('DELETE ERROR ❌', err);
        }
      });
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );

    this.currentPage = 1;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  get totalUsersCount(): number {
  return this.users.length;
}

get activeUsersCount(): number {
  return this.users.filter(user => user.enabled).length;
}

get disabledUsersCount(): number {
  return this.users.filter(user => !user.enabled).length;
}

get adminUsersCount(): number {
  return this.users.filter(user => user.userType === 'ADMIN').length;
}
}