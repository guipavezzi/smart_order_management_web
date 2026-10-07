import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderResponse, Status } from '../models/order.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`; 
  public metricsUpdated = new Subject<void>();

  constructor(private http: HttpClient) { }

  getOrders(activeOnly: boolean = false, completedOnly: boolean = false, includeArchived: boolean = false): Observable<OrderResponse[]> {
    let params = new HttpParams()
      .set('activeOnly', activeOnly.toString())
      .set('completedOnly', completedOnly.toString())
      .set('includeArchived', includeArchived.toString());

    return this.http.get<OrderResponse[]>(this.apiUrl, { params });
  }

  closeShift(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/close-shift`, {}).pipe(
      tap(() => this.metricsUpdated.next())
    );
  }

  getMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/metrics`);
  }

  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics`);
  }

  createOrder(order: any): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order).pipe(
      tap(() => this.metricsUpdated.next())
    );
  }

  updateOrderStatus(id: string, status: Status): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, status).pipe(
      tap(() => this.metricsUpdated.next())
    );
  }

  updateOrder(id: string, order: any): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}`, order).pipe(
      tap(() => this.metricsUpdated.next())
    );
  }

  deleteOrder(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.metricsUpdated.next())
    );
  }
}