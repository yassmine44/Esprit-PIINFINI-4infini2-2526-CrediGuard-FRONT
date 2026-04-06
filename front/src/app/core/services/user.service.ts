

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface User {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  userType?: 'ADMIN' | 'CLIENT' | 'BENEFICIARY' | 'PARTNER';
  enabled?: boolean;
}


export interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  userType: 'ADMIN' | 'CLIENT' | 'BENEFICIARY' | 'PARTNER';
  enabled?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090/api/users';


  constructor(private http: HttpClient) {}


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }


  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }


  getMyProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/me`);
  }


  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }


  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
}


