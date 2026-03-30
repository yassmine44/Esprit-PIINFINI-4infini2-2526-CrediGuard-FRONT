import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransportService {
  id?: number;
  eventId: number;
  transportType: string;
  departurePlace: string;
  departureTime: string;
  returnTime: string;
  capacity: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private apiUrl = 'http://localhost:8089/api/transports';

  constructor(private http: HttpClient) {}

  getTransportServices(): Observable<TransportService[]> {
    return this.http.get<TransportService[]>(`${this.apiUrl}/services`);
  }

  getTransportService(id: number): Observable<TransportService> {
    return this.http.get<TransportService>(`${this.apiUrl}/services/${id}`);
  }

  createTransportService(service: TransportService): Observable<TransportService> {
    return this.http.post<TransportService>(`${this.apiUrl}/services`, service);
  }

  updateTransportService(id: number, service: TransportService): Observable<TransportService> {
    return this.http.put<TransportService>(`${this.apiUrl}/services/${id}`, service);
  }

  deleteTransportService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/services/${id}`);
  }
}
